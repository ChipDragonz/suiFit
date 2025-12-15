module fitsui::game {
    use std::string::{Self, String};
    
    // --- CẤU HÌNH ---
    const URL_LV1: vector<u8> = b"https://api.dicebear.com/9.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4";
    const URL_LV2: vector<u8> = b"https://api.dicebear.com/9.x/adventurer/svg?seed=Alexander&backgroundColor=c0aede";

    // --- 1. CẤU TRÚC OBJECT ---
    public struct Hero has key, store {
        id: UID,
        name: String,
        level: u64,
        stamina: u64,
        image_url: String,
    }

    // --- 2. LOGIC GAME ---

    // Thêm dòng này để tắt cảnh báo vàng:
    #[allow(lint(self_transfer))]
    public fun create_hero(name_input: vector<u8>, ctx: &mut TxContext) {
        let hero = Hero {
            id: object::new(ctx),
            name: string::utf8(name_input),
            level: 1,
            stamina: 0,
            image_url: string::utf8(URL_LV1)
        };
        transfer::public_transfer(hero, ctx.sender());
    }

    public fun workout(hero: &mut Hero, _ctx: &mut TxContext) {
        hero.stamina = hero.stamina + 10;

        if (hero.stamina >= 50) {
            hero.level = hero.level + 1;
            hero.stamina = 0;
            
            if (hero.level == 2) {
                hero.image_url = string::utf8(URL_LV2);
            };
        };
    }
}