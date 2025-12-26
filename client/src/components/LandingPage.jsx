import React from 'react';
import { ConnectButton } from '@mysten/dapp-kit';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Trophy, Dumbbell, Store, Zap, ChevronRight, Shield, Target, Sparkles, Smartphone, Scan } from 'lucide-react';

// --- 🛠️ STANDARD ANIMATION CONFIGS ---
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.2 } }
};

const LandingPage = () => {
  return (
    <div className="space-y-32 md:space-y-48 mt-10 mb-20 overflow-visible text-white">
      
      {/* --- 🚀 1. HERO SECTION (Glow Clipping Fixed) --- */}
      <motion.div 
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="text-center space-y-8 px-4 relative"
      >
        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-400 font-bold text-xs md:text-sm uppercase tracking-wider mb-4">
          <Activity className="w-4 h-4 animate-pulse" /> Next Gen Web3 Fitness
        </motion.div>

        <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl lg:text-9xl font-black leading-[1.1] tracking-tighter uppercase italic">
          Train hard. <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400">Get paid.</span>
        </motion.h1>

        <motion.p variants={fadeInUp} className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
          Transform sweat into digital assets. Use <span className="text-lime-400 font-bold border-b border-lime-500/30">AI Pose Estimation</span> to track your workout directly on-browser.
        </motion.p>
        
        <motion.div variants={fadeInUp} className="pt-8 flex justify-center">
          <div className="relative group"> 
            {/* ✅ GLOW FIX: -inset-24 and rounded-full for smooth transition */}
            <div className="absolute -inset-24 bg-gradient-to-r from-lime-400/30 via-emerald-500/30 to-cyan-500/30 rounded-full blur-[100px] opacity-40 group-hover:opacity-100 transition duration-1000 ease-in-out"></div>
            
            <div className="relative">
              <ConnectButton 
                connectText="🚀 CONNECT WALLET TO START" 
                className="!bg-slate-950 !text-white !text-lg md:!text-2xl !font-black !px-10 md:!px-16 !py-6 md:!py-8 !rounded-3xl !border-2 !border-lime-500/20 hover:!border-lime-400 transition-all duration-500 active:scale-95" 
              />
            </div>
          </div>
        </motion.div>
            
        <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-8 md:gap-20 pt-16 md:pt-24 opacity-60">
          {[
            { label: "XP EARNED", val: "1.2M+" },
            { label: "ACTIVE HEROES", val: "3.4K+" },
            { label: "SUI TRANSACTIONS", val: "95K+" }
          ].map((stat, i) => (
            <div key={i} className="text-center px-4">
              <p className="text-3xl md:text-5xl font-black text-white">{stat.val}</p>
              <p className="text-[10px] md:text-xs text-lime-500 font-black uppercase tracking-[0.3em] mt-2">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* --- 📱 2. DIGITAL TWIN SIMULATION (Physical to Digital Visualization) --- */}
      <section className="py-20 md:py-40 px-6 max-w-7xl mx-auto overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
          
{/* LEFT: AI CAMERA SIMULATION (Đã thay bằng GIF động) */}
<motion.div 
  initial={{ opacity: 0, x: -50 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  // Giữ nguyên style khung điện thoại xịn xò, overflow-hidden sẽ tự cắt góc GIF
className="relative aspect-[9/16] max-w-[400px] mx-auto bg-slate-950 rounded-[3.5rem] border-[12px] border-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden group z-10">
  <img 
    src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmZvMWh0YXI3NWVzYWlzc3IxY2ZsOTE0cDdkbWZ0dHZjcmwxa21kNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/krTvFR9HL33JoYxJID/giphy.gif" 
    alt="AI Pose Estimation GIF" 
    className="w-full h-full object-cover grayscale opacity-80 scale-110 scale-x-[-1]" // Grayscale và opacity để nó ngầu hơn
  />

  {/* Lớp phủ màu xanh neon lên trên GIF để hợp tông với web */}
  <div className="absolute inset-0 bg-lime-500/20 mix-blend-overlay pointer-events-none"></div>

  {/* UI giả lập Camera đè lên trên GIF */}
  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 px-3 py-1 rounded-full flex items-center gap-2 animate-pulse z-20">
    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
    <span className="text-[8px] font-bold text-white uppercase tracking-widest">Live AI Tracking</span>
  </div>
</motion.div>

          {/* RIGHT: ON-CHAIN RESULTS */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="space-y-4 text-center lg:text-left">
              <h2 className="text-5xl md:text-7xl font-black italic uppercase leading-[0.9]">
                YOUR EFFORT,<br/>
                <span className="text-lime-400 text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">ON-CHAIN.</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-400 font-medium max-w-xl mx-auto lg:mx-0">
                Every physical movement is verified by AI and instantly converted into power for your Hero Object on the Sui Network.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[2.5rem] text-center group hover:border-lime-500/30 transition-all">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Real-time XP</p>
                <p className="text-4xl font-black text-white italic">+400 XP</p>
              </div>
              <div className="p-8 bg-lime-500/10 border border-lime-500/20 rounded-[2.5rem] relative overflow-hidden flex flex-col items-center justify-center group hover:bg-lime-500/20 transition-all">
                <Zap className="absolute -right-2 -bottom-2 w-16 h-16 text-lime-500/10 rotate-12" />
                <p className="text-[10px] font-black text-lime-500 uppercase tracking-widest mb-2">NFT Progress</p>
                <p className="text-3xl font-black text-white italic uppercase tracking-tighter">EVOLVING...</p>
              </div>
            </div>

            <ul className="space-y-5 pt-4">
              {[
                { text: "Pose Estimation (30+ FPS)", icon: <Target size={18}/> },
                { text: "Dynamic Stamina Burn (-10/Set)", icon: <Activity size={18}/> },
                { text: "Verified Physical Proof (PoW)", icon: <Shield size={18}/> },
                { text: "2% Rare Gear Drop Rate", icon: <Sparkles size={18}/> }
              ].map((feat, i) => (
                <li key={i} className="flex items-center gap-4 text-gray-400 font-medium group">
                  <div className="w-8 h-8 rounded-full bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-500 shrink-0 group-hover:bg-lime-500 group-hover:text-black transition-all">
                    {feat.icon}
                  </div>
                  <span className="text-sm md:text-lg">{feat.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* --- ⚔️ 3. HOW TO PLAY --- */}
      <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={staggerContainer} className="py-10 space-y-16">
        <motion.div variants={fadeInUp} className="text-center px-4">
          <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter">Master the <span className="text-lime-400">Arena</span></h2>
          <p className="text-gray-500 mt-4 text-lg md:text-xl font-medium px-4">Your journey from trainee to Legend starts with a single rep.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-6 max-w-7xl mx-auto">
          {[
            { step: "01", title: "MINT", desc: "Claim your Genesis Hero on Sui. Every Hero features unique Elemental DNA.", icon: "🔥" },
            { step: "02", title: "TRAIN", desc: "Squat in front of AI. Gain XP based on your verifiable physical effort.", icon: "⚡" },
            { step: "03", title: "LOOT", desc: "Hunt monsters in Farm Zone to loot gear and evolve your character.", icon: "⚔️" },
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} whileHover={{ y: -15 }} className="relative p-10 md:p-14 bg-white/[0.03] border-2 border-white/5 rounded-[3rem] text-center group hover:border-lime-500/40 transition-all overflow-hidden">
              <div className="text-6xl md:text-7xl mb-8">{item.icon}</div>
              <span className="absolute top-8 left-8 text-7xl font-black opacity-5 group-hover:opacity-10 transition-opacity italic">{item.step}</span>
              <h3 className="text-2xl md:text-3xl font-black mb-4 italic uppercase">{item.title}</h3>
              <p className="text-gray-400 text-sm md:text-lg leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* --- 🕹️ 4. GAME MECHANICS --- */}
      <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 max-w-7xl mx-auto">
        {[
          { title: "zkLogin Access", desc: "Instant Web2-to-Web3 login. Secure, decentralized, no seed phrases required.", icon: Activity },
          { title: "Daily Hero Mint", desc: "Attributes and Rarity are randomized, defining your Hero's market value.", icon: Trophy },
          { title: "AI Evolution", desc: "Convert physical stamina into Hero stats and permanent level-ups.", icon: Dumbbell },
          { title: "Marketplace", desc: "Trade rare loot or leveled-up Heroes in a player-driven economy.", icon: Store }
        ].map((step, idx) => (
          <motion.div key={idx} variants={fadeInUp} className="bg-slate-900/40 border-2 border-white/5 p-8 rounded-[2.5rem] hover:border-lime-500/20 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-lime-500/10 flex items-center justify-center mb-8 group-hover:bg-lime-500 group-hover:text-black transition-all">
              <step.icon className="w-7 h-7 text-lime-400 group-hover:text-black" />
            </div>
            <h3 className="text-xl font-black mb-3 italic uppercase tracking-tighter">0{idx + 1}. {step.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* --- 🗺️ 5. ROADMAP --- */}
      <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={staggerContainer} className="py-20 px-6 max-w-7xl mx-auto space-y-24">
        <motion.h2 variants={fadeInUp} className="text-5xl md:text-8xl font-black text-center italic uppercase tracking-tighter">Future <span className="text-lime-400 text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">Roadmap</span></motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { phase: "Phase 1", status: "COMPLETED", title: "The Foundation", tasks: ["zkLogin Integration", "AI Squat Engine v1", "Layered Avatar System"] },
            { phase: "Phase 2", status: "LIVE NOW", title: "RPG Economy", tasks: ["Inventory Vault v1", "Fusion Lab (Evolution)", "Seasonal Farming Maps"] },
            { phase: "Phase 3", status: "PLANNED", title: "Marketplace", tasks: ["P2P Trading System", "NFT Auction House", "Global Leaderboard"] },
            { phase: "Phase 4", status: "VISION", title: "Warfare", tasks: ["PvP Battle Arena", "Advanced AI Models", "Mobile Native App"] }
          ].map((item, i) => (
            <motion.div key={i} variants={fadeInUp} className={`relative p-10 border-l-4 transition-all hover:bg-white/[0.02] ${item.status === 'COMPLETED' ? 'border-lime-500 bg-lime-500/5' : 'border-white/10'}`}>
              <div className="absolute top-0 left-[-10px] w-4 h-4 bg-lime-500 rounded-full shadow-[0_0_20px_#a3e635]"></div>
              <div className="flex flex-col gap-2 mb-6 text-left">
                <span className="text-lime-500 font-black text-xs tracking-[0.3em] uppercase">{item.phase}</span>
                <span className={`w-fit text-[9px] font-black px-2 py-1 rounded ${item.status === 'COMPLETED' ? 'bg-lime-500 text-black' : 'bg-white/10 text-gray-500'}`}>
                  {item.status}
                </span>
              </div>
              <h3 className="text-2xl font-black mb-6 italic uppercase tracking-tight text-left">{item.title}</h3>
              <ul className="space-y-4 text-left">
                {item.tasks.map((task, j) => (
                  <li key={j} className="text-gray-500 text-xs md:text-sm font-medium flex items-start gap-3">
                    <ChevronRight size={14} className="text-lime-500 mt-0.5 shrink-0" /> 
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* --- 🏆 FOOTER CALL TO ACTION (Updated with Button) --- */}
<motion.div 
  initial={{ opacity: 0, y: 50 }} 
  whileInView={{ opacity: 1, y: 0 }} 
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
  className="py-32 md:py-48 text-center space-y-12 relative overflow-visible"
>
  {/* Text Content */}
  <div className="space-y-4 px-4">
    <p className="text-lime-500 font-black tracking-[0.4em] uppercase text-[10px] md:text-sm">
      Ready to evolve beyond limits?
    </p>
    <h2 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter">
      JOIN THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-500">ARENA</span> TODAY.
    </h2>
  </div>

  {/* ✅ THE FINAL START BUTTON */}
  <div className="flex justify-center relative group">
    {/* Glow effect chống cắt cạnh (Sử dụng -inset-20 và rounded-full) */}
    <div className="absolute -inset-20 bg-lime-500/20 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    
    <div className="relative">
      <ConnectButton 
        connectText="🔥 START YOUR EVOLUTION" 
        className="!bg-white !text-black !text-lg md:!text-xl !font-black !px-12 !py-6 !rounded-2xl hover:!scale-105 transition-all duration-300 active:scale-95 shadow-[0_0_30px_rgba(163,230,53,0.3)]" 
      />
    </div>
  </div>

  {/* Decorative Line */}
  <div className="flex flex-col items-center gap-6 pt-10">
    {/* <div className="h-px w-32 bg-gradient-to-r from-transparent via-lime-500/50 to-transparent"></div> */}
  </div>
</motion.div>
    </div>
  );
};

export default LandingPage;