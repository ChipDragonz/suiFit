import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Zap, Shield, Activity, Box } from 'lucide-react'; 
import HeroAvatar from './HeroAvatar';

/**
 * @param hero: Sui NFT object
 * @param totalStrength: Total calculated power (base + gear bonus)
 * @param stamina: Real-time dynamic stamina from App.jsx
 * @param staminaProgress: % progress to next stamina point (0-100)
 * @param tempEquipment: Current preview equipment state (URLs/Names)
 * @param onChainItemsMetadata: Metadata bridge for equipped items (Rarity/URLs)
 * @param elementInfo: Element configuration (Metal, Wood, etc.)
 * @param nextLevelXP: Threshold for next level
 * @param hideStats: Toggle statistics display
 * @param isInventoryMode: Toggle layout between Vault and Inventory tabs
 * @param onSlotClick: Handler for clicking an equipment slot (to un-equip)
 */
const HeroCard = ({ 
  hero, 
  totalStrength,
  stamina: dynamicStamina, 
  staminaProgress = 0, 
  tempEquipment, 
  onChainItemsMetadata,
  elementInfo, 
  nextLevelXP, 
  hideStats = false,
  isInventoryMode = false,
  onSlotClick
}) => {
  if (!hero || !hero.content || !hero.content.fields) return null;

  const fields = hero.content.fields;
  const level = Number(fields.level || 0);
  const xp = Number(fields.xp || 0);
  const baseStrength = Number(fields.strength || 1);
  const stamina = dynamicStamina !== undefined ? dynamicStamina : Number(fields.stamina || 0); 
  
  const maxStamina = 100 + (level * 15); 
  const staminaPercentage = Math.min((stamina / maxStamina) * 100, 100);
  const xpPercentage = Math.min((xp / nextLevelXP) * 100, 100);

  // 1. RARITY COLOR MAPPING (Sync with Inventory quality)
  const RARITY_STYLES = {
    0: "border-gray-500 shadow-gray-500/20",
    1: "border-blue-400 shadow-blue-500/30",
    2: "border-purple-500 shadow-purple-500/30",
    3: "border-yellow-400 shadow-yellow-500/40"
  };

  // 2. SLOTS DEFINITION (English, wide spacing, Pants elevated to avoid info panel)
  const EQUIPMENT_SLOTS = [
    { id: 'hat', label: 'HEAD', pos: 'top-[4%] left-[4%]' },
    { id: 'armor', label: 'ARMOR', pos: 'top-[4%] right-[4%]' },
    { id: 'shirt', label: 'SHIRT', pos: 'top-[35%] left-[1%]' },
    { id: 'gloves', label: 'GLOVES', pos: 'top-[35%] right-[1%]' },
    { id: 'weapon', label: 'WEAPON', pos: 'top-[62%] left-[4%]' },
    { id: 'shoes', label: 'SHOES', pos: 'top-[62%] right-[4%]' },
    { id: 'pants', label: 'PANTS', pos: 'bottom-[12%] left-1/2 -translate-x-1/2' },
  ];

  const [showPlusOne, setShowPlusOne] = useState(false);
  const prevStaminaRef = useRef(stamina);

  useEffect(() => {
    if (stamina > prevStaminaRef.current) {
      setShowPlusOne(true);
      const timer = setTimeout(() => setShowPlusOne(false), 2000);
      return () => clearTimeout(timer);
    }
    prevStaminaRef.current = stamina;
  }, [stamina]);

  const config = elementInfo || { label: 'UNKNOWN', color: 'text-gray-400', border: 'border-gray-500/50' };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative group w-full max-w-sm mx-auto overflow-hidden rounded-[2.5rem] border-2 ${config.border} bg-gray-900/80 backdrop-blur-xl shadow-2xl transition-all flex flex-col`}
    >
      {/* --- AVATAR & SLOTS SECTION (No overflow-hidden to keep legs visible) --- */}
      <div className={`relative w-full z-10 transition-all duration-500 ${isInventoryMode ? 'h-[520px]' : 'h-[450px]'}`}>
         
         {/* HERO MODEL (Scale adjusts based on mode) */}
         <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-700 
           ${isInventoryMode ? 'scale-[0.72] translate-y-0' : 'scale-[1.0] translate-y-5'}`}>
            <HeroAvatar equipment={tempEquipment} />
         </div>

         {/* INTERACTIVE EQUIPMENT SLOTS (Inventory Mode Only) */}
         {isInventoryMode && EQUIPMENT_SLOTS.map((slot) => {
           const itemName = tempEquipment[slot.id];
           const isEquipped = itemName && itemName !== 'none';
           
           // Fetch rarity from metadata to apply correct border color
           const itemMeta = onChainItemsMetadata?.[slot.id];
           const qualityStyle = isEquipped && itemMeta ? RARITY_STYLES[itemMeta.rarity] : "border-white/5 bg-black/40";

           return (
             <button 
               key={slot.id} 
               onClick={() => isEquipped && onSlotClick && onSlotClick(slot.id)}
               className={`absolute ${slot.pos} w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 z-20 group/slot
               ${qualityStyle} ${isEquipped ? 'shadow-lg hover:scale-110 active:scale-90' : 'opacity-60'}`}
             >
               {isEquipped ? (
                 <>
                   <motion.img 
                     initial={{ scale: 0 }} 
                     animate={{ scale: 1 }} 
                     src={itemMeta?.url} 
                     alt={slot.label} 
                     className="w-10 h-10 md:w-11 md:h-11 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" 
                   />
                   {/* REMOVE OVERLAY ON HOVER */}
                   <div className="absolute inset-0 bg-red-500/20 opacity-0 group-hover/slot:opacity-100 flex items-center justify-center rounded-2xl transition-opacity border border-red-500/40">
                      <span className="text-[8px] font-black text-white drop-shadow-sm">REMOVE</span>
                   </div>
                 </>
               ) : (
                 <Box size={16} className="text-gray-700 opacity-30" />
               )}
               <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[7px] font-black uppercase text-gray-500 tracking-widest whitespace-nowrap">{slot.label}</span>
             </button>
           );
         })}
      </div>

      {/* --- INFORMATION & STATS SECTION --- */}
      <div className={`relative z-30 p-6 flex flex-col justify-end bg-gradient-to-t from-black via-gray-900/95 to-transparent 
        ${isInventoryMode ? 'pt-14' : '-mt-16 pt-16'}`}>
        
        {/* LEVEL BADGE */}
        <div className={`absolute right-6 bg-lime-500 text-slate-950 px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg
          ${isInventoryMode ? 'top-2' : 'top-12'}`}>
          LVL {level}
        </div>

        {/* NAME & CLASS */}
        <div className="mb-5">
          <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter drop-shadow-lg">{fields.name}</h3>
          <div className="flex items-center gap-2 text-[10px] font-black bg-black/40 w-fit px-3 py-1 rounded-lg border border-white/5 mt-1">
            <Activity className={`w-3 h-3 ${config.color}`} />
            <span className={`${config.color} uppercase tracking-[0.2em]`}>{config.label} CLASS</span>
          </div>
        </div>

        {/* STATISTICS GRID */}
        {!hideStats && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="grid grid-cols-2 gap-3">
              {/* POWER STAT */}
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                <div className="p-2 bg-orange-500/20 rounded-xl"><Zap className="w-5 h-5 text-orange-400" /></div>
                <div>
                  <p className="text-[9px] uppercase text-gray-500 font-bold tracking-widest">POWER</p>
                  <p className={`text-2xl font-black transition-colors duration-500 ${totalStrength > baseStrength ? 'text-lime-400' : 'text-white'}`}>
                    {totalStrength || baseStrength}
                  </p>
                </div>
              </div>
              {/* XP STAT */}
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-xl"><Shield className="w-5 h-5 text-purple-400" /></div>
                <div>
                  <p className="text-[9px] uppercase text-gray-500 font-bold tracking-widest">TOTAL XP</p>
                  <p className="text-2xl font-black text-white">{xp}</p>
                </div>
              </div>
            </div>

            {/* PROGRESS BARS (XP & STAMINA) */}
            <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/5">
              {/* PROGRESS BAR */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase">
                  <span>PROGRESS</span>
                  <span className="text-lime-400">{xp} / {nextLevelXP} XP</span>
                </div>
                <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden border border-white/5">
                  <motion.div animate={{ width: `${xpPercentage}%` }} transition={{ duration: 1 }} className="h-full bg-lime-500 shadow-[0_0_10px_#a3e635]" />
                </div>
              </div>

              {/* STAMINA BAR */}
              <div className="space-y-1.5 relative">
                <div className="flex justify-between text-[9px] font-black text-gray-300 uppercase relative">
                  <span>STAMINA</span>
                  <AnimatePresence>
                    {showPlusOne && (
                      <motion.span initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -15 }} exit={{ opacity: 0 }} className="absolute right-10 text-lime-400 font-black">+1</motion.span>
                    )}
                  </AnimatePresence>
                  <span className={stamina < 20 ? 'text-red-500' : 'text-green-400'}>{stamina} / {maxStamina}</span>
                </div>
                <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden relative border border-white/5">
                  <motion.div animate={{ width: `${staminaPercentage}%` }} className={`h-full ${stamina > 20 ? 'bg-green-500' : 'bg-red-500'}`} />
                  {stamina < maxStamina && <motion.div className="absolute top-0 left-0 h-full bg-white/10" style={{ width: `${staminaProgress}%` }} />}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HeroCard;