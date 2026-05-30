import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ElevatorPanel } from "@/components/ui/elevator-panel";
import { CinemaBookingSystem, CinemaFloorSystem } from "@/components/ui/cinema-booking";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CosmicParallaxBg } from "@/components/ui/parallax-cosmic-background";
import { BrandStoreModal } from "@/components/ui/brand-store";
import { ArcadeNexusSystem } from "@/components/ui/arcade-system";
import { FoodCourtSystem } from "@/components/ui/food-court";
import { LoungeBookingSystem } from "@/components/ui/lounge-booking";

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = ({ active }: { active: boolean }) => (
  <nav className={`fixed top-0 left-0 w-full z-[100] px-20 py-10 transition-all duration-1000 ease-in-out ${active ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
    <div className="flex justify-between items-center text-white border-b border-white/10 pb-6 relative">
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-10 h-10 rounded-full border border-accent/20 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-ping" />
            <div className="absolute inset-0 w-full h-full rounded-full border-t border-accent/50 animate-spin duration-[4s]" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-mono text-[10px] tracking-[0.8em] uppercase font-bold text-accent">Lumina Axis</span>
          <span className="font-mono text-[7px] tracking-[0.3em] uppercase text-white/30 mt-1">Metropolis Hub — A1</span>
        </div>
      </div>
      <div className="flex gap-16 items-center">
        <div className="flex gap-12 font-mono text-[9px] tracking-[0.5em] uppercase text-white/50">
          <a href="#" className="hover:text-accent transition-colors">Directory</a>
          <a href="#" className="hover:text-accent transition-colors">Exhibitions</a>
        </div>
        <button className="px-8 py-2 border border-accent/30 rounded-full font-mono text-[8px] tracking-[0.4em] uppercase hover:bg-accent/10 transition-all">
          Explore
        </button>
      </div>
    </div>
  </nav>
);

// ─── Brand data ───────────────────────────────────────────────────────────────
type BrandCategory = "All" | "Apparel" | "Footwear" | "Sports" | "Luxury";

const brands = [
  {
    id: 1,
    name: "H&M",
    tag: "Fast Fashion",
    category: "Apparel",
    level: "F1 - Bay 01",
    priceBand: "Rs 799+",
    offer: "Weekend essentials at 20% off",
    products: 42,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=80",
  },
  {
    id: 2,
    name: "ZARA",
    tag: "Contemporary Style",
    category: "Apparel",
    level: "F1 - Bay 02",
    priceBand: "Rs 1,490+",
    offer: "New capsule collection live",
    products: 36,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80",
  },
  {
    id: 3,
    name: "TOMMY HILFIGER",
    tag: "Classic American Cool",
    category: "Luxury",
    level: "F1 - Bay 03",
    priceBand: "Rs 2,999+",
    offer: "Premium denim edit",
    products: 28,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=80",
  },
  {
    id: 4,
    name: "ADIDAS",
    tag: "Sport & Streetwear",
    category: "Sports",
    level: "F1 - Bay 04",
    priceBand: "Rs 1,999+",
    offer: "Running shoes trial zone open",
    products: 31,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80",
  },
  {
    id: 5,
    name: "LOUIS PHILIPPE",
    tag: "Mark of Elegance",
    category: "Luxury",
    level: "F1 - Bay 05",
    priceBand: "Rs 3,499+",
    offer: "Formalwear concierge available",
    products: 24,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=900&q=80",
  },
] satisfies Array<{
  id: number;
  name: string;
  tag: string;
  category: Exclude<BrandCategory, "All">;
  level: string;
  priceBand: string;
  offer: string;
  products: number;
  image: string;
}>;

// ─── Floor content ────────────────────────────────────────────────────────────
const floorContent = [
  { title: "Lumina Grand",       description: "The Neo Metropolis Gateway. Architectural wonder unfolds here.", media: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1950&q=80" },
  { title: "Couture Collective", description: "H&M, Zara, Tommy Hilfiger, Louis Philippe, Adidas.",            media: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1950&q=80" },
  { title: "Cinematic Hub",      description: "INOX Cinemas. Experience the latest blockbusters.",              media: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1950&q=80" },
  { title: "Arcade Nexus",       description: "Game Zone & Toys Section. Nostalgia meets digital edge.",        media: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1950&q=80" },
  { title: "Neon Food Court",    description: "Global franchises and fine dining experiences.",                  media: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1950&q=80" },
  { title: "Sky Deck Lounge",    description: "Panoramic sanctuary under simulated moonlight.",                  media: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1950&q=80" },
];

const getInitialFloor = () => {
  if (typeof window === 'undefined') return 0;
  const floor = Number(new URLSearchParams(window.location.search).get('floor'));
  return Number.isInteger(floor) && floor >= 0 && floor < floorContent.length ? floor : 0;
};

// ─── Couture Hover-Reveal Brand Menu ─────────────────────────────────────────
function CoutureBrandMenu({ onEnterStore }: { onEnterStore: (name: string) => void }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<BrandCategory>("All");
  const [featuredId, setFeaturedId] = useState(2);
  const [mousePos, setMousePos]   = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const hoveredBrand = brands.find(b => b.id === hoveredId) ?? null;
  const visibleBrands = activeCategory === "All" ? brands : brands.filter(brand => brand.category === activeCategory);
  const featuredBrand = brands.find(brand => brand.id === featuredId) ?? brands[0];
  const categories: BrandCategory[] = ["All", "Apparel", "Footwear", "Sports", "Luxury"];

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full flex flex-col justify-center"
      style={{ minHeight: '100vh' }}
    >
      {/* Star-field background */}
      <CosmicParallaxBg head="" text="" loop />

      {/* Floating preview card — follows cursor */}
      <AnimatePresence>
        {hoveredBrand && (
          <motion.div
            key={hoveredBrand.id}
            initial={{ opacity: 0, scale: 0.88, y: 18 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.88, y: 18  }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="pointer-events-none absolute z-30 w-[400px] rounded-[24px] overflow-hidden shadow-[0_8px_80px_rgba(212,175,55,0.18)]"
            style={{
              left: Math.min(mousePos.x + 52, (containerRef.current?.offsetWidth ?? 1200) - 430),
              top:  Math.min(Math.max(mousePos.y - 170, 16), (containerRef.current?.offsetHeight ?? 800) - 370),
            }}
          >
            {/* Image */}
            <div className="relative h-[240px]">
              <img
                src={hoveredBrand.image}
                alt={hoveredBrand.name}
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Accent border glow */}
              <div className="absolute inset-0 rounded-t-[24px] border border-accent/25 shadow-[inset_0_0_36px_rgba(212,175,55,0.15)]" />
            </div>
            {/* Card footer */}
            <div className="bg-[#0c0c0c] border-t border-white/[0.06] px-7 py-5">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="h-[1px] w-5 bg-accent" />
                <span className="font-mono text-[8px] tracking-[0.7em] uppercase text-accent">{hoveredBrand.tag}</span>
              </div>
              <h3 className="font-display italic text-xl text-white tracking-tight leading-none">{hoveredBrand.name}</h3>
              <p className="font-mono text-[8px] tracking-[0.4em] text-white/30 uppercase mt-2">Click to enter store →</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand list */}
      <div className="relative z-20 px-20 md:px-32 py-20 flex flex-col justify-center" style={{ minHeight: '100vh' }}>

        {/* Section header */}
        <div className="mb-10 flex items-center gap-5">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="font-mono text-[9px] tracking-[0.8em] uppercase text-accent font-bold">Couture Collective — Floor 01</span>
        </div>

        <h1 className="font-display italic text-[6.5vw] leading-none tracking-tighter text-white mb-3">
          Axial Brands
        </h1>
        <p className="font-mono text-[9px] tracking-[0.5em] uppercase text-white/25 mb-14">
          Hover to preview · Click to enter
        </p>

        {/* Rows */}
        <ul className="flex flex-col">
          {brands.map((brand, idx) => (
            <li key={brand.id} className="relative border-t border-white/[0.06] last:border-b last:border-white/[0.06]">
              <div
                onMouseEnter={() => setHoveredId(brand.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onEnterStore(brand.name)}
                className="group relative flex items-center justify-between py-6 cursor-pointer select-none overflow-hidden"
              >
                {/* Hover background fill */}
                <motion.div
                  className="absolute inset-0 bg-white/[0.02] origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredId === brand.id ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />

                {/* Left: index + name */}
                <div className="relative flex items-center gap-8">
                  <span className="font-mono text-[9px] text-white/20 group-hover:text-accent transition-colors duration-300 w-5 tabular-nums leading-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <motion.span
                    className="font-display italic leading-none tracking-tighter text-white/75 group-hover:text-white transition-colors duration-200"
                    style={{ fontSize: 'clamp(1.8rem, 3.2vw, 3.6rem)' }}
                    animate={{ x: hoveredId === brand.id ? 10 : 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  >
                    {brand.name}
                  </motion.span>
                </div>

                {/* Right: tag + animated arrow */}
                <div className="relative flex items-center gap-5">
                  <span className="font-mono text-[8px] tracking-[0.4em] uppercase text-white/20 group-hover:text-white/40 transition-colors duration-300 hidden md:block">
                    {brand.tag}
                  </span>
                  <motion.div
                    className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:border-accent group-hover:text-accent group-hover:bg-accent/10 transition-all duration-300"
                    animate={{ rotate: hoveredId === brand.id ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 420, damping: 22 }}
                  >
                    <ArrowRight size={13} />
                  </motion.div>
                </div>

                {/* Gold accent underline sweep */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-accent/80 via-accent/40 to-transparent origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredId === brand.id ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="mt-14 flex items-center gap-4">
          <div className="h-[1px] w-10 bg-white/10" />
          <span className="font-mono text-[7px] tracking-[0.5em] uppercase text-white/20">
            {brands.length} brands · Couture Collective · Lumina Grand
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main App Component ───────────────────────────────────────────────────────
function FashionFloorSystem({ onEnterStore }: { onEnterStore: (name: string) => void }) {
  const [activeCategory, setActiveCategory] = useState<BrandCategory>("All");
  const [featuredId, setFeaturedId] = useState(2);
  const visibleBrands = activeCategory === "All" ? brands : brands.filter(brand => brand.category === activeCategory);
  const featuredBrand = brands.find(brand => brand.id === featuredId) ?? brands[0];
  const categories: BrandCategory[] = ["All", "Apparel", "Footwear", "Sports", "Luxury"];

  return (
    <div className="relative w-full min-h-screen px-10 md:px-20 xl:px-32 py-28 flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1950&q=80"
          alt=""
          className="h-full w-full object-cover opacity-55"
          draggable={false}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(212,175,55,0.22),transparent_32%),linear-gradient(90deg,rgba(0,0,0,0.92),rgba(0,0,0,0.62)_42%,rgba(0,0,0,0.86))]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:80px_80px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/65 to-transparent" />
      </div>

      <div className="relative z-10 w-full grid grid-cols-1 xl:grid-cols-[0.86fr_1.14fr] gap-10 items-center">
        <section>
          <div className="mb-8 flex items-center gap-5">
            <div className="w-10 h-10 rounded-full border border-accent/30 bg-black/40 backdrop-blur-xl flex items-center justify-center">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            </div>
            <span className="font-mono text-[9px] tracking-[0.8em] uppercase text-accent font-bold">Couture Collective - Floor 01</span>
          </div>
          <h1 className="font-display italic text-[clamp(4.2rem,8vw,8.7rem)] leading-none tracking-tighter text-white mb-6 drop-shadow-[0_18px_45px_rgba(0,0,0,0.65)]">Couture Collective</h1>
          <p className="max-w-2xl font-mono text-[10px] md:text-xs tracking-[0.35em] uppercase text-white/35 leading-loose mb-10">
            Browse fashion brands, filter collections, preview offers, and enter each store for shopping.
          </p>

          <div className="grid grid-cols-3 gap-3 mb-10 max-w-xl">
            <div className="border border-white/10 bg-black/45 backdrop-blur-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <span className="font-mono text-[8px] tracking-[0.35em] uppercase text-white/35">Brands</span>
              <p className="mt-3 font-display italic text-4xl leading-none text-white">{brands.length}</p>
            </div>
            <div className="border border-white/10 bg-black/45 backdrop-blur-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <span className="font-mono text-[8px] tracking-[0.35em] uppercase text-white/35">Products</span>
              <p className="mt-3 font-display italic text-4xl leading-none text-white">{brands.reduce((sum, brand) => sum + brand.products, 0)}</p>
            </div>
            <div className="border border-white/10 bg-black/45 backdrop-blur-2xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <span className="font-mono text-[8px] tracking-[0.35em] uppercase text-white/35">Open</span>
              <p className="mt-3 font-display italic text-4xl leading-none text-white">10-10</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-3 rounded-full border font-mono text-[9px] tracking-[0.35em] uppercase transition-all ${activeCategory === category ? "bg-accent text-black border-accent" : "bg-white/5 text-white/45 border-white/10 hover:text-white hover:border-white/25"}`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-[1fr_0.88fr] gap-6 min-h-[70vh]">
          <div className="flex flex-col justify-end border border-white/10 bg-black/42 backdrop-blur-2xl px-7 py-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
            <ul className="flex flex-col">
              {visibleBrands.map((brand, idx) => (
                <li key={brand.id} className="relative border-t border-white/[0.08] last:border-b last:border-white/[0.08]">
                  <button
                    onMouseEnter={() => setFeaturedId(brand.id)}
                    onFocus={() => setFeaturedId(brand.id)}
                    onClick={() => onEnterStore(brand.name)}
                    className={`group relative w-full flex items-center justify-between py-5 text-left overflow-hidden transition-all ${featuredId === brand.id ? "bg-accent/[0.08]" : "hover:bg-white/[0.025]"}`}
                  >
                    <div className="relative flex items-center gap-6 min-w-0 px-1">
                      <span className="font-mono text-[9px] text-white/20 group-hover:text-accent transition-colors duration-300 w-5 tabular-nums leading-none">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <span className="block font-display italic leading-none tracking-tighter text-white/75 group-hover:text-white transition-colors duration-200" style={{ fontSize: "clamp(1.8rem, 3vw, 3.4rem)" }}>{brand.name}</span>
                        <span className="mt-2 block font-mono text-[8px] tracking-[0.35em] uppercase text-white/25">{brand.category} - {brand.level}</span>
                      </div>
                    </div>
                    <div className="relative flex items-center gap-5 pr-1">
                      <span className="font-mono text-[8px] tracking-[0.35em] uppercase text-white/25 group-hover:text-white/45 transition-colors hidden md:block">{brand.priceBand}</span>
                      <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/25 group-hover:border-accent group-hover:text-accent group-hover:bg-accent/10 transition-all duration-300">
                        <ArrowRight size={13} />
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            {visibleBrands.length === 0 && (
              <div className="border border-white/10 bg-black/45 backdrop-blur-xl p-10 text-white/35 font-mono text-[10px] tracking-[0.35em] uppercase">No brands in this category yet.</div>
            )}
          </div>

          <div className="border border-accent/20 bg-black/62 backdrop-blur-2xl p-5 flex flex-col justify-between shadow-[0_35px_110px_rgba(0,0,0,0.55)]">
            <AnimatePresence mode="wait">
              <motion.div key={featuredBrand.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} className="flex flex-col h-full">
                <div className="relative h-80 overflow-hidden border border-white/10">
                  <img src={featuredBrand.image} alt={featuredBrand.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                  <div className="absolute inset-0 border border-accent/10 shadow-[inset_0_0_45px_rgba(212,175,55,0.12)]" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="font-mono text-[8px] tracking-[0.35em] uppercase text-accent">{featuredBrand.tag}</span>
                    <h2 className="mt-3 font-display italic text-5xl text-white leading-none">{featuredBrand.name}</h2>
                  </div>
                </div>
                <div className="py-6 flex-1">
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="border border-white/10 bg-white/[0.03] p-4">
                      <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/30">Location</span>
                      <p className="mt-2 font-mono text-[10px] tracking-[0.25em] uppercase text-white">{featuredBrand.level}</p>
                    </div>
                    <div className="border border-white/10 bg-white/[0.03] p-4">
                      <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/30">Starting</span>
                      <p className="mt-2 font-mono text-[10px] tracking-[0.25em] uppercase text-white">{featuredBrand.priceBand}</p>
                    </div>
                  </div>
                  <div className="border border-accent/25 bg-accent/10 p-5">
                    <span className="font-mono text-[8px] tracking-[0.35em] uppercase text-accent">Live Offer</span>
                    <p className="mt-3 text-white/75 text-sm leading-relaxed">{featuredBrand.offer}</p>
                  </div>
                </div>
                <button onClick={() => onEnterStore(featuredBrand.name)} className="w-full py-5 rounded-full bg-white text-black hover:bg-accent transition-all font-mono text-[10px] tracking-[0.45em] uppercase">Enter Store</button>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}

export function Component() {
  const initialFloorRef = useRef(getInitialFloor());
  const [currentSlide, setCurrentSlide]     = useState(initialFloorRef.current);
  const [isLiftMoving, setIsLiftMoving]     = useState(false);
  const [isBookingOpen, setIsBookingOpen]   = useState(false);
  const [isBrandStoreOpen, setIsBrandStoreOpen] = useState(false);
  const [activeBrand, setActiveBrand]       = useState("");
  const [contentDir, setContentDir]         = useState(1);

  const scrollRef   = useRef<HTMLDivElement>(null);
  const navigateRef = useRef<((idx: number) => void) | null>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll({ target: scrollRef });
  const videoScale   = useTransform(scrollYProgress, [0.5, 1], [0.9, 1.25]);
  const videoOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);
  const heroOpacity  = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  // ── Three.js shader transition ──
  useEffect(() => {
    let renderer: THREE.WebGLRenderer;
    let shaderMat: THREE.ShaderMaterial;
    let textures: THREE.Texture[] = [];
    let currentIdx = initialFloorRef.current;

    const init = async () => {
      if (!canvasRef.current) return;

      const scene  = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: false });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const vs = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
      const fs = `
        uniform sampler2D uT1, uT2;
        uniform float uP, uD;
        uniform vec2 uRes, uS1, uS2;
        varying vec2 vUv;
        vec2 getUV(vec2 uv, vec2 res, vec2 tex) {
          vec2 s = res / tex; float sc = max(s.x, s.y);
          vec2 sz = tex * sc; vec2 o = (res - sz) * 0.5;
          return (uv * res - o) / sz;
        }
        void main() {
          float sh = uP * uD;
          vec2 uv1 = getUV(vUv, uRes, uS1);
          vec2 uv2 = getUV(vUv, uRes, uS2);
          uv1.y -= sh * 0.5; uv2.y -= (sh - uD) * 0.5;
          float m = smoothstep(0., 0.05, (uD > 0. ? vUv.y : 1. - vUv.y) - (1. - uP));
          vec4 c1 = texture2D(uT1, uv1); vec4 c2 = texture2D(uT2, uv2);
          float sep = smoothstep(0.01, 0., abs((uD > 0. ? vUv.y : 1. - vUv.y) - (1. - uP)));
          gl_FragColor = mix(c1, c2, m) * (1. - sep * 0.8);
        }
      `;

      shaderMat = new THREE.ShaderMaterial({
        uniforms: {
          uT1: { value: new THREE.Texture() }, uT2: { value: new THREE.Texture() },
          uP: { value: 0 }, uD: { value: 1 },
          uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uS1: { value: new THREE.Vector2(1, 1) }, uS2: { value: new THREE.Vector2(1, 1) },
        },
        vertexShader: vs, fragmentShader: fs,
      });

      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMat));

      const loader = new THREE.TextureLoader();
      const loadTex = (url: string) => new Promise<THREE.Texture>(res => {
        loader.load(url, t => {
          t.minFilter = THREE.LinearFilter;
          t.userData.size = new THREE.Vector2(t.image.width, t.image.height);
          res(t);
        }, undefined, () => {
          const dummy = new THREE.DataTexture(new Uint8Array([10, 10, 10, 255]), 1, 1, THREE.RGBAFormat);
          dummy.userData.size = new THREE.Vector2(1, 1);
          res(dummy);
        });
      });

      textures = await Promise.all(floorContent.map(f => loadTex(f.media)));
      shaderMat.uniforms.uT1.value = textures[currentIdx];
      shaderMat.uniforms.uS1.value = textures[currentIdx].userData.size;

      const animate = () => { if (!renderer) return; requestAnimationFrame(animate); renderer.render(scene, camera); };
      animate();

      navigateRef.current = (idx: number) => {
        if (idx === currentIdx) return;
        setIsLiftMoving(true);
        const dr = idx > currentIdx ? 1 : -1;
        setContentDir(dr);
        shaderMat.uniforms.uT1.value = textures[currentIdx];
        shaderMat.uniforms.uT2.value = textures[idx];
        shaderMat.uniforms.uS1.value = textures[currentIdx].userData.size;
        shaderMat.uniforms.uS2.value = textures[idx].userData.size;
        shaderMat.uniforms.uD.value  = dr;
        setCurrentSlide(idx);
        currentIdx = idx;
        gsap.fromTo(shaderMat.uniforms.uP, { value: 0 }, {
          value: 1, duration: 2.5, ease: "power2.inOut",
          onComplete: () => {
            shaderMat.uniforms.uP.value  = 0;
            shaderMat.uniforms.uT1.value = textures[idx];
            shaderMat.uniforms.uS1.value = textures[idx].userData.size;
            setIsLiftMoving(false);
          },
        });
      };

      window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        shaderMat.uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
      });
    };

    init();
    return () => { if (renderer) renderer.dispose(); };
  }, []);

  const changeFloor     = (f: number) => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('floor', String(f));
      window.history.replaceState(null, '', url);
    }
    if (navigateRef.current) navigateRef.current(f);
  };
  const handleEnterStore = (name: string) => { setActiveBrand(name); setIsBrandStoreOpen(true); };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black text-white">
      <Navbar active={currentSlide === 0} />
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Compact floor indicator */}
      <div className="absolute left-6 bottom-6 md:left-10 md:bottom-10 z-[70] pointer-events-none">
        <div className="flex items-center gap-4 rounded-full border border-white/10 bg-black/45 px-5 py-3 backdrop-blur-2xl shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
          <div className="h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_rgba(212,175,55,0.65)]" />
          <div className="flex flex-col leading-none">
            <span className="font-mono text-[8px] tracking-[0.45em] text-accent uppercase">Axis Phase 0{currentSlide}</span>
            <span className="mt-1 max-w-[180px] truncate font-mono text-[8px] tracking-[0.25em] text-white/35 uppercase">
              {floorContent[currentSlide].title}
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable content area */}
      <div ref={scrollRef} className="absolute inset-0 z-10 overflow-y-auto scrollbar-hide snap-y snap-mandatory scroll-smooth">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 100 * contentDir }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -100 * contentDir }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {/* ── FLOOR 0: Lumina Grand ── */}
            {currentSlide === 0 && (
              <div className="w-full min-h-[200vh]">
                <section className="h-screen w-full flex flex-col items-center justify-center snap-start relative">
                  <motion.div style={{ opacity: heroOpacity }} className="text-center px-20">
                    <h1 className="font-display italic text-[12vw] leading-none mb-12 tracking-tighter">Lumina Grand</h1>
                    <p className="text-white/40 max-w-2xl text-xl tracking-[0.5em] uppercase mx-auto mb-16">Neo Metropolis Gateway</p>
                    <button
                      onClick={() => changeFloor(1)}
                      className="px-16 py-6 border border-white/20 bg-white/5 backdrop-blur-xl text-white font-mono text-xs tracking-[1em] uppercase hover:bg-accent hover:text-black transition-all duration-500 shadow-2xl"
                    >
                      Initiate Axis
                    </button>
                  </motion.div>
                </section>
                <section className="h-screen w-full flex items-center justify-center snap-start relative overflow-hidden bg-gradient-to-b from-transparent to-black/80">
                  <motion.div style={{ scale: videoScale, opacity: videoOpacity }} className="w-full h-full relative flex items-center justify-center">
                    <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover brightness-[0.3]" src="https://assets.mixkit.co/videos/preview/mixkit-flying-over-a-futuristic-city-at-night-42862-large.mp4" />
                    <div className="relative z-10 text-center p-20">
                      <span className="font-mono text-accent text-xs tracking-[2em] uppercase mb-12 block">Genesis</span>
                      <h2 className="font-display text-[8vw] italic leading-tight text-white tracking-tighter max-w-6xl">A Vision Built Between Dimensions.</h2>
                      <p className="text-white/30 font-mono tracking-[0.6em] uppercase text-xs mt-12">Heartbeat of Neo Metropolis.</p>
                    </div>
                  </motion.div>
                </section>
              </div>
            )}

            {/* ── FLOOR 1: Couture Collective — Hover-Reveal Brand Menu ── */}
            {currentSlide === 1 && (
              <FashionFloorSystem onEnterStore={handleEnterStore} />
            )}

            {/* ── FLOOR 3: Arcade Nexus — Card & Games System ── */}
            {currentSlide === 3 && (
              <ArcadeNexusSystem />
            )}

            {/* ── FLOORS 2, 4, 5: Other floors ── */}
            {currentSlide === 4 && (
              <FoodCourtSystem />
            )}

            {currentSlide === 5 && (
              <LoungeBookingSystem />
            )}

            {currentSlide === 2 && (
              <CinemaFloorSystem onBook={() => setIsBookingOpen(true)} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <ElevatorPanel currentFloor={currentSlide} onFloorChange={changeFloor} isTransitioning={isLiftMoving} />
      <CinemaBookingSystem isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <BrandStoreModal isOpen={isBrandStoreOpen} onClose={() => setIsBrandStoreOpen(false)} brandName={activeBrand} />
    </main>
  );
}
