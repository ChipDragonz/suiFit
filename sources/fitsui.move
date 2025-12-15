module fitsui::game {
    use std::string::{Self, String};
    use std::vector;
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::table::{Self, Table}; // <--- MỚI: Dùng Table để lưu danh sách người chơi

    // --- MÃ LỖI ---
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_IN_COOLDOWN: u64 = 2;
    const E_HERO_EXIST: u64 = 3; // <--- MỚI: Lỗi đã có nhân vật

    // --- STRUCTS ---
    public struct AdminCap has key { id: UID }

    public struct GameInfo has key {
        id: UID,
        admin: address,
        xp_per_workout: u64,
        level_threshold: u64,
        level_urls: vector<String>,
        cooldown_ms: u64,
        minters: Table<address, bool>, // <--- MỚI: Danh sách những người đã Mint
    }

    public struct Hero has key, store {
        id: UID,
        name: String,
        level: u64,
        xp: u64,
        url: String,
        last_workout_timestamp: u64,
    }

    // --- EVENTS ---
    public struct HeroCreated has copy, drop { id: ID, owner: address, name: String }
    public struct HeroLeveledUp has copy, drop { id: ID, owner: address, new_level: u64, new_url: String }
    public struct WorkoutCompleted has copy, drop { id: ID, owner: address, new_xp: u64 }

    // --- INIT ---
    fun init(ctx: &mut TxContext) {
        let sender = ctx.sender();
        transfer::transfer(AdminCap { id: object::new(ctx) }, sender);

        let mut urls = vector::empty<String>();
        vector::push_back(&mut urls, string::utf8(b"https://i.imgur.com/Level1_Image.png"));
        vector::push_back(&mut urls, string::utf8(b"https://i.imgur.com/Level2_Image.png"));
        vector::push_back(&mut urls, string::utf8(b"https://i.imgur.com/Level3_Image.png"));

        transfer::share_object(GameInfo {
            id: object::new(ctx),
            admin: sender,
            xp_per_workout: 10,
            level_threshold: 50,
            level_urls: urls,
            cooldown_ms: 5000,
            minters: table::new(ctx), // <--- MỚI: Khởi tạo bảng rỗng
        });
    }

    // --- FUNCTIONS ---

    // 1. Tạo Hero (Có kiểm tra sở hữu)
    public entry fun create_hero(name: vector<u8>, game_info: &mut GameInfo, ctx: &mut TxContext) {
        let sender = ctx.sender();

        // <--- MỚI: Kiểm tra xem ông này đã mint chưa?
        assert!(!table::contains(&game_info.minters, sender), E_HERO_EXIST);

        // <--- MỚI: Đánh dấu là đã mint
        table::add(&mut game_info.minters, sender, true);

        let url = *vector::borrow(&game_info.level_urls, 0);
        let hero = Hero {
            id: object::new(ctx),
            name: string::utf8(name),
            level: 0,
            xp: 0,
            url: url,
            last_workout_timestamp: 0,
        };

        event::emit(HeroCreated {
            id: object::uid_to_inner(&hero.id),
            owner: sender,
            name: hero.name,
        });

        transfer::transfer(hero, sender);
    }

    // 2. Workout (Giữ nguyên)
    public entry fun workout(hero: &mut Hero, game_info: &GameInfo, clock: &Clock, ctx: &mut TxContext) {
        let current_time = clock::timestamp_ms(clock);
        assert!(current_time >= hero.last_workout_timestamp + game_info.cooldown_ms, E_IN_COOLDOWN);
        
        hero.xp = hero.xp + game_info.xp_per_workout;
        hero.last_workout_timestamp = current_time;

        event::emit(WorkoutCompleted {
            id: object::uid_to_inner(&hero.id),
            owner: ctx.sender(),
            new_xp: hero.xp,
        });

        check_level_up(hero, game_info, ctx);
    }

    fun check_level_up(hero: &mut Hero, game_info: &GameInfo, ctx: &TxContext) {
        if (hero.xp >= (hero.level + 1) * game_info.level_threshold) {
            let next_level = hero.level + 1;
            if (next_level < vector::length(&game_info.level_urls)) {
                hero.level = next_level;
                hero.url = *vector::borrow(&game_info.level_urls, next_level);
                event::emit(HeroLeveledUp {
                    id: object::uid_to_inner(&hero.id),
                    owner: ctx.sender(),
                    new_level: hero.level,
                    new_url: hero.url,
                });
            }
        }
    }

    // Admin Update (Giữ nguyên)
    public entry fun update_game_rules(_: &AdminCap, game_info: &mut GameInfo, new_xp: u64, new_threshold: u64, new_cooldown: u64) {
        game_info.xp_per_workout = new_xp;
        game_info.level_threshold = new_threshold;
        game_info.cooldown_ms = new_cooldown;
    }
}