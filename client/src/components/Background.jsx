import React from 'react';

// --- TRONG Background.jsx ---
const Background = () => {
  return (
    // 👇 SỬA z-0 THÀNH z-[-1] VÀ THÊM pointer-events-none
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#0a0c10]">
      
      {/* Các quầng sáng và logic sao băng giữ nguyên bên dưới */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-lime-500/5 blur-[120px]"></div>
      <div className="absolute bottom-[10%] right-[0%] w-[40%] h-[40%] rounded-full bg-emerald-600/5 blur-[100px]"></div>

      <div className="night">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="shooting_star"></div>
        ))}
      </div>

      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
    </div>
  );
};

export default Background;