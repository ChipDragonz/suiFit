import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-white/5 pt-16 pb-8 text-center space-y-6">
      {/* Cụm Link điều hướng Footer */}
      <div className="flex justify-center gap-8 text-gray-500">
        <a 
          href="#" 
          className="hover:text-lime-400 transition-colors font-bold text-sm uppercase tracking-widest"
        >
          Documentation
        </a>
        <a 
          href="https://github.com/ChipDragonz" 
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-lime-400 transition-colors font-bold text-sm uppercase tracking-widest"
        >
          Github
        </a>
        <a 
          href="#" 
          className="hover:text-lime-400 transition-colors font-bold text-sm uppercase tracking-widest"
        >
          Whitepaper
        </a>
      </div>

      {/* Dòng bản quyền & Hackathon */}
      <p className="text-gray-700 text-[10px] font-bold uppercase tracking-[0.5em]">
        © 2025 FitSui.Pro | Built for SUI Global Hackathon
      </p>
    </footer>
  );
};

export default Footer;