import React from 'react';
import { 
  Github, 
  BookOpen, 
  FileText, 
  Twitter, 
  MessageCircle, 
  Send,
  Zap
} from 'lucide-react';

const Footer = () => {
  return (
    // ✅ SỬA 1: Đã xóa 'border-t border-white/5' ở thẻ footer chính
    <footer className="mt-auto pt-10 pb-4 relative overflow-hidden">
      
      {/* Hiệu ứng quầng sáng mờ dưới đáy (Giữ lại cái này cho đẹp) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 items-start text-center md:text-left">
        
        {/* CỘT 1: BRANDING & TAGLINE */}
        <div className="space-y-4">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-8 h-8 bg-lime-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.4)]">
              <Zap size={18} className="text-black fill-black" />
            </div>
            <span className="text-xl font-black italic tracking-tighter">FITSUI<span className="text-lime-400">.PRO</span></span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto md:mx-0 font-medium">
            The first AI-powered Move-to-Earn RPG built on Sui Network. Turn your sweat into digital glory.
          </p>
        </div>

        {/* CỘT 2: DOCUMENTATION (ICONS) */}
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Resources</h4>
          <div className="flex justify-center gap-6">
            <a href="https://github.com/ChipDragonz/FitSUI.Pro/blob/main/README.md" className="p-3 bg-white/5 rounded-2xl hover:text-lime-400 hover:bg-white/10 transition-all group" title="Documentation">
              <BookOpen size={22} className="group-hover:scale-110 transition-transform" />
            </a>
            <a href="https://github.com/ChipDragonz/FitSUI.Pro" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-2xl hover:text-lime-400 hover:bg-white/10 transition-all group" title="Github">
              <Github size={22} className="group-hover:scale-110 transition-transform" />
            </a>
            <a href="https://www.canva.com/design/DAG8ktyL6dI/y-Zyqo1C85AEzsXN0OcHaA/edit?utm_content=DAG8ktyL6dI&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton" className="p-3 bg-white/5 rounded-2xl hover:text-lime-400 hover:bg-white/10 transition-all group" title="Whitepaper">
              <FileText size={22} className="group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        {/* CỘT 3: COMMUNITY & SOCIALS */}
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Join Community</h4>
          <div className="flex justify-center md:justify-end gap-4">
            <a href="#" className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full hover:border-lime-500/50 hover:text-lime-400 transition-all">
              <Twitter size={18} />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full hover:border-lime-500/50 hover:text-lime-400 transition-all">
              <MessageCircle size={18} />
            </a>
            <a href="#" className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full hover:border-lime-500/50 hover:text-lime-400 transition-all">
              <Send size={18} />
            </a>
          </div>
        </div>

      </div>

      {/* DÒNG BẢN QUYỀN - Cũng làm một đường kẻ mờ tương tự nếu ní thích */}
      <div className="mt-10 pt-4 relative text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <p className="text-gray-700 text-[9px] font-black uppercase tracking-[0.4em]">
          © 2025 FitSui.Pro | Built for SUI Global Hackathon
        </p>
      </div>
    </footer>
  );
};

export default Footer;