import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPONENT CON: HIỂN THỊ TỪNG LỚP ẢNH ---
const AvatarLayer = ({ src, zIndex, layerName }) => {
  // Nếu không có ảnh hoặc giá trị là 'none', không hiện gì cả
  if (!src || src === 'none') return null;

  return (
    <motion.img
      src={src}
      alt={layerName}
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      // ✅ QUAN TRỌNG: object-contain giúp hiện Full Body, không bị cắt mất chân tay
      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      style={{ zIndex }}
    />
  );
};

// --- COMPONENT CHÍNH: QUẢN LÝ 7 TẦNG TRANG BỊ ---
const HeroAvatar = ({ equipment }) => {
  // 1. Nhận data từ HeroCard. Khởi tạo mặc định để tránh lỗi undefined
  const equip = equipment || { 
    body: 'none', 
    pants: 'none', 
    shirt: 'none', 
    shoes: 'none', 
    gloves: 'none', 
    armor: 'none', 
    hat: 'none', 
    weapon: 'none' 
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      
      {/* Hiệu ứng hào quang Neon rực rỡ phía sau Hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-lime-500/5 blur-[120px] rounded-full animate-pulse" />

      {/* Container chính chứa các Layer xếp chồng */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="popLayout">
          
          {/* 🟢 TẦNG 0: THÂN MÌNH (BODY) - Nằm dưới cùng */}
          <AvatarLayer 
            key="layer-body" 
            src={equip.body} 
            zIndex={10} 
            layerName="body" 
          />

          {/* 🟢 TẦNG 1: QUẦN (PANTS) - Mặc sát thân */}
          <AvatarLayer 
            key="layer-pants" 
            src={equip.pants} 
            zIndex={20} 
            layerName="pants" 
          />

          {/* 🟢 TẦNG 2: ÁO (SHIRT) - Phủ lên quần */}
          <AvatarLayer 
            key="layer-shirt" 
            src={equip.shirt} 
            zIndex={30} 
            layerName="shirt" 
          />

          {/* 🟢 TẦNG 3: GIÀY (SHOES) - Đè lên gấu quần */}
          <AvatarLayer 
            key="layer-shoes" 
            src={equip.shoes} 
            zIndex={40} 
            layerName="shoes" 
          />

          {/* 🟢 TẦNG 4: BAO TAY (GLOVES) - Đè lên tay áo */}
          <AvatarLayer 
            key="layer-gloves" 
            src={equip.gloves} 
            zIndex={50} 
            layerName="gloves" 
          />

          {/* 🟢 TẦNG 5: GIÁP (ARMOR) - Lớp bảo vệ ngoài cùng */}
          <AvatarLayer 
            key="layer-armor" 
            src={equip.armor} 
            zIndex={60} 
            layerName="armor" 
          />

          {/* 🟢 TẦNG 6: MŨ (HAT) - Nằm trên đầu */}
          <AvatarLayer 
            key="layer-hat" 
            src={equip.hat} 
            zIndex={70} 
            layerName="hat" 
          />

          {/* 🟢 TẦNG 7: VŨ KHÍ (WEAPON) - Lớp trên cùng để khoe độ ngầu */}
          <AvatarLayer 
            key="layer-weapon" 
            src={equip.weapon} 
            zIndex={80} 
            layerName="weapon" 
          />

        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeroAvatar;