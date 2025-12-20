import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // 👇 Gộp import lại cho gọn
import { Zap, Shield, Activity } from 'lucide-react'; 
import HeroAvatar from './HeroAvatar';

const HeroCard = ({ hero, tempEquipment, elementInfo, nextLevelXP }) => {
  if (!hero || !hero.content || !hero.content.fields) return null;

  const fields = hero.content.fields;
  const name = fields.name || "Unknown";
  const level = fields.level || 0;
  const xp = fields.xp || 0;
  const strength = fields.strength || 1;
  const stamina = fields.stamina || 0; 
  
  const maxStamina = 100 + (Number(level) * 15); 
  const staminaPercentage = Math.min((stamina / maxStamina) * 100, 100);

  // --- LOGIC NHẬN BIẾT STAMINA TĂNG (1 stamina / 60s) ---
  const [showPlusOne, setShowPlusOne] = React.useState(false);
  const prevStaminaRef = React.useRef(stamina);

  React.useEffect(() => {
    // Nếu stamina tăng lên so với giá trị trước đó
    if (stamina > prevStaminaRef.current) {
      setShowPlusOne(true);
      const timer = setTimeout(() => setShowPlusOne(false), 2000);
      return () => clearTimeout(timer);
    }
    prevStaminaRef.current = stamina;
  }, [stamina]);

  const config = elementInfo || { label: 'UNKNOWN', color: 'text-gray-400', border: 'border-gray-500/50', shadow: 'shadow-transparent' };
  const xpPercentage = Math.min((xp / nextLevelXP) * 100, 100);
  const currentEquipment = tempEquipment || { outfit: 'none', hat: 'none' };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative group w-full max-w-sm mx-auto overflow-hidden rounded-3xl border-2 ${config.border} bg-gray-900/80 backdrop-blur-xl shadow-2xl transition-all hover:shadow-lime-500/20 pt-[450px] ${config.shadow}`}
    >
      <div className="absolute top-0 left-0 w-full h-[500px] p-4 z-0">
         <HeroAvatar equipment={currentEquipment} />
      </div>

      <div className="relative z-20 p-6 flex flex-col justify-end bg-gradient-to-t from-black via-gray-900/90 to-transparent -mt-20 pt-20 rounded-b-3xl">
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

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg"><Zap className="w-5 h-5 text-orange-400" /></div>
            <div>
              <p className="text-[10px] uppercase text-gray-300 font-bold tracking-wider">Strength</p>
              <p className="text-xl font-black text-white">{strength}</p>
            </div>
          </div>
          <div className="bg-white/10 p-3 rounded-xl border border-white/10 flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg"><Shield className="w-5 h-5 text-purple-400" /></div>
            <div>
              <p className="text-[10px] uppercase text-gray-300 font-bold tracking-wider">Total XP</p>
              <p className="text-xl font-black text-white">{xp}</p>
            </div>
          </div>
        </div>

        {/* XP PROGRESS BAR */}
        <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/5 mb-3">
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

        {/* STAMINA PROGRESS BAR VỚI HIỆU ỨNG +1 */}
        <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-white/5 backdrop-blur-sm">
          <div className="flex justify-between text-xs font-bold text-gray-300 uppercase tracking-wider relative">
            <span>Stamina</span>
            
            {/* 👇 HIỆU ỨNG +1 ĐƯỢC LỒNG VÀO ĐÚNG VỊ TRÍ */}
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

            <span className={stamina < 20 ? 'text-red-500 animate-pulse' : 'text-green-400'}>
              {stamina} / {maxStamina}
            </span>
          </div>
          <div className="h-2 w-full bg-gray-700/50 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${staminaPercentage}%` }}
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