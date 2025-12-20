module fitsui::game {
    use std::string::{Self, String};
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::table::{Self, Table};

    // --- CÁC MÃ LỖI ---
    const E_NO_STAMINA: u64 = 2;
    const E_IN_COOLDOWN: u64 = 3;
    const E_MINT_COOLDOWN: u64 = 4;
    const E_NOT_FUSIBLE: u64 = 5; // Lỗi khi không cùng hệ hoặc level

    // --- CẤU HÌNH HỆ THỐNG ---
    const ONE_DAY_MS: u64 = 86400000; 
    const STAMINA_REGEN_MS: u64 = 60000; 
    const BASE_MAX_STAMINA: u64 = 100;

    public struct AdminCap has key { id: UID }

    public struct GameInfo has key {
        id: UID,
        admin: address,
        xp_per_workout: u64,
        level_threshold: u64,
        default_url: String, 
        cooldown_ms: u64,
        minters: Table<address, u64>, 
        hero_count: u64, 
    }

    public struct Hero has key, store {
        id: UID,
        name: String,
        level: u64,
        xp: u64,
        url: String,
        stamina: u64,
        strength: u64,
        element: u8, 
        last_update_timestamp: u64,
        number: u64, 
    }

    // --- EVENTS ---
    public struct HeroCreated has copy, drop { id: ID, owner: address, name: String, element: u8, number: u64 }
    public struct WorkoutCompleted has copy, drop { id: ID, owner: address, new_xp: u64, new_stamina: u64 }
    public struct HeroLeveledUp has copy, drop { id: ID, owner: address, new_level: u64 }
    public struct HeroFused has copy, drop { id: ID, owner: address, new_level: u64 }

    fun init(ctx: &mut TxContext) {
        let sender = ctx.sender();
        transfer::transfer(AdminCap { id: object::new(ctx) }, sender);
        
        transfer::share_object(GameInfo {
            id: object::new(ctx),
            admin: sender,
            xp_per_workout: 10,
            level_threshold: 50,
            default_url: string::utf8(b"https://beige-urgent-clam-163.mypinata.cloud/ipfs/bafkreifawrqdt2fehdyjvtdfdhsyqxs7seusw5hag37nfu6vyd7kh7admq"),
            cooldown_ms: 5000, 
            minters: table::new(ctx),
            hero_count: 0, 
        });
    }

    // --- HELPER FUNCTIONS ---
    fun u64_to_string(mut n: u64): String {
        if (n == 0) return string::utf8(b"0");
        let mut res = vector::empty<u8>();
        while (n > 0) {
            vector::push_back(&mut res, ((48 + (n % 10)) as u8));
            n = n / 10;
        };
        vector::reverse(&mut res);
        string::utf8(res)
    }

    fun get_max_stamina(level: u64): u64 {
        BASE_MAX_STAMINA + (level * 15)
    }

    fun get_next_level_threshold(level: u64, base_threshold: u64): u64 {
        let next_lv = level + 1;
        next_lv * next_lv * base_threshold
    }

    // --- MINT HERO (24H CHECK) ---
    public entry fun create_hero(game_info: &mut GameInfo, clock: &Clock, ctx: &mut TxContext) {
        let sender = ctx.sender();
        let current_time = clock::timestamp_ms(clock);

        // 👇 Kiểm tra giới hạn 24h
        if (table::contains(&game_info.minters, sender)) {
            let last_mint = *table::borrow(&game_info.minters, sender);
            assert!(current_time >= last_mint + ONE_DAY_MS, E_MINT_COOLDOWN);
            table::remove(&mut game_info.minters, sender);
        };
        table::add(&mut game_info.minters, sender, current_time);

        game_info.hero_count = game_info.hero_count + 1;
        let current_hero_number = game_info.hero_count;

        let mut name_label = string::utf8(b"SuiHero #");
        string::append(&mut name_label, u64_to_string(current_hero_number));

        let uid = object::new(ctx);
        let id_inner = object::uid_to_inner(&uid);
        let id_bytes = object::id_to_bytes(&id_inner);
        let element = (*vector::borrow(&id_bytes, 0) as u64) % 5; 

        let hero = Hero {
            id: uid,
            name: name_label,
            level: 0,
            xp: 0,
            url: game_info.default_url,
            stamina: BASE_MAX_STAMINA, 
            strength: 1, 
            element: (element as u8), 
            last_update_timestamp: current_time,
            number: current_hero_number,
        };
        
        event::emit(HeroCreated { 
            id: object::uid_to_inner(&hero.id), 
            owner: sender, 
            name: hero.name, 
            element: hero.element,
            number: hero.number 
        });
        transfer::transfer(hero, sender);
    }

    // --- FUSION LOGIC (3 Heroes -> Level + 2) ---
    public entry fun fuse_heroes(
        h1: Hero, 
        h2: Hero, 
        h3: Hero, 
        game_info: &mut GameInfo, 
        clock: &Clock, 
        ctx: &mut TxContext
    ) {
        // 👇 Kiểm tra điều kiện Fusion: Cùng hệ và Cùng Level
        assert!(h1.element == h2.element && h2.element == h3.element, E_NOT_FUSIBLE);
        assert!(h1.level == h2.level && h2.level == h3.level, E_NOT_FUSIBLE);

        let sender = ctx.sender();
        let current_time = clock::timestamp_ms(clock);
        let fused_level = h1.level + 2;
        let fused_element = h1.element;
        
        // Tạo Hero mới kế thừa từ Hero chính
        game_info.hero_count = game_info.hero_count + 1;
        let mut fused_name = string::utf8(b"Fused Hero #");
        string::append(&mut fused_name, u64_to_string(game_info.hero_count));

        let fused_hero = Hero {
            id: object::new(ctx),
            name: fused_name,
            level: fused_level,
            xp: 0, // Reset XP sau khi fuse
            url: h1.url, // Giữ lại URL của con đầu tiên
            stamina: get_max_stamina(fused_level), // Hồi đầy mana
            strength: fused_level + 1, 
            element: fused_element,
            last_update_timestamp: current_time,
            number: game_info.hero_count,
        };

        // 🔥 "Burn" 3 Hero cũ bằng cách unpacking
        let Hero { id: id1, name: _, level: _, xp: _, url: _, stamina: _, strength: _, element: _, last_update_timestamp: _, number: _ } = h1;
        let Hero { id: id2, name: _, level: _, xp: _, url: _, stamina: _, strength: _, element: _, last_update_timestamp: _, number: _ } = h2;
        let Hero { id: id3, name: _, level: _, xp: _, url: _, stamina: _, strength: _, element: _, last_update_timestamp: _, number: _ } = h3;
        
        object::delete(id1);
        object::delete(id2);
        object::delete(id3);

        event::emit(HeroFused { 
            id: object::uid_to_inner(&fused_hero.id), 
            owner: sender, 
            new_level: fused_level 
        });

        transfer::transfer(fused_hero, sender);
    }

    public entry fun workout(hero: &mut Hero, game_info: &GameInfo, clock: &Clock, multiplier: u64, ctx: &mut TxContext) {
        let current_time = clock::timestamp_ms(clock);
        let time_passed = current_time - hero.last_update_timestamp;
        let stamina_regen = time_passed / STAMINA_REGEN_MS;
        let max_stamina = get_max_stamina(hero.level);
        
        if (stamina_regen > 0) {
            hero.stamina = if (hero.stamina + stamina_regen > max_stamina) { max_stamina } 
                          else { hero.stamina + stamina_regen };
        };

        assert!(current_time >= hero.last_update_timestamp + game_info.cooldown_ms, E_IN_COOLDOWN);
        let total_stamina_cost = 10 * multiplier;
        assert!(hero.stamina >= total_stamina_cost, E_NO_STAMINA);
        
        hero.stamina = hero.stamina - total_stamina_cost;
        let level_bonus = hero.level * 3;
        let xp_gain = (game_info.xp_per_workout + level_bonus) * hero.strength * multiplier;
        
        hero.xp = hero.xp + xp_gain;
        hero.last_update_timestamp = current_time;

        event::emit(WorkoutCompleted { id: object::uid_to_inner(&hero.id), owner: ctx.sender(), new_xp: hero.xp, new_stamina: hero.stamina });
        check_level_up(hero, game_info, ctx);
    }

    fun check_level_up(hero: &mut Hero, game_info: &GameInfo, ctx: &TxContext) {
        let mut threshold = get_next_level_threshold(hero.level, game_info.level_threshold);
        while (hero.xp >= threshold) {
            hero.level = hero.level + 1;
            hero.strength = hero.strength + 1;
            hero.stamina = get_max_stamina(hero.level);
            event::emit(HeroLeveledUp { id: object::uid_to_inner(&hero.id), owner: ctx.sender(), new_level: hero.level });
            threshold = get_next_level_threshold(hero.level, game_info.level_threshold);
        }
    }

    public entry fun update_default_url(_: &AdminCap, game_info: &mut GameInfo, new_url: vector<u8>) {
        game_info.default_url = string::utf8(new_url);
    }
}