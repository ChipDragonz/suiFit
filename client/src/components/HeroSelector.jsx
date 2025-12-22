import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// 1. Fixed typo "onst" to "const" and added "showMint = true" to props
const HeroSelector = ({ heroes, selectedId, onSelect, onMint, nextMintTime, showMint = true }) => { 
  const [timeLeft, setTimeLeft] = useState('');

  // --- EXISTING COUNTDOWN LOGIC (UNTOUCHED) ---
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      if (nextMintTime > now) {
        const diff = nextMintTime - now;
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        const f = (n) => n.toString().padStart(2, '0');
        setTimeLeft(`${f(h)}:${f(m)}:${f(s)}`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [nextMintTime]);

  return (
    <div className="space-y-6">
      {/* 1. HEADER (STAYS THE SAME) */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-lime-500 uppercase tracking-[0.2em]">Active Squad</p>
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">
            Select <span className="text-white/40">Hero</span>
          </h3>
        </div>
        <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">
           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{heroes.length} Total</span>
        </div>
      </div>

      {/* 2. DROPDOWN (STAYS THE SAME) */}
      <div className="relative group">
        <select
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full appearance-none bg-[#0f172a]/40 border border-white/10 text-white rounded-xl px-5 py-4 pr-12 font-bold text-sm focus:outline-none focus:border-lime-500/50 transition-all cursor-pointer"
        >
          {heroes.map((h) => (
            <option key={h.data.objectId} value={h.data.objectId} className="bg-slate-900">
              {h.data.content.fields.name} (LV.{h.data.content.fields.level})
            </option>
          ))}
          {heroes.length === 0 && <option>No Heroes Available</option>}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-lime-500">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {/* 3. MINT SECTION (NOW WRAPPED WITH showMint TOGGLE) */}
      {showMint && (
        <div className="w-full mt-4">
          {nextMintTime > Date.now() ? (
            /* COOLDOWN STATE */
            <div className="flex flex-col items-center justify-center p-5 bg-white/5 border border-white/10 rounded-2xl cursor-not-allowed group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-lime-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="text-[10px] font-black tracking-[0.4em] text-lime-500/60 uppercase mb-1 animate-pulse">
                Next Mint In
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white italic tracking-tighter">
                  {Math.floor((nextMintTime - Date.now()) / 3600000)}
                </span>
                <span className="text-xs font-bold text-gray-500 uppercase">Hours</span>
                <span className="text-2xl font-black text-white italic tracking-tighter ml-2">
                  {Math.floor(((nextMintTime - Date.now()) % 3600000) / 60000)}
                </span>
                <span className="text-xs font-bold text-gray-500 uppercase">Min</span>
              </div>
              <p className="text-[9px] text-gray-600 font-bold uppercase mt-2 tracking-widest">
                Stamina recovering...
              </p>
            </div>
          ) : (
            /* READY TO MINT STATE */
            <button 
              onClick={onMint}
              className="mb-6 w-full bg-gradient-to-r from-lime-400 to-emerald-600 p-4 rounded-2xl text-slate-950 font-black text-lg uppercase tracking-tighter hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)]"
            >
              Mint New Hero
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HeroSelector;