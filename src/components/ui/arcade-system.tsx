import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Gift, Play, ArrowRight, RefreshCw, X, 
  Zap, Trophy, History, Coins, Sparkles, User, ShoppingBag, ArrowUpRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
export interface ArcadeGame {
  id: string;
  name: string;
  description: string;
  cost: number;
  minTickets: number;
  maxTickets: number;
  image: string;
  category: string;
  highScore: number;
}

export interface PrizeItem {
  id: string;
  name: string;
  cost: number;
  icon: string;
  description: string;
}

// Game list data
const ARCADE_GAMES: ArcadeGame[] = [
  {
    id: 'cyber-racer',
    name: 'Glitch Horizon 2099',
    description: 'Vaporwave hyper-racer through a broken voxel metropolis.',
    cost: 25,
    minTickets: 40,
    maxTickets: 120,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80',
    category: 'VR Simulation',
    highScore: 98450
  },
  {
    id: 'neon-hoops',
    name: 'Cyber Hoop Basketball',
    description: 'Throw neon physical basketballs into virtual moving blackholes.',
    cost: 15,
    minTickets: 15,
    maxTickets: 45,
    image: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=600&q=80',
    category: 'Sport Physical',
    highScore: 342
  },
  {
    id: 'void-slasher',
    name: 'Void Slasher VR',
    description: 'Deconstruct neon soundwaves using dual chromatic sabers.',
    cost: 20,
    minTickets: 30,
    maxTickets: 80,
    image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=600&q=80',
    category: 'VR Rhythm',
    highScore: 124800
  },
  {
    id: 'aether-hockey',
    name: 'Chrono Air Hockey',
    description: 'A glowing supersonic puck sliding over a magnetic field.',
    cost: 10,
    minTickets: 10,
    maxTickets: 30,
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&q=80',
    category: 'Arcade Classic',
    highScore: 15
  },
  {
    id: 'holo-claw',
    name: 'Hologram Toy Grabber',
    description: 'Attempt to grab real physical and virtual premium collectible plushies.',
    cost: 8,
    minTickets: 5,
    maxTickets: 150,
    image: 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=600&q=80',
    category: 'Ticket Crane',
    highScore: 7
  }
];

// Prize counter inventory
const PRIZE_LIST: PrizeItem[] = [
  { id: 'synth-jacket', name: 'Metropolis Synthwave Jacket', cost: 350, icon: '🧥', description: 'Reversible chrome fiber jacket with active neon trim.' },
  { id: 'cyber-visor', name: 'Axis Cyberpunk Visor A2', cost: 200, icon: '🕶️', description: 'Simulated smart glass visor with dynamic HUD projection.' },
  { id: 'holo-plushie', name: 'Lumina Hologram Bear', cost: 80, icon: '🧸', description: 'Dynamic glassmorphic projection plushie that glows in the dark.' },
  { id: 'golden-ticket', name: 'Lumina Golden Access Key', cost: 600, icon: '🎫', description: 'Lifetime VIP access pass to all Axis cinemas and lounges.' }
];

