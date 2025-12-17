import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Flame, Droplets, Leaf } from 'lucide-react';
// 👇 1. Import component mới
import HeroAvatar from './HeroAvatar';

// 👇 2. Thêm prop 'tempEquipment' để nhận dữ liệu thử đồ từ bên ngoài
const HeroCard = ({ hero, tempEquipment }) => {
  if (!hero || !hero.content || !hero.content.fields) return null;

  const fields = hero.content.fields;
  const name = fields.name || "Unknown";
  const level = fields.level || 0;
  const xp = fields.xp || 0;
  const stamina = fields.stamina || 0;
  const strength = fields.strength || 1;
  const element = fields.element || 0;
  // const url = fields.url; // 👈 KHÔNG DÙNG URL CŨ NỮA

  const ElementIcon = [Flame, Droplets, Leaf][element] || Shield;
  const elementConfig = [
    { color: 'text-red-500', border: 'border-red-500/50', name: 'Fire' },
    { color: 'text-blue-500', border: 'border-blue-500/50', name: 'Water' },
    { color: 'text-green-500', border: 'border-green-500/50', name: 'Earth' },
  ][element] || { color: 'text-gray-400', border: 'border-gray-500/50', name: 'Unknown' };

  // Dữ liệu trang bị mặc định nếu chưa thử đồ
  const defaultEquipment = { outfit: 'none', hat: 'none' };
  // Ưu tiên dùng đồ đang thử, nếu không có thì dùng mặc định
  const currentEquipment = tempEquipment || defaultEquipment;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      // 👇 Sửa lại padding-top (pt-[450px]) để dành chỗ cho avatar
      className={`relative group w-full max-w-sm mx-auto overflow-hidden rounded-3xl border-2 ${elementConfig.border} bg-gray-900/80 backdrop-blur-xl shadow-2xl transition-all hover:shadow-sui-blue/20 pt-[450px]`}
    >
      {/* 👇 3. THAY THẾ ẢNH CŨ BẰNG AVATAR ĐỘNG */}
      <div className="absolute top-0 left-0 w-full h-[500px] p-4 z-0">
         <HeroAvatar equipment={currentEquipment} />
      </div>

      {/* Phần thông tin bên dưới giữ nguyên, chỉ thêm background mờ để dễ đọc */}
      <div className="relative z-20 p-6 flex flex-col justify-end bg-gradient-to-t from-black via-gray-900/90 to-transparent -mt-20 pt-20 rounded-b-3xl">
        {/* ... (Toàn bộ nội dung level, tên, stats, stamina GIỮ NGUYÊN NHƯ CŨ) ... */}
        <div className="absolute top-4 right-4 bg-black/60 border border-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md text-white shadow-lg">
          LVL {level}
        </div>

        <div className="mb-5">
          <h3 className="text-3xl font-black font-display text-white mb-1 drop-shadow-lg">{name}</h3>
          <div className="flex items-center gap-2 text-sm font-bold bg-black/40 w-fit px-3 py-1 rounded-lg backdrop-blur-sm border border-white/5">
            <ElementIcon className={`w-4 h-4 ${elementConfig.color}`} />
            <span className={`${elementConfig.color} uppercase tracking-widest`}>
              {elementConfig.name} CLASS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex items-center gap-3 backdrop-blur-md">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-300 font-bold tracking-wider">Strength</p>
              <p className="text-xl font-black text-white">{strength}</p>
            </div>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex items-center gap-3 backdrop-blur-md">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase text-gray-300 font-bold tracking-wider">Total XP</p>
              <p className="text-xl font-black text-white">{xp}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
          <div className="flex justify-between text-xs font-bold text-gray-300 uppercase tracking-wider">
            <span>Stamina</span>
            <span className={stamina < 20 ? 'text-red-500 animate-pulse' : 'text-green-400'}>{stamina}/100</span>
          </div>
          <div className="h-2 w-full bg-gray-700/50 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stamina}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full ${stamina > 20 ? 'bg-gradient-to-r from-green-400 to-emerald-600' : 'bg-red-500'}`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroCard;