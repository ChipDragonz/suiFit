import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Zap, Shield, Activity } from 'lucide-react'; 
import HeroAvatar from './HeroAvatar';

/**
 * @param hero: Dữ liệu NFT Hero từ Sui
 * @param stamina: Số stamina đang nhảy thời gian thực từ App.jsx
 * @param staminaProgress: Tiến độ % hồi điểm tiếp theo (0-100)
 * @param tempEquipment: Danh sách trang bị đang mặc thử
 * @param elementInfo: Cấu hình màu sắc theo hệ (Metal, Wood...)
 * @param nextLevelXP: XP cần để lên cấp tiếp theo
 * @param hideStats: Biến ẩn/hiện bảng chỉ số
 */
const HeroCard = ({ 
  hero, 
  stamina: dynamicStamina, 
  staminaProgress = 0, 
  tempEquipment, 
  elementInfo, 
  nextLevelXP, 
  hideStats = false 
}) => {
  // Kiểm tra dữ liệu đầu vào để tránh crash app
  if (!hero || !hero.content || !hero.content.fields) return null;

  const fields = hero.content.fields;
  const name = fields.name || "Unknown";
  const level = Number(fields.level || 0);
  const xp = Number(fields.xp || 0);
  const strength = Number(fields.strength || 1);
  
  // ✅ ƯU TIÊN: Dùng số đang nhảy từ App.jsx, nếu không có mới dùng số tĩnh từ blockchain
  const stamina = dynamicStamina !== undefined ? dynamicStamina : Number(fields.stamina || 0); 
  
  // Công thức: 100 + (cấp * 15)
  const maxStamina = 100 + (level * 15); 
  const staminaPercentage = Math.min((stamina / maxStamina) * 100, 100);
  const xpPercentage = Math.min((xp / nextLevelXP) * 100, 100);

  // --- LOGIC HIỆU ỨNG +1 KHI HỒI STAMINA ---
  const [showPlusOne, setShowPlusOne] = useState(false);
  const prevStaminaRef = useRef(stamina);

  useEffect(() => {
    // Nếu số stamina hiện tại lớn hơn số lưu ở lần trước -> Vừa hồi xong 1 điểm
    if (stamina > prevStaminaRef.current) {
      setShowPlusOne(true);
      const timer = setTimeout(() => setShowPlusOne(false), 2000);
      return () => clearTimeout(timer);
    }
    prevStaminaRef.current = stamina;
  }, [stamina]);

  // Cấu hình màu sắc mặc định nếu không tìm thấy hệ
  const config = elementInfo || { 
    label: 'UNKNOWN', 
    color: 'text-gray-400', 
    border: 'border-gray-500/50', 
    shadow: 'shadow-transparent' 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative group w-full max-w-sm mx-auto overflow-hidden rounded-3xl border-2 ${config.border} bg-gray-900/80 backdrop-blur-xl shadow-2xl transition-all hover:shadow-lime-500/20 pt-[450px] ${config.shadow}`}
    >
      {/* 1. PHẦN AVATAR HERO */}
      <div className="absolute top-0 left-0 w-full h-[500px] p-4 z-0">
         <HeroAvatar equipment={tempEquipment} />
      </div>

      {/* 2. PHẦN NỘI DUNG THÔNG TIN */}
      <div className="relative z-20 p-6 flex flex-col justify-end bg-gradient-to-t from-black via-gray-900/95 to-transparent -mt-20 pt-20 rounded-b-3xl">
        
        {/* Badge hiển thị Level */}
        <div className="absolute top-4 right-4 bg-black/60 border border-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg">
          LVL {level}
        </div>

        <div className="mb-5">
          <h3 className="text-3xl font-black font-display text-white mb-1 drop-shadow-lg">{name}</h3>
          <div className="flex items-center gap-2 text-sm font-bold bg-black/40 w-fit px-3 py-1 rounded-lg backdrop-blur-sm border border-white/5">
            <Activity className={`w-4 h-4 ${config.color}`} />
            <span className={`${config.color} uppercase tracking-widest`}>{config.label} CLASS</span>
          </div>
        </div>

        {/* 3. BẢNG CHỈ SỐ (Chỉ hiện khi hideStats = false) */}
        {!hideStats && (
          <div className="animate-fade-in space-y-5">
            {/* Grid Strength & XP */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-lg"><Zap className="w-5 h-5 text-orange-400" /></div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Strength</p>
                  <p className="text-xl font-black text-white">{strength}</p>
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg"><Shield className="w-5 h-5 text-purple-400" /></div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Total XP</p>
                  <p className="text-xl font-black text-white">{xp}</p>
                </div>
              </div>
            </div>

            {/* XP PROGRESS BAR */}
            <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/5">
              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <span>Experience</span>
                <span className="text-lime-400">{xp} / {nextLevelXP} XP</span>
              </div>
              <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${xpPercentage}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-lime-500 to-emerald-500 shadow-[0_0_10px_#a3e635]"
                />
              </div>
            </div>

            {/* STAMINA PROGRESS BAR (NHẢY SỐ REALTIME) */}
            <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
              <div className="flex justify-between text-xs font-bold text-gray-300 uppercase tracking-wider relative">
                <span>Stamina</span>
                
                {/* Hiệu ứng +1 bay lên */}
                <AnimatePresence>
                  {showPlusOne && (
                    <motion.span
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 1, y: -25 }}
                      exit={{ opacity: 0 }}
                      className="absolute right-12 text-lime-400 font-black text-sm drop-shadow-[0_0_8px_#a3e635]"
                    >
                      +1
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Số stamina nhảy real-time */}
                <span className={stamina < 20 ? 'text-red-500 animate-pulse' : 'text-green-400'}>
                  {stamina} / {maxStamina}
                </span>
              </div>

              {/* Thanh bar stamina với hiệu ứng nhích dần */}
              <div className="h-2 w-full bg-gray-700/50 rounded-full overflow-hidden relative">
                {/* Lớp hiển thị Stamina hiện có */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${staminaPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full relative z-10 ${stamina > 20 ? 'bg-gradient-to-r from-green-400 to-emerald-600' : 'bg-red-500'}`}
                />
                
                {/* Lớp hiển thị tiến độ % hồi tiếp theo (Vệt trắng mờ) */}
                {stamina < maxStamina && (
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-white/10 z-0"
                    style={{ width: `${staminaProgress}%` }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HeroCard;