import React from 'react';
import { ConnectButton } from '@mysten/dapp-kit';
import { Dumbbell, Activity, LogOut, Menu } from 'lucide-react';

const Navbar = ({ 
  account, 
  activeTab, 
  setActiveTab, 
  navItems, 
  showWalletMenu, 
  setShowWalletMenu, 
  disconnect 
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/20 backdrop-blur-xl border-b border-white/5 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        
        {/* --- LOGO --- */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('heroes')}>
          <div className="bg-gradient-to-br from-lime-400 to-emerald-600 p-2.5 rounded-xl shadow-lg shadow-lime-500/20 group-hover:scale-110 transition-transform">
            <Dumbbell className="text-slate-950 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 leading-none">
              FitSui<span className="text-lime-400">.Pro</span>
            </h1>
            <p className="text-[10px] text-lime-500/60 font-bold tracking-widest uppercase">Move to Earn</p>
          </div>
        </div>

        {/* --- NAVIGATION TABS --- */}
        {account && (
          <div className="hidden md:flex bg-white/5 p-1 rounded-xl border border-white/5 backdrop-blur-md">
            {navItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)} 
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-lime-500 text-slate-950 shadow-lg shadow-lime-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-slate-950' : 'text-gray-500'}`} />
                {item.label}
              </button>
            ))}
          </div>
        )}

        {/* --- WALLET SECTION --- */}
        <div className="flex items-center gap-4">
          {!account && (
            <div className="relative group transition-all duration-300 hover:scale-105">
              <div className="absolute -inset-1 bg-gradient-to-r from-lime-500 to-emerald-500 rounded-xl blur-md opacity-0 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative p-[1.5px] rounded-xl bg-gradient-to-r from-lime-400 to-emerald-500">
                <div className="relative rounded-[10px] bg-[#0a0c10] hover:bg-slate-950 transition-colors">
                  <ConnectButton 
                    connectText="Connect Wallet" 
                    className="!bg-transparent !text-white !font-black !text-sm !px-8 !py-3 rounded-xl flex items-center justify-center" 
                  />
                </div>
              </div>
            </div>
          )}

          {account && (
            <div className="relative">
              <button 
                onClick={() => setShowWalletMenu(!showWalletMenu)}
                className="p-3 bg-white/5 hover:bg-lime-500/10 rounded-xl transition-all text-gray-400 hover:text-lime-400 border border-white/5 active:scale-95"
              >
                <Menu className="w-7 h-7" />
              </button>

              {showWalletMenu && (
                <>
                  <div className="fixed inset-0 z-[60]" onClick={() => setShowWalletMenu(false)}></div>
                  <div className="absolute right-0 mt-4 w-72 bg-[#0f1116] border border-white/10 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[70] animate-fade-in backdrop-blur-2xl">
                    <div className="flex flex-col">
                      <div className="p-4 bg-white/5 rounded-xl mb-2 text-left">
                        <span className="text-[10px] text-lime-500 font-black uppercase tracking-widest block mb-2">Active Wallet</span>
                        <div className="bg-[#0a0c10] p-3 rounded-lg border border-white/5">
                          <span className="text-[11px] text-gray-300 font-mono break-all leading-relaxed">
                            {account.address}
                          </span>
                        </div>
                      </div>

                      <div className="p-2 space-y-2">
                        <a 
                          href={`https://suiscan.xyz/testnet/account/${account.address}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full bg-lime-500 hover:bg-lime-400 text-slate-950 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)] flex items-center justify-center gap-2"
                        >
                          View on SuiScan <Activity className="w-3.5 h-3.5" />
                        </a>

                        <button 
                          onClick={() => { disconnect(); setShowWalletMenu(false); }}
                          className="w-full flex items-center justify-between px-4 py-4 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest">Disconnect</span>
                          <LogOut className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;