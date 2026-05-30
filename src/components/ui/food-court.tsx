import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Clock, MapPin, ShoppingBag, Star, Utensils, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type FoodCategory = 'All' | 'Burgers' | 'Pizza' | 'Desserts' | 'Cafe' | 'Indian' | 'Asian';

interface FoodBrand {
  id: string;
  name: string;
  category: Exclude<FoodCategory, 'All'>;
  tagline: string;
  level: string;
  rating: number;
  averageTime: string;
  image: string;
  menu: { name: string; price: number; note: string }[];
}

const FOOD_BRANDS: FoodBrand[] = [
  {
    id: 'burger-forge',
    name: 'Burger Forge',
    category: 'Burgers',
    tagline: 'Loaded grills, fries, shakes',
    level: 'F4 - Bay 01',
    rating: 4.7,
    averageTime: '12 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=80',
    menu: [
      { name: 'Forge Classic Burger', price: 249, note: 'Cheese, onion jam, house sauce' },
      { name: 'Crispy Paneer Stack', price: 219, note: 'Spiced paneer, lettuce, mint mayo' },
      { name: 'Loaded Fire Fries', price: 169, note: 'Cheese dust, jalapeno, chipotle dip' },
    ],
  },
  {
    id: 'slice-lab',
    name: 'Slice Lab',
    category: 'Pizza',
    tagline: 'Wood fired slices and calzones',
    level: 'F4 - Bay 02',
    rating: 4.6,
    averageTime: '15 min',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=900&q=80',
    menu: [
      { name: 'Margherita Burst', price: 299, note: 'Fresh basil, mozzarella, tomato' },
      { name: 'Peri Peri Veggie', price: 349, note: 'Corn, peppers, onion, spicy drizzle' },
      { name: 'Four Cheese Calzone', price: 279, note: 'Folded pizza pocket with herbed dip' },
    ],
  },
  {
    id: 'mithai-moon',
    name: 'Mithai Moon',
    category: 'Desserts',
    tagline: 'Sweets, sundaes, celebration boxes',
    level: 'F4 - Dessert Island',
    rating: 4.8,
    averageTime: '8 min',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&q=80',
    menu: [
      { name: 'Rabri Falooda', price: 189, note: 'Kulfi, rose syrup, basil seeds' },
      { name: 'Chocolate Gulab Jamun Sundae', price: 219, note: 'Hot jamun, brownie, vanilla scoop' },
      { name: 'Festival Mithai Box', price: 499, note: 'Assorted premium sweets' },
    ],
  },
  {
    id: 'brew-axis',
    name: 'Brew Axis',
    category: 'Cafe',
    tagline: 'Coffee, bakes, work pods',
    level: 'F4 - Bay 03',
    rating: 4.5,
    averageTime: '7 min',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=900&q=80',
    menu: [
      { name: 'Cold Brew Tonic', price: 199, note: 'Citrus, ice, slow steep coffee' },
      { name: 'Caramel Cappuccino', price: 179, note: 'Double shot with caramel foam' },
      { name: 'Almond Croissant', price: 149, note: 'Buttery pastry with almond cream' },
    ],
  },
  {
    id: 'tandoor-station',
    name: 'Tandoor Station',
    category: 'Indian',
    tagline: 'North Indian thalis and grills',
    level: 'F4 - Bay 04',
    rating: 4.7,
    averageTime: '18 min',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=900&q=80',
    menu: [
      { name: 'Royal Paneer Thali', price: 329, note: 'Paneer curry, dal, rice, naan' },
      { name: 'Tandoori Platter', price: 379, note: 'Seekh, tikka, chutneys, salad' },
      { name: 'Butter Naan Basket', price: 129, note: 'Four fresh breads from the tandoor' },
    ],
  },
  {
    id: 'wok-neon',
    name: 'Wok Neon',
    category: 'Asian',
    tagline: 'Noodles, dim sum, rice bowls',
    level: 'F4 - Bay 05',
    rating: 4.4,
    averageTime: '14 min',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=900&q=80',
    menu: [
      { name: 'Schezwan Noodle Bowl', price: 259, note: 'Noodles, vegetables, chili crisp' },
      { name: 'Crystal Veg Dim Sum', price: 229, note: 'Six steamed dumplings with dip' },
      { name: 'Teriyaki Rice Bowl', price: 289, note: 'Sticky rice, greens, sesame glaze' },
    ],
  },
];

const categories: FoodCategory[] = ['All', 'Burgers', 'Pizza', 'Desserts', 'Cafe', 'Indian', 'Asian'];

