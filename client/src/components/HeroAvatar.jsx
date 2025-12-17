import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- IMPORT ẢNH ---
import bodyImg from '../assets/body.png';
import headImg from '../assets/head.png';         // Ảnh đầu mới thêm
import armorImg from '../assets/fire_armor.png';
import helmetImg from '../assets/fire_helmet.png';
import swordImg from '../assets/fire_sword.png';

// --- CẤU HÌNH ASSETS ---
const ASSETS = {
  base: {
    male: bodyImg,   // Cơ thể toàn vẹn (dùng khi không mặc gì)
    head: headImg,   // Chỉ cái đầu (dùng khi mặc giáp)
  },
  outfit: {
    none: null, 
    warrior: armorImg,
  },
  hat: {
    none: null,
    helmet: helmetImg,
  },
  weapon: {
    none: null,
    fireSword: swordImg,
  }
};

const AvatarLayer = ({ src, zIndex, layerName }) => {
  if (!src) return null;

  return (
    <motion.img
      key={layerName + (src || 'none')}
      src={src}
      alt={layerName}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 w-full h-full object-contain pointer-events-none"
      style={{ 
        zIndex, 
        // Vũ khí và Giáp đổ bóng đậm hơn chút để nổi bật
        filter: (layerName === 'weapon' || layerName === 'outfit') 
          ? "drop-shadow(0 5px 5px rgba(0,0,0,0.6))" 
          : "none" 
      }}
    />
  );
};

const HeroAvatar = ({ equipment }) => {
  const equip = equipment || { outfit: 'none', hat: 'none', weapon: 'none' };

  const currentOutfitUrl = ASSETS.outfit[equip.outfit];
  const currentHatUrl = ASSETS.hat[equip.hat];
  const currentWeaponUrl = ASSETS.weapon[equip.weapon];

  // LOGIC CHUYỂN ĐỔI BODY/HEAD
  const hasOutfit = equip.outfit && equip.outfit !== 'none';

  return (
    <div className="relative w-full h-full flex items-end justify-center overflow-hidden rounded-2xl">
      
      {/* Hiệu ứng nền lửa */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-orange-600/20 blur-[90px] rounded-full mix-blend-screen animate-pulse" />

      <div className="relative w-full h-[92%] transition-transform duration-500 hover:scale-105">
        <AnimatePresence mode='wait'>
          
          {/* TRƯỜNG HỢP 1: KHÔNG MẶC GIÁP -> Hiện Body gốc (Z:10) */}
          {!hasOutfit && (
            <AvatarLayer src={ASSETS.base.male} zIndex={10} layerName="baseBody" />
          )}

          {/* TRƯỜNG HỢP 2: CÓ MẶC GIÁP -> Hiện Đầu riêng (Z:15) + Giáp (Z:20) */}
          {hasOutfit && (
            <>
              {/* Đầu nằm dưới giáp một chút để cổ không bị đè lên cổ áo */}
              <AvatarLayer src={ASSETS.base.head} zIndex={20} layerName="baseHead" />
              <AvatarLayer src={currentOutfitUrl} zIndex={15} layerName="outfit" />
            </>
          )}

          {/* LỚP 3: KIẾM (Z:25) */}
          <AvatarLayer src={currentWeaponUrl} zIndex={25} layerName="weapon" />

          {/* LỚP 4: MŨ (Z:30) */}
          <AvatarLayer src={currentHatUrl} zIndex={30} layerName="hat" />

        </AnimatePresence>
      </div>
    </div>
  );
};

export default HeroAvatar;