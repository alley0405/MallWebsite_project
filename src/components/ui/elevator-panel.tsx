import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface ElevatorPanelProps {
  currentFloor: number;
  onFloorChange: (floor: number) => void;
  isTransitioning: boolean;
}

export function ElevatorPanel({ currentFloor, onFloorChange, isTransitioning }: ElevatorPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Auto-hide when floor is reached
  useEffect(() => {
    if (!isTransitioning) {
        const timer = setTimeout(() => setIsOpen(false), 2000);
        return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const floors = [
    { label: "5", id: 5 },
    { label: "4", id: 4 },
    { label: "3", id: 3 },
    { label: "2", id: 2 },
    { label: "1", id: 1 },
    { label: "G", id: 0 },
  ];

  return (
    <>
      {/* TRIGGER ZONE */}
      <div 
        onMouseEnter={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 w-4 h-[60vh] z-[110] bg-white/[0.02] hover:bg-accent/5 transition-colors cursor-pointer flex items-center justify-center group"
      >
          <div className="w-[1px] h-20 bg-accent/20 group-hover:bg-accent group-hover:h-32 transition-all duration-500"></div>
      </div>

      {/* COMPACT VERTICAL PANEL */}
      <div 
        className={cn(
            "fixed right-0 top-1/2 -translate-y-1/2 z-[100] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]",
            isOpen ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-0 pointer-events-none"
        )}
      >
        <div className="bg-black/60 backdrop-blur-2xl border-l border-y border-white/10 rounded-l-[40px] p-8 flex flex-col items-center gap-6 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col items-center gap-1 mb-2">
                <span className="text-white/20 font-mono text-[8px] tracking-[0.4em] uppercase">Control</span>
                <div className="w-1 h-1 bg-accent rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex flex-col gap-4">
                {floors.map((floor) => (
                <button
                    key={floor.id}
                    onClick={() => {
                        onFloorChange(floor.id);
                        if (!isTransitioning) setIsOpen(false); // Immediate feedback
                    }}
                    className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 relative group overflow-hidden",
                    currentFloor === floor.id 
                        ? "bg-accent text-black scale-110 shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                        : "bg-white/5 border border-white/5 text-white/40 hover:bg-white/10 hover:border-white/20 hover:text-white"
                    )}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="font-mono text-sm font-bold relative z-10">{floor.label}</span>
                </button>
                ))}
            </div>

            <div className="h-20 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
            
            <div className="flex flex-col items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-accent/30 flex items-center justify-center">
                    <div className={cn("w-full h-full rounded-full bg-accent transition-all", isTransitioning ? "animate-ping" : "opacity-0")}></div>
                 </div>
                 <span className="font-mono text-[7px] tracking-[0.2em] text-white/30 uppercase rotate-90 whitespace-nowrap -mb-10 mt-6">Lift System v.2</span>
            </div>
        </div>
      </div>
    </>
  );
}
