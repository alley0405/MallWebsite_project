"use client"

import React, { useRef, useState, useEffect } from "react"
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { BrandStoreModal } from "./brand-store"
import { CardStack } from "./card-stack"
import type { CardStackItem } from "./card-stack"

type ImageItem = {
  id: number | string
  title: string
  desc: string
  url: string
  span: string
}

interface InteractiveImageBentoGalleryProps {
  imageItems: ImageItem[]
  title: string
  description: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9, rotateX: 10 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { type: "spring" as const, stiffness: 60, damping: 20 },
  },
}

const ImageModal = ({
  item,
  onClose,
  onVisitStore,
}: {
  item: ImageItem
  onClose: () => void
  onVisitStore: () => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl px-10"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        exit={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
        transition={{ type: "spring" as const, stiffness: 40, damping: 25 }}
        className="relative w-full max-w-7xl flex flex-col md:flex-row gap-12 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-2/3 shadow-[0_0_100px_rgba(212,175,55,0.1)]">
            <img
              src={item.url}
              alt={item.title}
              className="h-auto max-h-[75vh] w-full rounded-[40px] object-cover border border-white/10"
            />
        </div>
        <div className="w-full md:w-1/3 text-left">
            <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-12 bg-accent"></div>
                <span className="font-mono text-accent text-xs tracking-[1em] uppercase">Archive Hub</span>
            </div>
            <h2 className="text-6xl font-display italic text-white mb-8 tracking-tighter leading-tight">{item.title}</h2>
            <p className="text-white/50 font-sans text-xl leading-relaxed max-w-md tracking-wide">{item.desc}</p>
            <button 
              onClick={onVisitStore}
              className="mt-12 px-12 py-5 bg-white text-black font-mono text-[10px] tracking-[0.5em] uppercase hover:bg-accent transition-all duration-500"
            >
              Visit Store
            </button>
        </div>
      </motion.div>
      <button
        onClick={onClose}
        className="absolute right-12 top-12 text-white/30 transition-all hover:text-white hover:scale-110"
      >
        <X size={40} />
      </button>
    </motion.div>
  )
}

const InteractiveImageBentoGallery: React.FC<
  InteractiveImageBentoGalleryProps
> = ({ imageItems, title, description }) => {
  const [selectedItem, setSelectedItem] = useState<ImageItem | null>(null)
  const [isStoreOpen, setIsStoreOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])

  const cardStackItems: CardStackItem[] = imageItems.map(item => ({
    id: item.id,
    title: item.title,
    description: item.desc,
    imageSrc: item.url,
  }));

  return (
    <section ref={targetRef} className="relative w-full overflow-hidden bg-transparent py-20">
      <motion.div style={{ opacity }} className="container mx-auto px-4 mb-10 text-left px-20">
        <div className="flex items-center gap-6 mb-8">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            </div>
            <div className="h-[1px] flex-1 bg-white/5"></div>
        </div>
        <h2 className="text-7xl font-display font-bold italic tracking-tighter text-white">{title}</h2>
        <p className="mt-8 max-w-3xl text-xl font-sans text-white/40 tracking-[0.1em] leading-relaxed uppercase">{description}</p>
      </motion.div>

      {/* Center Focused 3D Card Stack */}
      <div ref={containerRef} className="relative w-full max-w-5xl mx-auto px-20 flex justify-center items-center py-10">
        <CardStack
          items={cardStackItems}
          initialIndex={0}
          autoAdvance={false}
          showDots
          cardWidth={560}
          cardHeight={360}
          overlap={0.52}
          spreadDeg={36}
          perspectivePx={1200}
          depthPx={110}
          tiltXDeg={8}
          renderCard={(item, state) => (
            <div className="relative w-full h-full group overflow-hidden bg-black/60 rounded-[30px] border border-white/10 select-none">
              {/* Background Image with grayscale/blur on inactive */}
              <img
                src={item.imageSrc}
                alt={item.title}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-all duration-1000",
                  state.active 
                    ? "grayscale-0 scale-105 opacity-80" 
                    : "grayscale-[0.8] scale-100 opacity-40 blur-[2px]"
                )}
                draggable={false}
              />
              {/* Neon Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              
              {/* Glow highlight on border */}
              <div className={cn(
                "absolute inset-0 border-[3px] rounded-[30px] transition-all duration-700 pointer-events-none",
                state.active ? "border-accent/40 shadow-[inset_0_0_40px_rgba(212,175,55,0.3)]" : "border-white/5"
              )} />

              {/* Content */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-10 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[1px] w-8 bg-accent"></div>
                  <span className="text-[10px] font-mono tracking-[0.6em] uppercase text-accent font-bold">Lumina Store</span>
                </div>
                <h3 className="text-4xl font-display italic text-white tracking-tighter mb-4 group-hover:text-accent transition-colors duration-500">
                  {item.title}
                </h3>
                <p className="text-white/50 text-xs font-mono leading-relaxed uppercase tracking-[0.2em] mb-8 line-clamp-2">
                  {item.description}
                </p>

                {state.active && (
                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const originalItem = imageItems.find(imgIt => imgIt.title === item.title);
                      if (originalItem) {
                        setSelectedItem(originalItem);
                        setIsStoreOpen(true);
                      }
                    }}
                    className="self-start px-12 py-5 bg-white text-black font-mono text-[9px] tracking-[0.5em] uppercase hover:bg-accent transition-all duration-500 rounded-full font-bold shadow-2xl hover:scale-105"
                  >
                    Enter Store
                  </motion.button>
                )}
              </div>
            </div>
          )}
        />
      </div>

      <AnimatePresence>
        {selectedItem && !isStoreOpen && (
          <ImageModal 
            item={selectedItem} 
            onClose={() => setSelectedItem(null)} 
            onVisitStore={() => setIsStoreOpen(true)}
          />
        )}
      </AnimatePresence>

      <BrandStoreModal 
        isOpen={isStoreOpen} 
        onClose={() => {
          setIsStoreOpen(false);
          setSelectedItem(null);
        }} 
        brandName={selectedItem?.title || ""} 
      />
    </section>
  )
}

export default InteractiveImageBentoGallery
