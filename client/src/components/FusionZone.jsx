import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Sparkles, AlertCircle, Zap } from 'lucide-react';

const FusionZone = ({ heroes, onFuse, isProcessing }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  // --- CẤU HÌNH HỆ (Khớp với App.jsx của ní) ---
  const ELEMENT_MAP = {
    0: { label: "METAL", color: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-500/5" },
    1: { label: "WOOD", color: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/5" },
    2: { label: "WATER", color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/5" },
    3: { label: "FIRE", color: "text-red-400", border: "border-red-500/30", bg: "bg-red-500/5" },
    4: { label: "EARTH", color: "text-orange-700", border: "border-orange-900/30", bg: "bg-orange-900/5" }
  };

  // --- LOGIC GOM NHÓM HERO THEO HỆ ---
  const groupedHeroes = heroes.reduce((acc, hero) => {
    const element = hero.data.content?.fields?.element || 0;
    if (!acc[element]) acc[element] = [];
    acc[element].push(hero);
    return acc;
  }, {});

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedHeroes = heroes.filter(h => selectedIds.includes(h.data.objectId));
  
  // Điều kiện: 3 con, cùng level, cùng hệ
  const canFuse = selectedIds.length === 3 && 
    selectedHeroes.every(h => h.data.content.fields.level === selectedHeroes[0].data.content.fields.level) &&
    selectedHeroes.every(h => h.data.content.fields.element === selectedHeroes[0].data.content.fields.element);

  return (
    <div className="space-y-12 pb-20">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-400 text-[10px] font-black uppercase tracking-widest">
          <Sparkles className="w-3 h-3" /> Fusion Laboratory
        </div>
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-white">
          Hero <span className="text-lime-400">Evolution</span>
        </h2>
        <p className="text-gray-500 text-sm font-medium">Grouped by Class for faster selection</p>
      </div>

      {/* HIỂN THỊ THEO TỪNG CỤM HỆ */}
      <div className="space-y-10">
        {Object.entries(ELEMENT_MAP).map(([elementId, config]) => {
          const heroesInGroup = groupedHeroes[elementId] || [];
          if (heroesInGroup.length === 0) return null; // Không có hero hệ này thì ẩn luôn

          return (
            <div key={elementId} className="space-y-4">
              <div className="flex items-center gap-4 px-2">
                <span className={`text-xs font-black tracking-[0.3em] ${config.color}`}>{config.label} CLASS</span>
                <div className={`h-[1px] flex-1 bg-gradient-to-r from-${config.color.split('-')[1]}-500/30 to-transparent`}></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {heroesInGroup.map((hero) => (
                  <motion.div 
                    key={hero.data.objectId}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleSelect(hero.data.objectId)}
                    className={`relative cursor-pointer p-4 rounded-2xl border transition-all duration-300 ${
                      selectedIds.includes(hero.data.objectId) 
                        ? 'border-lime-400 bg-lime-500/10 shadow-[0_0_15px_rgba(163,230,53,0.2)]' 
                        : `border-white/5 ${config.bg} hover:border-white/20`
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-white/40 italic"># {hero.data.content.fields.number}</span>
                      <div className={`px-2 py-0.5 rounded-md bg-black/40 border border-white/5 text-[9px] font-black ${config.color}`}>
                        LVL {hero.data.content.fields.level}
                      </div>
                    </div>
                    <p className="font-bold text-xs truncate text-gray-200">{hero.data.content.fields.name}</p>
                    
                    {selectedIds.includes(hero.data.objectId) && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-lime-500 rounded-full flex items-center justify-center shadow-lg">
                        <Zap className="w-3 h-3 text-slate-950 fill-slate-950" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- FUSION CONTROL BAR (Nằm dưới danh sách Hero, trên Footer) --- */}
      <div className="mt-16 w-full max-w-md mx-auto px-4">
        <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-8 rounded-[32px] shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] block">Selection Status</span>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${selectedIds.length === 3 ? 'bg-lime-500 shadow-[0_0_10px_#a3e635]' : 'bg-gray-700'}`}></div>
                <span className="text-sm font-black text-white italic">{selectedIds.length} / 3 HEROES</span>
              </div>
            </div>
          </div>

          <button
            disabled={!canFuse || isProcessing}
            onClick={() => onFuse(selectedIds)}
            className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.15em] transition-all duration-500 ${
              canFuse 
                ? 'bg-lime-500 text-slate-950 shadow-[0_20px_40px_rgba(163,230,53,0.3)] hover:-translate-y-1' 
                : 'bg-white/5 text-gray-600 cursor-not-allowed border border-white/5'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                FUSING...
              </div>
            ) : canFuse ? "⚡ Start Evolution" : "Select 3 Identical Heroes"}
          </button>

          {!canFuse && selectedIds.length === 3 && (
            <div className="mt-4 flex items-center justify-center gap-2 text-red-400">
               <AlertCircle className="w-4 h-4" />
               <span className="text-[10px] font-black uppercase tracking-wider">Same Level & Class Required</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FusionZone;