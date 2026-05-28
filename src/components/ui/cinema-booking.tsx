import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X, Ticket, Coffee, CreditCard, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CinemaBookingProps {
  isOpen: boolean;
  onClose: () => void;
}

const SEATS = Array(64).fill(0).map((_, i) => ({ id: i, status: Math.random() > 0.8 ? 'taken' : 'available' }));

const SNACKS = [
    { id: 1, name: "Neon Popcorn", price: 12, icon: "🍿" },
    { id: 2, name: "Metropolis Soda", price: 8, icon: "🥤" },
    { id: 3, name: "Glitch Nachos", price: 15, icon: "🧀" },
];

export function CinemaBookingSystem({ isOpen, onClose }: CinemaBookingProps) {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [cart, setCart] = useState<{name: string, price: number}[]>([]);
  const [step, setStep] = useState<'seats' | 'food' | 'pay'>('seats');

  const toggleSeat = (id: number) => {
    if (SEATS[id].status === 'taken') return;
    setSelectedSeats(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const addToCart = (snack: any) => setCart(prev => [...prev, snack]);

  const totalPrice = (selectedSeats.length * 25) + cart.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-10 bg-black/90 backdrop-blur-3xl"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="w-full max-w-6xl h-full max-h-[85vh] bg-[#0a0a0a] border border-white/10 rounded-[40px] overflow-hidden flex shadow-[0_0_100px_rgba(212,175,55,0.1)] relative"
          >
            {/* CLOSE BUTTON */}
            <button 
              onClick={onClose}
              className="absolute top-10 right-10 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all z-10"
            >
              <X className="text-white/40 w-5 h-5" />
            </button>

            {/* LEFT SIDE - MOVIE PANEL */}
            <div className="w-1/3 border-r border-white/5 p-12 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 filter grayscale blur-xl bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800')] bg-cover"></div>
                <div className="relative z-10">
                    <span className="font-mono text-accent text-[10px] tracking-[1em] uppercase">Now Showing</span>
                    <h2 className="text-white font-display text-5xl italic mt-6">Metropolis Rising</h2>
                    <div className="flex gap-4 mt-8 font-mono text-[9px] text-white/40 tracking-widest uppercase">
                        <span>Sci-Fi</span>
                        <span>•</span>
                        <span>142 MIN</span>
                        <span>•</span>
                        <span className="text-accent">IMAX LASER</span>
                    </div>
                    <p className="text-white/30 text-xs mt-10 leading-relaxed max-w-xs font-sans tracking-wide">
                        Experience the fall and rebirth of the ultimate city in a vision captured through pure light.
                    </p>
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-black">
                            <Ticket size={20} />
                        </div>
                        <div>
                            <p className="text-white/60 text-[10px] font-mono tracking-widest uppercase">Total Bill</p>
                            <p className="text-white text-2xl font-bold">${totalPrice}</p>
                        </div>
                    </div>
                    <button className="w-full py-5 bg-white text-black font-mono text-[10px] tracking-[0.6em] uppercase hover:bg-accent transition-all duration-500">
                        Confirm Axis
                    </button>
                </div>
            </div>

            {/* RIGHT SIDE - INTERACTIVE WORKFLOW */}
            <div className="flex-1 p-16 overflow-y-auto scrollbar-hide">
                <div className="flex justify-between items-center mb-16 px-10">
                    {['seats', 'food', 'pay'].map((s, i) => (
                        <div key={s} className="flex items-center gap-4">
                            <div className={cn(
                                "w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs transition-all duration-500",
                                step === s ? "bg-accent border-accent text-black" : "border-white/10 text-white/20"
                            )}>
                                {i + 1}
                            </div>
                            <span className={cn("font-mono text-[9px] tracking-[0.4em] uppercase", step === s ? "text-white" : "text-white/20")}>{s}</span>
                            {i < 2 && <div className="w-10 h-[1px] bg-white/5 mx-4"></div>}
                        </div>
                    ))}
                </div>

                {step === 'seats' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="w-full h-8 bg-accent/20 rounded-[50%] blur-xl mb-20 shadow-[0_0_50px_rgba(212,175,55,0.2)]"></div>
                        <div className="grid grid-cols-8 gap-4 max-w-lg mx-auto">
                            {SEATS.map((seat) => (
                                <button 
                                    key={seat.id} 
                                    onClick={() => toggleSeat(seat.id)}
                                    className={cn(
                                        "w-8 h-8 rounded-lg transition-all duration-500",
                                        seat.status === 'taken' ? "bg-white/5 cursor-not-allowed opacity-20" : 
                                        selectedSeats.includes(seat.id) ? "bg-accent scale-110 shadow-[0_0_15px_rgba(212,175,55,0.5)]" : "bg-white/10 hover:bg-white/20"
                                    )}
                                />
                            ))}
                        </div>
                        <div className="flex justify-center gap-12 mt-16 text-white/20 font-mono text-[9px] uppercase tracking-widest">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-accent rounded-sm"></div><span>Selected</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white/20 rounded-sm"></div><span>Available</span></div>
                        </div>
                        <div className="mt-16 flex justify-end">
                            <button onClick={() => setStep('food')} className="flex items-center gap-4 text-white hover:text-accent transition-colors group">
                                <span className="font-mono text-[10px] tracking-[0.5em] uppercase">Snack Bar</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 'food' && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
                            {SNACKS.map(snack => (
                                <button 
                                    key={snack.id}
                                    onClick={() => addToCart(snack)}
                                    className="flex justify-between items-center bg-white/5 border border-white/5 p-6 rounded-2xl hover:bg-white/10 transition-all group"
                                >
                                    <div className="flex items-center gap-6">
                                        <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{snack.icon}</span>
                                        <div className="text-left">
                                            <p className="text-white font-mono text-sm uppercase tracking-widest">{snack.name}</p>
                                            <p className="text-accent text-[10px] font-mono mt-1">${snack.price}</p>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white/20 group-hover:border-accent group-hover:text-accent transition-all">+</div>
                                </button>
                            ))}
                        </div>
                        <div className="mt-16 flex justify-between items-center border-t border-white/5 pt-10">
                            <button onClick={() => setStep('seats')} className="text-white/40 hover:text-white transition-colors font-mono text-[9px] uppercase tracking-widest">Back to Screen</button>
                            <button onClick={() => setStep('pay')} className="flex items-center gap-4 text-white hover:text-accent transition-colors group">
                                <span className="font-mono text-[10px] tracking-[0.5em] uppercase">Checkout</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                )}
                
                {step === 'pay' && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-8">
                            <CreditCard size={32} />
                        </div>
                        <h3 className="text-3xl italic font-display text-white mb-4">Secure Terminal</h3>
                        <p className="text-white/40 font-mono text-[9px] tracking-[0.5em] uppercase mb-12">Lumina Financial Hub 01X</p>
                        <div className="w-full max-w-sm bg-white/5 rounded-3xl p-8 border border-white/10">
                             <div className="flex justify-between text-xs font-mono uppercase text-white/50 mb-4"><span>Subtotal</span><span>${totalPrice}</span></div>
                             <div className="flex justify-between text-xs font-mono uppercase text-white/50 mb-8"><span>Transaction Fee</span><span>$0.00</span></div>
                             <div className="w-full h-[1px] bg-white/10 mb-8"></div>
                             <div className="flex justify-between text-lg font-mono uppercase text-white font-bold"><span>Payable</span><span>${totalPrice}</span></div>
                        </div>
                    </motion.div>
                )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