export function ArcadeNexusSystem() {
  // Local state persistence via simple localStorage wrapper if running in browser
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('axis_arcade_points');
    return saved ? parseInt(saved) : 150;
  });
  
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('axis_arcade_tickets');
    return saved ? parseInt(saved) : 0;
  });

  const [cardId, setCardId] = useState(() => {
    const saved = localStorage.getItem('axis_arcade_card_id');
    return saved || `AXIS-${Math.floor(1000 + Math.random() * 9000)}-NX`;
  });

  const [tier, setTier] = useState(() => {
    const saved = localStorage.getItem('axis_arcade_tier');
    return saved || 'NEON CHRONO';
  });

  const [ownerName, setOwnerName] = useState(() => {
    const saved = localStorage.getItem('axis_arcade_owner');
    return saved || 'METROPOLIS RESIDENT';
  });

  const [logs, setLogs] = useState<string[]>(() => {
    const saved = localStorage.getItem('axis_arcade_logs');
    return saved ? JSON.parse(saved) : [
      `[${new Date().toLocaleTimeString()}] Nexus System initialized.`,
      `[${new Date().toLocaleTimeString()}] Credits loaded: +150 PTS.`
    ];
  });

  const [inventory, setInventory] = useState<string[]>(() => {
    const saved = localStorage.getItem('axis_arcade_inventory');
    return saved ? JSON.parse(saved) : [];
  });

  const [lastBonusDate, setLastBonusDate] = useState(() => {
    return localStorage.getItem('axis_arcade_last_bonus') || '';
  });

  // Modal & UI states
  const [isRecharging, setIsRecharging] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [customPointsInput, setCustomPointsInput] = useState('');
  
  // Game simulation state
  const [activeGame, setActiveGame] = useState<ArcadeGame | null>(null);
  const [gameStep, setGameStep] = useState<'booting' | 'playing' | 'score'>('booting');
  const [indicatorPos, setIndicatorPos] = useState(10); // Slider progress: 0 to 100
  const [isBouncingRight, setIsBouncingRight] = useState(true);
  const [simulationTickets, setSimulationTickets] = useState(0);
  const [simulationRating, setSimulationRating] = useState<'CRITICAL' | 'GREAT' | 'GLITCH' | null>(null);
  
  // Audio chime feedback simulation
  const playAudioBeep = (freq = 440, type: OscillatorType = 'sine', duration = 0.1) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context might be blocked or unavailable, ignore silently
    }
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('axis_arcade_points', points.toString());
    localStorage.setItem('axis_arcade_tickets', tickets.toString());
    localStorage.setItem('axis_arcade_card_id', cardId);
    localStorage.setItem('axis_arcade_tier', tier);
    localStorage.setItem('axis_arcade_owner', ownerName);
    localStorage.setItem('axis_arcade_logs', JSON.stringify(logs));
    localStorage.setItem('axis_arcade_inventory', JSON.stringify(inventory));
    localStorage.setItem('axis_arcade_last_bonus', lastBonusDate);
  }, [points, tickets, cardId, tier, ownerName, logs, inventory, lastBonusDate]);

  // Log updater utility
  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 19)]);
  };

  const todayKey = new Date().toISOString().slice(0, 10);
  const canClaimDailyBonus = lastBonusDate !== todayKey;

  const claimDailyBonus = () => {
    if (!canClaimDailyBonus) return;
    setPoints(prev => prev + 75);
    setTickets(prev => prev + 25);
    setLastBonusDate(todayKey);
    addLog('Daily arcade bonus claimed: +75 PTS and +25 TKT.');
    playAudioBeep(1200, 'sine', 0.25);
  };

  const resetArcadeCard = () => {
    setPoints(150);
    setTickets(0);
    setTier('NEON CHRONO');
    setOwnerName('METROPOLIS RESIDENT');
    setLogs([`[${new Date().toLocaleTimeString()}] Nexus card reset to starter profile.`]);
    setInventory([]);
    setLastBonusDate('');
    setCardId(`AXIS-${Math.floor(1000 + Math.random() * 9000)}-NX`);
  };

  // 3D Card Mouse Tilt Effect
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Calculate rotation angles (max 15 degrees)
    setTilt({
      x: -(y / (rect.height / 2)) * 12,
      y: (x / (rect.width / 2)) * 12
    });
  };
  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Mini-Game Slider Loop
  useEffect(() => {
    if (activeGame && gameStep === 'playing') {
      const interval = setInterval(() => {
        setIndicatorPos(prev => {
          if (isBouncingRight) {
            if (prev >= 90) {
              setIsBouncingRight(false);
              return 90;
            }
            return prev + 4.5;
          } else {
            if (prev <= 10) {
              setIsBouncingRight(true);
              return 10;
            }
            return prev - 4.5;
          }
        });
      }, 16); // ~60fps
      return () => clearInterval(interval);
    }
  }, [activeGame, gameStep, isBouncingRight]);

  // Handle Play Game Trigger
  const handlePlayGame = (game: ArcadeGame) => {
    if (points < game.cost) {
      playAudioBeep(220, 'triangle', 0.4);
      addLog(`ERR: Insufficient credits to play ${game.name}. Balance: ${points} PTS.`);
      alert(`INSUFFICIENT NEXUS BALANCE\n\n${game.name} requires ${game.cost} PTS. Please recharge your card!`);
      return;
    }

    playAudioBeep(600, 'sine', 0.1);
    setActiveGame(game);
    setGameStep('booting');
    setIndicatorPos(Math.floor(10 + Math.random() * 20));
    setIsBouncingRight(true);

    // Booting animation (2.5s)
    setTimeout(() => {
      setGameStep('playing');
      playAudioBeep(880, 'sawtooth', 0.2);
    }, 2000);
  };

  // Handle timing mini-game click
  const handleTimingClick = () => {
    if (!activeGame || gameStep !== 'playing') return;

    // Center is 50. Green sweet spot is 45-55. Yellow is 35-65. Rest is outer.
    const distFromCenter = Math.abs(indicatorPos - 50);
    let rating: 'CRITICAL' | 'GREAT' | 'GLITCH' = 'GLITCH';
    let multiplier = 0.5;

    if (distFromCenter <= 6) {
      rating = 'CRITICAL';
      multiplier = 1.0;
      playAudioBeep(1200, 'sine', 0.4);
      playAudioBeep(1500, 'sine', 0.2);
    } else if (distFromCenter <= 18) {
      rating = 'GREAT';
      multiplier = 0.75;
      playAudioBeep(880, 'sine', 0.3);
    } else {
      rating = 'GLITCH';
      multiplier = 0.35;
      playAudioBeep(440, 'triangle', 0.2);
    }

    // Calculate tickets earned based on rating
    const range = activeGame.maxTickets - activeGame.minTickets;
    const finalTickets = Math.round(activeGame.minTickets + range * multiplier);

    setSimulationRating(rating);
    setSimulationTickets(finalTickets);
    setGameStep('score');

    // Apply card updates
    setPoints(prev => prev - activeGame.cost);
    setTickets(prev => prev + finalTickets);
    addLog(`Played ${activeGame.name} (-${activeGame.cost} PTS). Accuracy: ${rating}. Earned: +${finalTickets} TKT.`);
  };

  // Complete game simulator modal
  const closeGameSimulator = () => {
    setActiveGame(null);
    setSimulationRating(null);
    setSimulationTickets(0);
  };

  // Handle Recharge Package
  const handleRechargePack = (amount: number, price: number, isVip = false) => {
    playAudioBeep(1000, 'sine', 0.15);
    setTimeout(() => playAudioBeep(1300, 'sine', 0.2), 100);

    setPoints(prev => prev + amount);
    if (isVip) {
      setTier('APEX LEAGUE');
      addLog(`Recharged Apex VIP Pack (+${amount} PTS, $${price}). VIP Status Unlocked!`);
    } else {
      addLog(`Recharged points pack (+${amount} PTS, $${price}).`);
    }
    setIsRecharging(false);
  };

  // Handle Custom Recharge
  const handleCustomRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    const pts = parseInt(customPointsInput);
    if (isNaN(pts) || pts <= 0) return;

    playAudioBeep(1000, 'sine', 0.1);
    setPoints(prev => prev + pts);
    addLog(`Recharged custom balance (+${pts} PTS).`);
    setCustomPointsInput('');
    setIsRecharging(false);
  };

  // Handle prize redemption
  const handleRedeemPrize = (prize: PrizeItem) => {
    if (tickets < prize.cost) {
      playAudioBeep(220, 'triangle', 0.3);
      alert(`INSUFFICIENT TICKETS\n\n${prize.name} requires ${prize.cost} Tickets. Play more games!`);
      return;
    }

    playAudioBeep(880, 'sine', 0.1);
    setTimeout(() => playAudioBeep(1200, 'sine', 0.25), 100);

    setTickets(prev => prev - prize.cost);
    setInventory(prev => [...prev, prize.name]);
    addLog(`Claimed prize counter reward: ${prize.name} (-${prize.cost} TKT).`);
    alert(`PRIZE CLAIMED SUCCESSFULLY!\n\n${prize.icon} ${prize.name} has been added to your Nexus Profile Inventory.`);
  };

  return (
    <div className="w-full min-h-screen bg-black/60 backdrop-blur-md border-t border-white/[0.05] relative overflow-y-auto overflow-x-hidden p-6 md:p-12 lg:p-20 flex flex-col justify-between">
      {/* Decorative Neon Stars Background layer */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-black to-black z-0" />

      {/* Main layout grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-12 lg:gap-16 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
            <div className="flex flex-col">
              <span className="font-mono text-[9px] tracking-[0.8em] uppercase text-cyan-400 font-bold">Floor 03 · Entertainment Core</span>
              <h1 className="font-display italic text-4xl md:text-6xl text-white tracking-tighter mt-1">Arcade Nexus</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={claimDailyBonus}
              disabled={!canClaimDailyBonus}
              className={cn(
                "px-6 py-3 border font-mono text-[10px] tracking-[0.4em] uppercase rounded-full transition-all duration-300 flex items-center gap-2",
                canClaimDailyBonus
                  ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300 hover:border-emerald-300 hover:bg-emerald-950/40"
                  : "border-white/10 bg-white/5 text-white/20 cursor-not-allowed"
              )}
            >
              <Sparkles size={12} />
              Daily Bonus
            </button>
            <button
              onClick={() => setIsRecharging(true)}
              className="px-6 py-3 border border-cyan-500/30 hover:border-cyan-400 bg-cyan-950/20 text-cyan-400 font-mono text-[10px] tracking-[0.4em] uppercase hover:bg-cyan-950/40 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.1)] flex items-center gap-2"
            >
              <Zap size={12} className="animate-pulse" />
              Recharge Terminal
            </button>
            <button
              onClick={() => setIsRedeeming(true)}
              className="px-6 py-3 border border-amber-500/30 hover:border-amber-400 bg-amber-950/20 text-amber-400 font-mono text-[10px] tracking-[0.4em] uppercase hover:bg-amber-950/40 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.1)] flex items-center gap-2"
            >
              <Gift size={12} />
              Prize Counter
            </button>
            <button
              onClick={resetArcadeCard}
              className="w-11 h-11 rounded-full border border-white/10 bg-white/5 text-white/35 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
              title="Reset arcade card"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* 3D Card and Roster Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: 3D CARD SHOWCASE */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="text-white/40 font-mono text-[9px] tracking-widest uppercase mb-1">
              Active Member Profile
            </div>

            {/* 3D Tilted Glassmorphic Card Container */}
            <div 
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full aspect-[1.6/1] rounded-[24px] cursor-grab select-none transition-all duration-300 ease-out"
              style={{
                perspective: 1000,
              }}
            >
              <motion.div
                animate={{
                  rotateX: tilt.x,
                  rotateY: tilt.y,
                  scale: tilt.x === 0 ? 1 : 1.02
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 25 }}
                className={cn(
                  "w-full h-full rounded-[24px] p-6 flex flex-col justify-between relative overflow-hidden border backdrop-blur-2xl transition-all duration-500 shadow-2xl",
                  tier === 'APEX LEAGUE' 
                    ? "bg-gradient-to-br from-amber-500/15 via-[#110e08] to-amber-950/30 border-amber-400/40 shadow-[0_0_40px_rgba(245,158,11,0.15)]"
                    : "bg-gradient-to-br from-cyan-500/10 via-[#070c10] to-cyan-950/20 border-cyan-400/25 shadow-[0_0_35px_rgba(34,211,238,0.12)]"
                )}
              >
                {/* Visual Neon Overlay lines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,_transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
                <div className={cn(
                  "absolute -right-24 -top-24 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none",
                  tier === 'APEX LEAGUE' ? "bg-amber-400" : "bg-cyan-400"
                )} />

                {/* Card Top: System Chip + Logo */}
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/50">Axis Hub Card</span>
                    <span className={cn(
                      "font-mono text-[10px] tracking-[0.6em] uppercase font-bold mt-1",
                      tier === 'APEX LEAGUE' ? "text-amber-400" : "text-cyan-400"
                    )}>
                      {tier}
                    </span>
                  </div>
                  {/* Digital Smart Chip */}
                  <div className="w-10 h-8 rounded-md bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 p-[1px] relative overflow-hidden shadow-inner flex items-center justify-center">
                    <div className="w-full h-full rounded-[4px] bg-[#111]/30 flex flex-wrap p-1">
                      <div className="w-1/2 h-1/2 border-r border-b border-yellow-300/40" />
                      <div className="w-1/2 h-1/2 border-b border-yellow-300/40" />
                      <div className="w-1/2 h-1/2 border-r border-yellow-300/40" />
                      <div className="w-1/2 h-1/2" />
                    </div>
                  </div>
                </div>

                {/* Card Middle: Available Points & Tickets */}
                <div className="grid grid-cols-2 gap-4 relative z-10 my-4">
                  <div className="flex flex-col">
                    <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/30 mb-1">Available Credits</span>
                    <div className="flex items-baseline gap-1">
                      <span className={cn(
                        "text-3xl md:text-4xl font-display font-bold leading-none tracking-tight",
                        tier === 'APEX LEAGUE' ? "text-amber-400" : "text-cyan-400"
                      )}>
                        {points}
                      </span>
                      <span className="font-mono text-[9px] text-white/40 tracking-widest">PTS</span>
                    </div>
                  </div>
                  <div className="flex flex-col border-l border-white/5 pl-4">
                    <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/30 mb-1">Won Tickets</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl md:text-4xl font-display font-bold leading-none tracking-tight text-white">
                        {tickets}
                      </span>
                      <span className="font-mono text-[9px] text-white/40 tracking-widest">TKT</span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom: ID and Name */}
                <div className="flex justify-between items-end relative z-10">
                  <div className="flex flex-col">
                    <span className="font-mono text-[7px] tracking-[0.2em] uppercase text-white/30">Cardholder Profile</span>
                    <input
                      value={ownerName}
                      onChange={(event) => setOwnerName(event.target.value.toUpperCase())}
                      className="mt-1 max-w-[190px] bg-transparent border-b border-white/10 focus:border-cyan-400 outline-none font-mono text-[10px] text-white/80 uppercase tracking-widest font-semibold"
                    />
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-mono text-[7px] tracking-[0.2em] uppercase text-white/30">Lumina Registry</span>
                    <span className="font-mono text-[9px] text-white/60 tracking-wider font-bold mt-1">
                      {cardId}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Profile summary inventory list */}
            <div className="bg-[#0b0c0e]/80 border border-white/[0.05] rounded-3xl p-5 flex flex-col gap-4 mt-2">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                  <ShoppingBag size={10} />
                  Your Inventory
                </span>
                <span className="font-mono text-[9px] text-cyan-400/80 font-bold uppercase tracking-wider bg-cyan-950/20 px-2 py-0.5 rounded-full border border-cyan-800/25">
                  {inventory.length} Items
                </span>
              </div>
              {inventory.length === 0 ? (
                <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest py-2 text-center">No prizes claimed yet</p>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-2 scrollbar-thin">
                  {inventory.map((item, idx) => (
                    <span key={idx} className="font-mono text-[8px] bg-white/5 text-white/60 border border-white/10 px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                      <Sparkles size={8} className="text-yellow-400 animate-pulse" />
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Console Log Log terminal */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                <History size={10} />
                Nexus System Logs
              </span>
              <div className="w-full h-36 bg-[#08080c] border border-white/[0.05] rounded-[18px] p-4 font-mono text-[9px] text-emerald-400/80 overflow-y-auto scrollbar-hide flex flex-col gap-1.5 select-none leading-relaxed">
                {logs.map((log, idx) => (
                  <div key={idx} className="whitespace-pre-wrap leading-tight tracking-wider opacity-85 hover:opacity-100 transition-opacity">
                    <span className="text-emerald-600/80 mr-1.5">&gt;</span>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: ARCADE GAMES ROSTER */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <span className="text-white/40 font-mono text-[9px] tracking-widest uppercase">
                Available Game Roster
              </span>
              <span className="font-mono text-[9px] text-cyan-400/80 uppercase">
                {ARCADE_GAMES.length} cabinets online
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[640px] overflow-y-auto pr-2 scrollbar-thin">
              {ARCADE_GAMES.map((game) => (
                <div 
                  key={game.id}
                  className="bg-[#0b0c0f] border border-white/[0.05] hover:border-cyan-500/30 rounded-3xl overflow-hidden flex flex-col transition-all duration-300 group shadow-md"
                >
                  {/* Game image preview */}
                  <div className="h-40 relative overflow-hidden bg-black/40">
                    <img 
                      src={game.image} 
                      alt={game.name}
                      className="absolute inset-0 w-full h-full object-cover brightness-[0.55] group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0f] via-transparent to-transparent" />
                    
                    {/* Floating stats badges */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="font-mono text-[7px] bg-cyan-950/60 border border-cyan-500/25 px-2 py-0.5 rounded-full text-cyan-400 uppercase tracking-widest font-bold">
                        {game.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-4 font-mono text-[8px] text-white/50 uppercase tracking-wider flex items-center gap-1">
                      <Trophy size={9} className="text-yellow-400" />
                      Score: {game.highScore.toLocaleString()}
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-1.5">
                      <h3 className="font-display italic text-lg text-white leading-none tracking-wide">{game.name}</h3>
                      <p className="font-sans text-white/40 text-[11px] leading-relaxed mt-1 font-light tracking-wide">{game.description}</p>
                    </div>

                    {/* Footer mechanics */}
                    <div className="flex justify-between items-center pt-3 border-t border-white/5">
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-[7px] text-white/30 uppercase tracking-widest">Cost</span>
                          <span className="font-mono text-[11px] font-bold text-cyan-400 mt-0.5">{game.cost} PTS</span>
                        </div>
                        <div className="flex flex-col border-l border-white/5 pl-4">
                          <span className="font-mono text-[7px] text-white/30 uppercase tracking-widest">Est Rewards</span>
                          <span className="font-mono text-[10px] text-amber-400 mt-0.5">{game.minTickets}-{game.maxTickets} TKT</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePlayGame(game)}
                        className="px-4 py-2 rounded-full bg-white text-black font-mono text-[9px] tracking-widest uppercase hover:bg-cyan-400 hover:text-black transition-all duration-300 flex items-center gap-1.5 font-bold"
                      >
                        <Play size={10} fill="currentColor" />
                        Play
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RECHARGE TERMINAL MODAL */}
      <AnimatePresence>
        {isRecharging && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.93, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.93, y: 30, opacity: 0 }}
              className="w-full max-w-2xl bg-[#090b0e] border border-cyan-500/25 rounded-[36px] overflow-hidden flex flex-col p-8 md:p-10 shadow-[0_0_80px_rgba(34,211,238,0.15)] relative"
            >
              {/* Close */}
              <button 
                onClick={() => setIsRecharging(false)}
                className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 z-10 text-white/40 hover:text-white"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-center text-center gap-2 mb-8">
                <div className="w-14 h-14 rounded-full bg-cyan-400/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-2">
                  <CreditCard size={24} />
                </div>
                <h3 className="text-2xl font-display italic text-white tracking-wide">Nexus Recharge Terminal</h3>
                <p className="text-white/40 font-mono text-[9px] tracking-[0.4em] uppercase">Load points instantly to your account</p>
              </div>

              {/* Standard packs grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* Pack 1 */}
                <button
                  onClick={() => handleRechargePack(50, 10)}
                  className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all text-left flex flex-col justify-between min-h-[140px] group"
                >
                  <div>
                    <span className="font-mono text-[8px] text-cyan-400 tracking-wider uppercase font-bold px-2 py-0.5 bg-cyan-950/40 border border-cyan-800/30 rounded-full">Neon Pack</span>
                    <h4 className="text-2xl font-display italic text-white mt-4 font-bold">+50 PTS</h4>
                  </div>
                  <div className="flex justify-between items-end w-full pt-4 border-t border-white/5">
                    <span className="font-mono text-[10px] text-white/40 uppercase">Standard</span>
                    <span className="font-mono text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">$10</span>
                  </div>
                </button>

                {/* Pack 2 */}
                <button
                  onClick={() => handleRechargePack(120, 20)}
                  className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-5 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all text-left flex flex-col justify-between min-h-[140px] relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/5 blur-xl rounded-full" />
                  <div>
                    <span className="font-mono text-[8px] text-cyan-400 tracking-wider uppercase font-bold px-2 py-0.5 bg-cyan-950/40 border border-cyan-800/30 rounded-full">Chrono Pack</span>
                    <h4 className="text-2xl font-display italic text-white mt-4 font-bold">+120 PTS</h4>
                  </div>
                  <div className="flex justify-between items-end w-full pt-4 border-t border-white/5 relative z-10">
                    <span className="font-mono text-[10px] text-cyan-400/70 uppercase font-semibold">Value Option</span>
                    <span className="font-mono text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">$20</span>
                  </div>
                </button>

                {/* Pack 3 */}
                <button
                  onClick={() => handleRechargePack(300, 45, true)}
                  className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all text-left flex flex-col justify-between min-h-[140px] relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 blur-xl rounded-full" />
                  <div>
                    <span className="font-mono text-[8px] text-amber-400 tracking-wider uppercase font-bold px-2 py-0.5 bg-amber-950/40 border border-amber-800/30 rounded-full">Apex VIP Pack</span>
                    <h4 className="text-2xl font-display italic text-white mt-4 font-bold">+300 PTS</h4>
                  </div>
                  <div className="flex justify-between items-end w-full pt-4 border-t border-white/5 relative z-10">
                    <span className="font-mono text-[9px] text-amber-400/80 uppercase font-bold flex items-center gap-1">
                      <Sparkles size={8} className="animate-spin" /> VIP TIER
                    </span>
                    <span className="font-mono text-sm font-bold text-white group-hover:text-amber-400 transition-colors">$45</span>
                  </div>
                </button>
              </div>

              {/* Custom input */}
              <form onSubmit={handleCustomRecharge} className="border-t border-white/5 pt-6 w-full">
                <div className="flex flex-col gap-3">
                  <label className="font-mono text-[8px] uppercase tracking-widest text-white/40">Custom Recharge Quantity (PTS)</label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Enter credits e.g. 75"
                      value={customPointsInput}
                      onChange={e => setCustomPointsInput(e.target.value)}
                      className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 font-mono text-sm text-white focus:outline-none focus:border-cyan-500/40"
                    />
                    <button
                      type="submit"
                      className="px-8 py-4 rounded-2xl bg-white text-black font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-cyan-400 hover:text-black transition-all"
                    >
                      Top-Up
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRIZE COUNTER REDEMPTION MODAL */}
      <AnimatePresence>
        {isRedeeming && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.93, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.93, y: 30, opacity: 0 }}
              className="w-full max-w-3xl bg-[#0b0c10] border border-amber-500/25 rounded-[36px] overflow-hidden flex flex-col p-8 md:p-10 shadow-[0_0_80px_rgba(245,158,11,0.15)] relative"
            >
              {/* Close */}
              <button 
                onClick={() => setIsRedeeming(false)}
                className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 z-10 text-white/40 hover:text-white"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-center text-center gap-2 mb-8 border-b border-white/5 pb-6">
                <div className="w-14 h-14 rounded-full bg-amber-400/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
                  <Trophy size={24} />
                </div>
                <h3 className="text-2xl font-display italic text-white tracking-wide">Nexus Prize Exchange Counter</h3>
                <p className="text-white/40 font-mono text-[9px] tracking-[0.4em] uppercase">Redeem your hard earned tickets for physical & digital merchandise</p>
                
                {/* Active balance in counter */}
                <div className="flex items-center gap-2 mt-4 bg-amber-950/20 border border-amber-500/35 px-4 py-2 rounded-full text-amber-400 font-mono text-[10px] tracking-wider uppercase font-bold shadow-[inset_0_0_10px_rgba(245,158,11,0.1)]">
                  Your Balance: {tickets} Tickets
                </div>
              </div>

              {/* Prize catalog */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
                {PRIZE_LIST.map((prize) => (
                  <div 
                    key={prize.id}
                    className="bg-white/5 border border-white/5 p-5 rounded-2xl flex justify-between items-center hover:bg-white/[0.08] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] group-hover:scale-110 transition-transform">{prize.icon}</span>
                      <div className="text-left flex flex-col">
                        <span className="font-mono text-sm text-white uppercase tracking-wider font-bold">{prize.name}</span>
                        <span className="text-white/40 text-[10px] mt-1 leading-snug">{prize.description}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3 border-l border-white/5 pl-4 ml-2 min-w-[110px]">
                      <span className="font-mono text-xs text-amber-400 font-bold tracking-wider">{prize.cost} TKT</span>
                      <button
                        onClick={() => handleRedeemPrize(prize)}
                        className="px-3.5 py-1.5 bg-amber-500 text-black hover:bg-amber-400 font-mono text-[8px] tracking-widest uppercase rounded-full font-bold transition-all"
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACTIVE GAME SIMULATOR FULLSCREEN OVERLAY */}
      <AnimatePresence>
        {activeGame && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl aspect-[1.5/1] bg-[#030608] border border-cyan-400/40 rounded-[40px] flex flex-col justify-between overflow-hidden p-10 md:p-12 shadow-[0_0_120px_rgba(34,211,238,0.2)] relative"
            >
              {/* Retro scanlines effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,_transparent_1px)] bg-[size:100%_3px] pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(34,211,238,0.015)_1px,_transparent_1px)] bg-[size:3px_100%] pointer-events-none" />

              {/* Top Bar: Connecting status */}
              <div className="flex justify-between items-center relative z-10 border-b border-cyan-500/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                  <span className="font-mono text-[9px] tracking-[0.5em] text-cyan-400 uppercase font-semibold">Virtual Simulator Terminal 0.99</span>
                </div>
                <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">
                  Game cost: -{activeGame.cost} PTS
                </span>
              </div>

              {/* CENTRAL WORKSPACE */}
              <div className="flex-1 flex flex-col justify-center items-center relative z-10 py-6">
                {/* STEP 1: BOOTING */}
                {gameStep === 'booting' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6"
                  >
                    {/* Simulated Loading Rings */}
                    <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin relative">
                      <div className="absolute inset-2 rounded-full border border-cyan-500/10 border-b-cyan-400 animate-spin duration-[1.5s]" />
                    </div>
                    <div className="flex flex-col gap-2 text-center mt-2">
                      <h4 className="font-display italic text-3xl text-white tracking-widest animate-pulse">CONNECTING VECTOR MATRIX...</h4>
                      <p className="font-mono text-[8px] text-cyan-500/70 tracking-[0.4em] uppercase">Deducting credits · Authenticating axis card</p>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: ACTIVE GAMEPLAY */}
                {gameStep === 'playing' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full max-w-lg flex flex-col items-center gap-8 text-center"
                  >
                    <div className="flex flex-col gap-1.5">
                      <span className="font-mono text-[8px] text-white/40 tracking-[0.4em] uppercase">Neo-Timing Matrix Tap</span>
                      <h4 className="font-display italic text-4xl text-white tracking-wide">{activeGame.name}</h4>
                    </div>

                    <p className="font-sans text-[11px] text-white/50 leading-relaxed font-light tracking-wide max-w-sm">
                      Tap the trigger exactly when the cursor aligns with the cyan core to maximize your won tickets!
                    </p>

                    {/* INTERACTIVE TIMING BAR */}
                    <div className="w-full flex flex-col gap-3 mt-4">
                      {/* Bar Container */}
                      <div className="w-full h-8 bg-black/60 border border-white/10 rounded-full relative overflow-hidden p-1 flex items-center">
                        {/* Outer Yellow/Great Zone */}
                        <div className="absolute left-[35%] right-[35%] top-1 bottom-1 bg-yellow-400/15 border-x border-yellow-400/25 rounded-md" />
                        
                        {/* Sweet Spot Core */}
                        <div className="absolute left-[45%] right-[45%] top-1 bottom-1 bg-cyan-400/35 border-x border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] rounded-sm flex items-center justify-center">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        </div>

                        {/* Moving Cursor */}
                        <div 
                          className="w-3.5 h-[90%] bg-white rounded-full shadow-[0_0_15px_white] absolute transition-all duration-75"
                          style={{ left: `${indicatorPos}%`, transform: 'translateX(-50%)' }}
                        />
                      </div>

                      {/* Sweet Spot Label */}
                      <div className="flex justify-between font-mono text-[7px] text-white/20 uppercase tracking-widest px-4">
                        <span>Glitch Range</span>
                        <span className="text-yellow-400/40">Great</span>
                        <span className="text-cyan-400/60 font-bold">CYBER CORE</span>
                        <span className="text-yellow-400/40">Great</span>
                        <span>Glitch Range</span>
                      </div>
                    </div>

                    <button
                      onClick={handleTimingClick}
                      className="px-10 py-5 rounded-2xl bg-cyan-400 text-black font-mono text-[10px] tracking-[0.5em] uppercase hover:bg-white font-bold transition-all shadow-[0_0_30px_rgba(34,211,238,0.4)] mt-3 transform active:scale-95"
                    >
                      Hit Matrix Core
                    </button>
                  </motion.div>
                )}

                {/* STEP 3: SCORE DISPLAY */}
                {gameStep === 'score' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6 text-center"
                  >
                    <div className="flex flex-col gap-2">
                      <span className={cn(
                        "font-mono text-xs tracking-[0.6em] uppercase font-bold py-1 px-4 rounded-full border inline-block mx-auto",
                        simulationRating === 'CRITICAL' && "bg-cyan-950/20 border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]",
                        simulationRating === 'GREAT' && "bg-yellow-950/20 border-yellow-400 text-yellow-400",
                        simulationRating === 'GLITCH' && "bg-white/5 border-white/20 text-white/50"
                      )}>
                        {simulationRating === 'CRITICAL' && '⚡ CRITICAL AXIS HIT! ⚡'}
                        {simulationRating === 'GREAT' && '✨ GREAT SLICE! ✨'}
                        {simulationRating === 'GLITCH' && '🌀 MATRIX GLITCH 🌀'}
                      </span>
                      <h4 className="font-display italic text-4xl text-white tracking-widest uppercase mt-4">Simulation Complete</h4>
                    </div>

                    {/* Tickets Won Showcase */}
                    <div className="flex flex-col items-center gap-2 p-6 bg-white/5 border border-white/10 rounded-3xl min-w-[280px]">
                      <span className="font-mono text-[8px] text-white/30 uppercase tracking-widest">Payout Matrix</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-5xl font-display italic font-bold tracking-tight text-yellow-400">
                          +{simulationTickets}
                        </span>
                        <span className="font-mono text-xs text-white/40 tracking-wider">TICKETS</span>
                      </div>
                    </div>

                    <button
                      onClick={closeGameSimulator}
                      className="px-8 py-4 rounded-full bg-white text-black font-mono text-[9px] tracking-widest uppercase hover:bg-cyan-400 hover:text-black transition-all mt-4 font-bold"
                    >
                      Return to Nexus
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Bottom Console Feed details */}
              <div className="flex justify-between items-center relative z-10 border-t border-cyan-500/10 pt-5 font-mono text-[8px] text-cyan-500/40">
                <span>SECTOR: 03-NEXUS-CORE</span>
                <span>STATUS: AUTHENTICATED</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