export function FoodCourtSystem() {
  const [activeCategory, setActiveCategory] = useState<FoodCategory>('All');
  const [selectedBrand, setSelectedBrand] = useState<FoodBrand | null>(FOOD_BRANDS[0]);
  const [cart, setCart] = useState<{ brand: string; item: string; price: number }[]>([]);

  const filteredBrands = useMemo(
    () => activeCategory === 'All' ? FOOD_BRANDS : FOOD_BRANDS.filter(brand => brand.category === activeCategory),
    [activeCategory],
  );

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="relative w-full min-h-screen px-10 md:px-20 xl:px-32 py-28 flex flex-col justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/55 to-black pointer-events-none" />
      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-10 items-stretch">
        <section className="min-h-[70vh] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full border border-accent/30 flex items-center justify-center text-accent bg-black/30 backdrop-blur-xl">
                <Utensils size={18} />
              </div>
              <span className="font-mono text-[9px] tracking-[0.7em] uppercase text-accent">Food Brands - Level 04</span>
            </div>
            <h1 className="font-display italic text-[clamp(3.8rem,8vw,8.5rem)] leading-none tracking-tighter text-white mb-6">Neon Food Court</h1>
            <p className="max-w-3xl text-white/45 font-mono text-[10px] md:text-xs tracking-[0.35em] uppercase leading-loose">
              Browse mall food brands, preview menus, and build a quick pickup order.
            </p>
          </div>

          <div className="mt-12">
            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    'px-5 py-3 rounded-full border font-mono text-[9px] tracking-[0.35em] uppercase transition-all',
                    activeCategory === category ? 'bg-accent text-black border-accent' : 'bg-white/5 text-white/45 border-white/10 hover:text-white hover:border-white/25',
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBrands.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrand(brand)}
                  className={cn(
                    'group text-left overflow-hidden border p-4 bg-black/45 backdrop-blur-xl transition-all hover:-translate-y-1',
                    selectedBrand?.id === brand.id ? 'border-accent/60 shadow-[0_0_35px_rgba(212,175,55,0.12)]' : 'border-white/10 hover:border-white/25',
                  )}
                >
                  <div className="flex gap-4">
                    <img src={brand.image} alt={brand.name} className="h-24 w-24 object-cover grayscale group-hover:grayscale-0 transition-all" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[8px] tracking-[0.35em] uppercase text-accent">{brand.category}</span>
                        <ArrowRight size={15} className="text-white/25 group-hover:text-accent transition-colors" />
                      </div>
                      <h3 className="mt-3 font-display italic text-3xl leading-none text-white tracking-tight">{brand.name}</h3>
                      <p className="mt-3 text-white/35 text-xs leading-relaxed">{brand.tagline}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black/55 backdrop-blur-2xl border border-white/10 p-6 md:p-8 min-h-[70vh] flex flex-col">
          <AnimatePresence mode="wait">
            {selectedBrand && (
              <motion.div key={selectedBrand.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} className="flex-1 flex flex-col">
                <div className="relative h-64 overflow-hidden border border-white/10">
                  <img src={selectedBrand.image} alt={selectedBrand.name} className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <h2 className="font-display italic text-5xl text-white leading-none tracking-tight">{selectedBrand.name}</h2>
                    <div className="mt-4 flex flex-wrap gap-4 font-mono text-[9px] tracking-[0.25em] uppercase text-white/60">
                      <span className="flex items-center gap-2"><Star size={13} className="text-accent" /> {selectedBrand.rating}</span>
                      <span className="flex items-center gap-2"><Clock size={13} className="text-accent" /> {selectedBrand.averageTime}</span>
                      <span className="flex items-center gap-2"><MapPin size={13} className="text-accent" /> {selectedBrand.level}</span>
                    </div>
                  </div>
                </div>

                <div className="py-7 flex-1">
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-[9px] tracking-[0.5em] uppercase text-white/35">Signature Menu</span>
                    <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-accent">Pickup Ready</span>
                  </div>
                  <div className="space-y-4">
                    {selectedBrand.menu.map(item => (
                      <button
                        key={item.name}
                        onClick={() => setCart(prev => [...prev, { brand: selectedBrand.name, item: item.name, price: item.price }])}
                        className="w-full text-left flex items-center justify-between gap-6 border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.07] hover:border-accent/30 transition-all"
                      >
                        <div>
                          <h3 className="font-mono text-sm tracking-wider uppercase text-white">{item.name}</h3>
                          <p className="mt-2 text-white/35 text-xs leading-relaxed">{item.note}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-accent text-lg">Rs {item.price}</span>
                          <span className="block mt-2 text-white/25 font-mono text-[8px] tracking-[0.35em] uppercase">Add</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <div className="flex items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                        <ShoppingBag size={18} />
                      </div>
                      <div>
                        <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-white/40">{cart.length} Items</p>
                        <p className="font-mono text-xl text-white">Rs {total}</p>
                      </div>
                    </div>
                    {cart.length > 0 && (
                      <button onClick={() => setCart([])} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                        <X size={14} />
                        <span className="font-mono text-[9px] tracking-[0.3em] uppercase">Clear</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
