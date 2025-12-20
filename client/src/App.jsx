import { useDisconnectWallet } from '@mysten/dapp-kit';
import { useState, useEffect } from 'react';
import { useGame } from './hooks/useGame';

// --- IMPORT COMPONENTS (Đảm bảo ní đã tạo đủ 4 file này) ---
import Background from './components/Background';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';
import HeroSelector from './components/HeroSelector';
import HeroCard from './components/HeroCard';
import AIWorkout from './components/AIWorkout';
import FusionZone from './components/FusionZone';

// --- IMPORT ICONS ---
import { Trophy, Package, Store, Sparkles } from 'lucide-react';

function App() {
  // --- 1. ELEMENT CONFIGURATION ---
  const ELEMENT_MAP = {
    0: { label: "METAL", color: "text-yellow-400", border: "border-yellow-500/50", shadow: "shadow-yellow-500/20" },
    1: { label: "WOOD", color: "text-emerald-400", border: "border-emerald-500/50", shadow: "shadow-emerald-500/20" },
    2: { label: "WATER", color: "text-blue-400", border: "border-blue-500/50", shadow: "shadow-blue-500/20" },
    3: { label: "FIRE", color: "text-red-400", border: "border-red-500/50", shadow: "shadow-red-500/20" },
    4: { label: "EARTH", color: "text-orange-700", border: "border-orange-900/50", shadow: "shadow-orange-900/20" }
  };

  // --- 2. LOGIC & STATES ---
  const { account, heroes, mintHero, workout, fuseHeroes, nextMintTime } = useGame();
  const { mutate: disconnect } = useDisconnectWallet();
  
  const [activeTab, setActiveTab] = useState('heroes');
  const [selectedHeroId, setSelectedHeroId] = useState('');
  const [showWalletMenu, setShowWalletMenu] = useState(false);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [accumulatedSets, setAccumulatedSets] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tempEquipment, setTempEquipment] = useState({ outfit: 'none', hat: 'none', weapon: 'none' });

  // Định nghĩa Hero hiện tại
  const currentHeroId = selectedHeroId || (heroes[0]?.data?.objectId || '');
  const currentHero = heroes.find(h => h.data.objectId === currentHeroId);
  const [displayStamina, setDisplayStamina] = useState(0);

  // --- 3. VIRTUAL STAMINA REGEN ENGINE ---
  useEffect(() => {
    if (!currentHero?.data) return;

    const updateStamina = () => {
      const now = Date.now();
      const fields = currentHero.data.content.fields;
      const lastUpdate = Number(fields.last_update_timestamp);
      const staminaOnChain = Number(fields.stamina);
      const level = Number(fields.level);
      
      const maxStamina = 100 + (level * 15); // Khớp với fitsui.move
      const timePassed = now - lastUpdate;
      const staminaRegen = Math.floor(timePassed / 60000); // 1 stamina/60s
      
      setDisplayStamina(Math.min(maxStamina, staminaOnChain + staminaRegen));
    };

    updateStamina();
    const interval = setInterval(updateStamina, 1000);
    return () => clearInterval(interval);
  }, [currentHero]);

  // --- 4. ACTION HANDLERS ---
  const navItems = [
    { id: 'heroes', label: 'Hero Vault', icon: Trophy }, 
    { id: 'fusion', label: 'Fusion Lab', icon: Sparkles },
    { id: 'inventory', label: 'Inventory', icon: Package }, 
    { id: 'market', label: 'Marketplace', icon: Store }, 
  ];

  const handleClaim = () => {
    if (accumulatedSets === 0) return;
    setIsProcessing(true);
    workout(currentHeroId, accumulatedSets, () => {
      setAccumulatedSets(0);
      setIsProcessing(false);
      setIsWorkoutStarted(false);
    });
  };

  const handleFuse = async (ids) => {
    setIsProcessing(true);
    try {
      await fuseHeroes(ids[0], ids[1], ids[2]); 
      setActiveTab('heroes');
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleEquip = (slot, itemName) => {
    setTempEquipment(prev => ({ ...prev, [slot]: prev[slot] === itemName ? 'none' : itemName }));
  };

  // --- 5. RENDER UI ---
  return (
    <div className="min-h-screen font-sans selection:bg-lime-500/30 text-white bg-[#0a0c10] relative overflow-x-hidden">
      <Background />
      
      <Navbar 
        account={account} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        navItems={navItems}
        showWalletMenu={showWalletMenu}
        setShowWalletMenu={setShowWalletMenu}
        disconnect={disconnect}
      />

      <main className="relative z-10 pt-32 pb-12 px-4 max-w-7xl mx-auto">
        {!account ? (
          <LandingPage />
        ) : (
          <div className="animate-fade-in">
            
            {/* TAB 1: HERO VAULT */}
            {activeTab === 'heroes' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-slate-950/60 border border-lime-500/10 rounded-3xl p-6 backdrop-blur-2xl">
                    <HeroSelector heroes={heroes} selectedId={currentHeroId} onSelect={setSelectedHeroId} onMint={mintHero} nextMintTime={nextMintTime} />
                    
                    {currentHero?.data ? (
                      <HeroCard 
                        hero={{
                          ...currentHero.data,
                          content: { ...currentHero.data.content, fields: { ...currentHero.data.content.fields, stamina: displayStamina }}
                        }} 
                        tempEquipment={tempEquipment} 
                        elementInfo={ELEMENT_MAP[currentHero.data.content?.fields?.element] || ELEMENT_MAP[0]}
                        nextLevelXP={(Number(currentHero.data.content?.fields?.level || 0) + 1) * (Number(currentHero.data.content?.fields?.level || 0) + 1) * 50} 
                      />
                    ) : (
                      <div className="p-10 text-center border-2 border-dashed border-white/10 rounded-3xl text-gray-500 uppercase font-black text-xs tracking-widest">No Hero Selected</div>
                    )}

                    {currentHero && (
                      <div className="mt-6 bg-slate-900/60 p-4 rounded-2xl border border-lime-500/10">
                        <h3 className="text-xs font-black text-lime-500/60 uppercase mb-3 tracking-widest">Gear Preview</h3>
                        <div className="flex gap-2">
                          {['armor', 'helmet', 'sword'].map((item) => (
                            <button key={item} onClick={() => toggleEquip(item === 'armor' ? 'outfit' : item === 'helmet' ? 'hat' : 'weapon', item)} className="flex-1 p-3 rounded-xl border border-white/5 bg-white/5 font-bold text-[10px] uppercase text-gray-500 hover:text-white">Preview {item}</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-slate-950/60 border border-lime-500/10 rounded-3xl p-1 backdrop-blur-2xl min-h-[480px] flex flex-col">
                    <div className="p-6 flex justify-between items-end border-b border-white/5">
                      <h2 className="text-3xl font-black italic uppercase tracking-tighter">Training <span className="text-lime-400">Zone</span></h2>
                      <div className="bg-lime-500/10 border border-lime-500/20 px-4 py-1 rounded-lg text-lime-400 font-black text-xl">3 SQUATS / SET</div>
                    </div>
                    <div className="p-4 flex-1 flex items-center justify-center">
                      {!isWorkoutStarted ? (
                        <button onClick={() => setIsWorkoutStarted(true)} className="bg-gradient-to-r from-lime-400 to-emerald-600 px-12 py-6 rounded-2xl text-slate-950 font-black text-2xl shadow-2xl hover:scale-105 transition-all">START TRAINING</button>
                      ) : (
                        <AIWorkout onSessionUpdate={() => setAccumulatedSets(s => s + 1)} isProcessing={isProcessing} />
                      )}
                    </div>
                  </div>

                  {accumulatedSets > 0 && (
                    <div className="flex flex-col items-center gap-6 py-10 bg-lime-500/5 rounded-3xl border border-lime-500/20 animate-fade-in">
                      <button onClick={handleClaim} disabled={isProcessing} className="bg-slate-950 border border-lime-500/50 px-12 py-5 rounded-2xl text-2xl font-black text-white hover:bg-slate-800">
                        {isProcessing ? "RECORDING..." : `CLAIM ${accumulatedSets * 10} XP`}
                      </button>
                      <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.4em]">On-chain Achievement Verification</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: FUSION LAB */}
            {activeTab === 'fusion' && (
              <FusionZone heroes={heroes} onFuse={handleFuse} isProcessing={isProcessing} />
            )}

            {/* TABS: INVENTORY & MARKETPLACE */}
            {(activeTab === 'inventory' || activeTab === 'market') && (
              <div className="flex flex-col items-center justify-center py-24 bg-slate-950/60 rounded-3xl border border-white/5 text-center">
                <h2 className="text-3xl font-black uppercase mb-2 italic">{activeTab} Vault</h2>
                <p className="text-lime-500/60 font-bold uppercase tracking-widest text-sm">🚧 Feature Under Construction</p>
              </div>
            )}

          </div>
        )}
        <Footer />
      </main>
    </div>
  );
}

export default App;