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
}: {
  item: ImageItem
  onClose: () => void
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
            <button className="mt-12 px-12 py-5 bg-white text-black font-mono text-[10px] tracking-[0.5em] uppercase hover:bg-accent transition-all duration-500">Visit Store</button>
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
  const [dragConstraint, setDragConstraint] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const calculateConstraints = () => {
      if (gridRef.current && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const gridWidth = gridRef.current.scrollWidth
        const newConstraint = Math.min(0, containerWidth - gridWidth - 64)
        setDragConstraint(newConstraint)
      }
    }
    calculateConstraints()
    window.addEventListener("resize", calculateConstraints)
    return () => window.removeEventListener("resize", calculateConstraints)
  }, [imageItems])

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
  const drift = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section ref={targetRef} className="relative w-full overflow-hidden bg-transparent py-20">
      <motion.div style={{ opacity }} className="container mx-auto px-4 mb-20 text-left px-20">
        <div className="flex items-center gap-6 mb-8">
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            </div>
            <div className="h-[1px] flex-1 bg-white/5"></div>
        </div>
        <h2 className="text-7xl font-display font-bold italic tracking-tighter text-white">{title}</h2>
        <p className="mt-8 max-w-3xl text-xl font-sans text-white/40 tracking-[0.1em] leading-relaxed uppercase">{description}</p>
      </motion.div>

      <div ref={containerRef} className="relative w-full cursor-grab active:cursor-grabbing px-20">
        <motion.div style={{ x: drift }} className="w-max">
          <motion.div
            ref={gridRef}
            className="grid auto-cols-[minmax(25rem,1fr)] grid-flow-col gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {imageItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={cn(
                  "group relative flex h-[35rem] w-[25rem] cursor-pointer items-end overflow-hidden rounded-[40px] border border-white/5 bg-white/[0.02] p-10 backdrop-blur-sm transition-all duration-700 hover:border-accent/40 hover:bg-white/[0.05] shadow-2xl",
                  item.span,
                )}
                whileHover={{ y: -20, scale: 1.02 }}
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="absolute inset-0 h-full w-full object-cover grayscale-[0.6] opacity-60 transition-all duration-1000 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-700 group-hover:opacity-40" />
                
                <div className="relative z-10 w-full translate-y-4 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-[1px] w-10 bg-accent"></div>
                    <span className="text-[10px] font-mono tracking-[0.8em] uppercase text-accent font-bold">Lumina Store</span>
                  </div>
                  <h3 className="text-4xl font-display italic text-white tracking-tighter group-hover:text-accent transition-colors duration-500">{item.title}</h3>
                  <p className="mt-4 text-xs font-mono text-white/40 leading-[2] uppercase tracking-[0.4em] line-clamp-2">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <ImageModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

export default InteractiveImageBentoGallery
