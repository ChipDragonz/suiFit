import React from 'react';

const Background = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#0a0c10]">
      {/* Quầng sáng mờ tạo chiều sâu */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-lime-500/5 blur-[120px]"></div>
      <div className="absolute bottom-[10%] right-[0%] w-[40%] h-[40%] rounded-full bg-emerald-600/5 blur-[100px]"></div>

      {/* Lớp Mưa Sao Băng phủ kín màn hình */}
      <div className="night">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="shooting_star"></div>
        ))}
      </div>

      {/* Carbon Texture phủ nhẹ - Giữ nguyên link texture của ní */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
    </div>
  );
};

export default Background;