import React from 'react';
import { ConnectButton } from '@mysten/dapp-kit';
import { Activity, Trophy, Dumbbell, Store } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="space-y-32 mt-10 mb-20">
      
      {/* --- 1. HERO SECTION --- */}
      <div className="text-center space-y-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-400 font-bold text-sm uppercase tracking-wider mb-4">
          <Activity className="w-4 h-4 animate-pulse" /> Next Gen Web3 Fitness
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white leading-tight tracking-tight">
          Train hard. <br/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-400 to-cyan-400 italic">Get paid.</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Turn sweat into digital assets. Use <span className="text-lime-400 font-bold">AI Pose Estimation</span> to track your workout directly on-browser.
        </p>
        
        <div className="pt-8 flex justify-center">
          <div className="relative group transition-all duration-700 ease-in-out hover:scale-110"> 
            <div className="absolute -inset-1 bg-gradient-to-r from-lime-400 via-emerald-500 to-cyan-500 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition duration-700 ease-in-out animate-pulse"></div>
            <div className="relative">
              <ConnectButton 
                connectText="🚀 CONNECT WALLET TO START" 
                className="!bg-slate-950 !text-white !text-xl !font-black !px-10 !py-6 !rounded-2xl !border !border-lime-500/20 hover:!border-lime-400 transition-all duration-700 ease-in-out flex items-center gap-3 active:scale-95" 
              />
            </div>
          </div>
        </div>
            
        {/* --- STATS RIBBON --- */}
        <div className="flex flex-wrap justify-center gap-12 pt-16 opacity-50 group-hover:opacity-100 transition-opacity">
          <div className="text-center">
            <p className="text-2xl font-black text-white">1.2M+</p>
            <p className="text-[10px] text-lime-500 font-bold uppercase tracking-widest">XP Earned</p>
          </div>
          <div className="text-center border-x border-white/10 px-12">
            <p className="text-2xl font-black text-white">3.4K+</p>
            <p className="text-[10px] text-lime-500 font-bold uppercase tracking-widest">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-white">90K+</p>
            <p className="text-[10px] text-lime-500 font-bold uppercase tracking-widest">Sui Transactions</p>
          </div>
        </div>
      </div>

      {/* --- 2. GAME MECHANICS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 py-20">
        {[
          { title: "zkLogin Access", desc: "Log in instantly with Google. No seed phrases, pure Web3 power.", icon: Activity },
          { title: "Daily Hero Mint", desc: "Mint 1 Hero daily. Attributes and Rarity define your Hero's market value.", icon: Trophy },
          { title: "AI Evolution", desc: "Burn stamina to train. Gain XP to boost stats and level up your Hero.", icon: Dumbbell },
          { title: "Market & Loot", desc: "Trade rare loot or leveled-up Heroes in our player-driven economy.", icon: Store }
        ].map((step, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-lime-500/30 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-lime-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <step.icon className="text-lime-400 w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white mb-2 italic uppercase tracking-tighter">0{idx + 1}. {step.title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* --- STAMINA & MANA SYSTEM --- */}
      <div className="space-y-8 px-4 pb-20">
        <div className="bg-slate-900/40 border border-white/5 p-10 rounded-[40px] text-center">
          <h2 className="text-2xl font-black text-white uppercase italic mb-4">Stamina & Mana System</h2>
          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            Each training session consumes stamina. Use <span className="text-white font-bold">Mana Potions</span> to recharge and train more. 
            Higher levels increase the chance of **Rare Loot Drops** in your inventory!
          </p>
        </div>
      </div>

      {/* --- 3. TECH STACK BANNER --- */}
      <div className="bg-gradient-to-r from-lime-500/10 to-transparent border-l-4 border-lime-500 p-12 rounded-r-3xl mx-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-left space-y-2">
            <h2 className="text-3xl font-black text-white uppercase italic">Powered by <span className="text-lime-400">AI Vision</span></h2>
            <p className="text-gray-400 max-w-md">No extra hardware needed. Our MoveNet AI model processes 30+ frames per second directly in your browser for perfect tracking.</p>
          </div>
          <div className="flex gap-6 items-center">
            <div className="bg-white/5 px-6 py-3 rounded-xl border border-white/10 text-xs font-bold text-gray-400">TensorFlow.js</div>
            <div className="bg-white/5 px-6 py-3 rounded-xl border border-white/10 text-xs font-bold text-gray-400">Sui Network</div>
          </div>
        </div>  
      </div>

      {/* --- 4. FUTURE ROADMAP --- */}
      <div className="py-20 px-4">
        <h2 className="text-4xl font-black text-white text-center mb-16 italic uppercase tracking-tighter">
          Future <span className="text-lime-400">Roadmap</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {[
            { 
              phase: "Phase 1", 
              title: "Genesis Launch", 
              date: "Q4 2025", 
              tasks: ["zkLogin Secure Onboarding", "Daily Hero Mint (DNA & Rarity)", "AI Squat Tracking Engine", "On-chain XP Records"] 
            },
            { 
              phase: "Phase 2", 
              title: "RPG & Economy", 
              date: "Q1 2026", 
              tasks: ["Hero Leveling & Stat Boosts", "Inventory System & Rare Loot", "Mana & Stamina Mechanics", "Mana Potion Store"] 
            },
            { 
              phase: "Phase 3", 
              title: "Open Marketplace", 
              date: "Q2 2026", 
              tasks: ["P2P Hero & Item Trading", "New AI Workout Models", "Guilds & Team Training", "Mobile App Integration"] 
            }
          ].map((item, i) => (
            <div key={i} className="relative p-8 border-l border-lime-500/30 hover:bg-lime-500/5 transition-all group">
              <div className="absolute top-0 left-[-5px] w-2 h-2 bg-lime-500 rounded-full shadow-[0_0_10px_#a3e635]"></div>
              <span className="text-lime-500 font-bold text-xs tracking-widest uppercase">{item.phase} - {item.date}</span>
              <h3 className="text-xl font-black text-white mt-2 mb-4 italic">{item.title}</h3>
              <ul className="space-y-2">
                {item.tasks.map((task, j) => (
                  <li key={j} className="text-gray-500 text-sm flex items-center gap-2">
                    <div className="w-1 h-1 bg-gray-700 rounded-full"></div> {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;