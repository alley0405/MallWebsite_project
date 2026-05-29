import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, CreditCard, ChevronLeft, Check, Sparkles, ShoppingCart, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: 'Apparel' | 'Footwear';
  image: string;
  description: string;
  sizes: string[];
}

const BRAND_PRODUCTS: Record<string, Product[]> = {
  "H&M": [
    {
      id: "hm-s1",
      name: "Canvas Slip-on Sneakers",
      price: 29,
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&q=80",
      description: "Lightweight canvas slip-on sneakers with elasticated side panels and vulcanized rubber soles.",
      sizes: ["8", "9", "10", "11"]
    },
    {
      id: "hm-s2",
      name: "Faux Leather Chelsea Boots",
      price: 49,
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80",
      description: "Classic Chelsea boots in soft faux leather with elastic side panels and loops at the back.",
      sizes: ["8", "9", "10", "11"]
    },
    {
      id: "hm-s3",
      name: "Retro Running Shoes",
      price: 39,
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1512374382149-4332c6c02150?w=600&q=80",
      description: "Running shoes in mesh and imitation suede with reflective details and patterned chunky soles.",
      sizes: ["7", "8", "9", "10", "11"]
    },
    {
      id: "hm-a1",
      name: "Relaxed Fit Cotton T-Shirt",
      price: 15,
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80",
      description: "Classic T-shirt in soft, medium-weight cotton jersey with a rib-trimmed crew neck.",
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: "hm-a2",
      name: "Slim Fit Linen-blend Blazer",
      price: 79,
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
      description: "Single-breasted jacket in woven linen-cotton blend. Regular fit with narrow notch lapels.",
      sizes: ["S", "M", "L", "XL"]
    }
  ],
  "ZARA": [
    {
      id: "zara-s1",
      name: "Chunky Sole Leather Sneakers",
      price: 89,
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80",
      description: "High-quality leather trainers featuring a chunky, lightweight futuristic sole with memory foam insole.",
      sizes: ["8", "9", "10", "11"]
    },
    {
      id: "zara-s2",
      name: "Minimalist Suede Loafers",
      price: 119,
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80",
      description: "Italian-styled suede leather loafers with exposed seam detailing and lightweight non-slip rubber soles.",
      sizes: ["8", "9", "10", "11"]
    },
    {
      id: "zara-s3",
      name: "Retro High-Top Trainers",
      price: 79,
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80",
      description: "High-top sneakers with retro styling. Synthetic leather panels, perforated toe, and vulcanized flat sole.",
      sizes: ["7", "8", "9", "10", "11"]
    },
    {
      id: "zara-a1",
      name: "Oversized Wool Blend Coat",
      price: 169,
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80",
      description: "Double-breasted coat made of premium wool blend fabric. Peak lapel and long sleeves with button cuffs.",
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: "zara-a2",
      name: "Structured Textured Shirt",
      price: 49,
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80",
      description: "Relaxed fit shirt made of structured breathable fabric. Spread collar and adjustable buttoned cuffs.",
      sizes: ["S", "M", "L", "XL"]
    }
  ],
  "TOMMY HILFIGER": [
    {
      id: "tommy-s1",
      name: "Essential Leather Sneakers",
      price: 120,
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&q=80",
      description: "Iconic flat trainers with pure leather construction and classic TH flag emblem on the sides.",
      sizes: ["8", "9", "10", "11"]
    },
    {
      id: "tommy-s2",
      name: "Corporate Suede Loafers",
      price: 140,
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1614252329312-478a9722a36d?w=600&q=80",
      description: "Elegant suede slip-on shoes with signature corporate stripe details across the upper saddle.",
      sizes: ["8", "9", "10", "11"]
    },
    {
      id: "tommy-s3",
      name: "Retro Court Trainers",
      price: 110,
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
      description: "Street-inspired tennis court shoes with padded collar, durable mesh lining, and signature colors.",
      sizes: ["7", "8", "9", "10", "11"]
    },
    {
      id: "tommy-a1",
      name: "Classic Fit Organic Polo",
      price: 90,
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80",
      description: "Premium organic cotton pique polo shirt. Custom heritage fit with embroidered chest flag.",
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: "tommy-a2",
      name: "Signature Harrington Jacket",
      price: 180,
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
      description: "Water-repellent classic Harrington bomber jacket featuring custom plaid inside lining and button collar.",
      sizes: ["S", "M", "L", "XL"]
    }
  ],
  "ADIDAS": [
    {
      id: "adidas-s1",
      name: "Adidas Ultraboost Light",
      price: 190,
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      description: "Experience epic energy with the lightest Ultraboost ever made. High-performance Primeknit upper with Boost mid-sole.",
      sizes: ["8", "9", "10", "11", "12"]
    },
    {
      id: "adidas-s2",
      name: "Adidas Samba OG Classic",
      price: 100,
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=600&q=80",
      description: "Born on the pitch, the Samba is a timeless icon of street style. Soft full-grain leather with suede T-toe detailing.",
      sizes: ["8", "9", "10", "11"]
    },
    {
      id: "adidas-s3",
      name: "Adidas Forum Low Shoes",
      price: 110,
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
      description: "The classic 80s basketball sneaker returned with an adjustable ankle strap and signature leather upper panel.",
      sizes: ["7", "8", "9", "10", "11"]
    },
    {
      id: "adidas-a1",
      name: "Adicolor Classics Hoodie",
      price: 80,
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
      description: "Cozy fleece hoodie featuring the iconic Trefoil logo print and 3-stripes sleeve trim.",
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: "adidas-a2",
      name: "Tiro Track Jacket",
      price: 75,
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
      description: "Classic pitch style ready for the street. Moisture-absorbing Aeroready fabric with recycled content.",
      sizes: ["S", "M", "L", "XL"]
    }
  ],
  "LOUIS PHILIPPE": [
    {
      id: "lp-s1",
      name: "Premium Leather Oxfords",
      price: 180,
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
      description: "Exquisite hand-finished Italian leather Oxford shoes. Elegant closed lacing system and fine stacked heel.",
      sizes: ["8", "9", "10", "11"]
    },
    {
      id: "lp-s2",
      name: "Elegance Wingtip Brogues",
      price: 200,
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=600&q=80",
      description: "Finely detailed full brogue shoes featuring traditional wingtip punching on high-grade calfskin leather.",
      sizes: ["8", "9", "10", "11"]
    },
    {
      id: "lp-s3",
      name: "Classic Leather Chelsea Boots",
      price: 220,
      category: "Footwear",
      image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&q=80",
      description: "Timeless Chelsea boots crafted with a premium leather upper, elasticated sides, and durable leather welt.",
      sizes: ["8", "9", "10", "11"]
    },
    {
      id: "lp-a1",
      name: "Presidential French Cuff Shirt",
      price: 110,
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
      description: "Luxurious Egyptian cotton dress shirt. Immaculate stiff French cuffs and elegant cutaway collar.",
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: "lp-a2",
      name: "Sartorial Wool Blend Suit",
      price: 450,
      category: "Apparel",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
      description: "Exquisitely tailored slim fit 2-piece suit. Made of premium superfine wool blend with elegant lapels.",
      sizes: ["S", "M", "L", "XL"]
    }
  ]
};

export function BrandStoreModal({ isOpen, onClose, brandName }: BrandStoreModalProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Apparel' | 'Footwear'>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("Matte Black");
  const [cart, setCart] = useState<{ product: Product; size: string; color: string; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'shopping' | 'pay' | 'success'>('shopping');

  const products = BRAND_PRODUCTS[brandName] || [];
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const colors = ["Matte Black", "Pure White", "Slate Grey", "Accent Gold"];

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }

    const existingIndex = cart.findIndex(
      item => item.product.id === selectedProduct.id && 
              item.size === selectedSize && 
              item.color === selectedColor
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { product: selectedProduct, size: selectedSize, color: selectedColor, quantity: 1 }]);
    }

    // Reset size/product select
    setSelectedProduct(null);
    setSelectedSize("");
    setIsCartOpen(true);
  };

  const handleQuantity = (index: number, delta: number) => {
    const updated = [...cart];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1);
    }
    setCart(updated);
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handlePurchase = () => {
    setCheckoutStep('success');
  };

  const resetAll = () => {
    setCart([]);
    setIsCartOpen(false);
    setSelectedProduct(null);
    setCheckoutStep('shopping');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 30, opacity: 0 }}
            className="w-full max-w-7xl h-full max-h-[85vh] bg-[#070707] border border-white/10 rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-[0_0_120px_rgba(212,175,55,0.15)] relative"
          >
            {/* CLOSE BUTTON */}
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all z-[110]"
            >
              <X className="text-white/50 w-5 h-5" />
            </button>

            {/* LEFT SIDE - BRAND PANEL */}
            <div className="w-full md:w-1/4 border-r border-white/5 p-10 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-white/[0.01] to-transparent">
              <div className="absolute inset-0 opacity-10 filter grayscale blur-2xl bg-cover bg-center" style={{ backgroundImage: `url(${products[0]?.image})` }}></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full animate-ping"></div>
                  <span className="font-mono text-accent text-[9px] tracking-[0.8em] uppercase font-bold">Lumina Couture</span>
                </div>
                <h2 className="text-white font-display text-5xl italic mt-6 tracking-tighter leading-none">{brandName}</h2>
                <p className="text-white/40 text-xs mt-6 leading-relaxed max-w-xs font-sans tracking-wide">
                  Explore custom, premium-designed apparel and luxury footwear selections curated explicitly for {brandName} at Lumina Grand Couture.
                </p>
              </div>

              {/* MINI CART SECTION */}
              <div className="relative z-10 mt-10 pt-10 border-t border-white/5">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <ShoppingBag className="text-accent w-5 h-5" />
                    <span className="text-white font-mono text-[10px] tracking-widest uppercase">My Cart ({cart.length})</span>
                  </div>
                  {cart.length > 0 && (
                    <button onClick={() => setIsCartOpen(true)} className="text-accent hover:underline font-mono text-[9px] uppercase tracking-widest">Open</button>
                  )}
                </div>
                {cart.length > 0 ? (
                  <div>
                    <p className="text-white text-2xl font-bold font-mono">${totalPrice}</p>
                    <button 
                      onClick={() => {
                        setIsCartOpen(true);
                        setCheckoutStep('pay');
                      }}
                      className="w-full mt-6 py-4 bg-white text-black font-mono text-[9px] tracking-[0.4em] uppercase hover:bg-accent transition-all duration-300 rounded-full"
                    >
                      Checkout Now
                    </button>
                  </div>
                ) : (
                  <p className="text-white/20 font-mono text-[9px] tracking-widest uppercase">Cart is Empty</p>
                )}
              </div>
            </div>

            {/* RIGHT SIDE - PRODUCTS AND DETAILS */}
            <div className="flex-1 p-12 overflow-y-auto scrollbar-hide flex flex-col justify-between relative bg-black/40">
              <AnimatePresence mode="wait">
                {checkoutStep === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex-1 flex flex-col items-center justify-center text-center p-10"
                  >
                    <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-8 animate-pulse shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                      <Check size={48} />
                    </div>
                    <h3 className="text-white font-display text-5xl italic mb-4 tracking-tighter">Order Confirmed</h3>
                    <p className="text-accent font-mono text-[9px] tracking-[0.6em] uppercase mb-10">Lumina Secure Ledger Ledger-0X9A2</p>
                    
                    <div className="w-full max-w-md bg-white/[0.02] border border-white/5 rounded-[30px] p-8 text-left backdrop-blur-md mb-10">
                      <div className="border-b border-white/5 pb-4 mb-6">
                        <span className="text-white/30 font-mono text-[8px] tracking-widest uppercase block mb-1">Receipt for</span>
                        <span className="text-white font-display text-2xl italic leading-none">{brandName} Collection</span>
                      </div>
                      
                      <div className="flex flex-col gap-4 max-h-[160px] overflow-y-auto pr-2 scrollbar-hide">
                        {cart.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs font-mono">
                            <div className="flex flex-col">
                              <span className="text-white">{item.product.name}</span>
                              <span className="text-white/40 text-[9px]">Sz: {item.size} | {item.color}</span>
                            </div>
                            <span className="text-accent">${item.product.price} × {item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="w-full h-[1px] bg-white/5 my-6"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/40 font-mono text-[9px] tracking-widest uppercase">Transaction Total</span>
                        <span className="text-white font-mono text-xl font-bold">${totalPrice}</span>
                      </div>
                    </div>

                    <button 
                      onClick={resetAll}
                      className="px-12 py-5 bg-white text-black font-mono text-[10px] tracking-[0.5em] uppercase hover:bg-accent transition-all duration-300 rounded-full"
                    >
                      Return to Couture
                    </button>
                  </motion.div>
                ) : checkoutStep === 'pay' ? (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div className="max-w-xl mx-auto w-full pt-10 text-center">
                      <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mx-auto mb-6">
                        <CreditCard size={28} />
                      </div>
                      <h3 className="text-3xl italic font-display text-white mb-4 tracking-tighter">Secure Checkout</h3>
                      <p className="text-white/40 font-mono text-[9px] tracking-[0.5em] uppercase mb-12">Lumina Financial Hub 01X</p>

                      <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 text-left mb-8 shadow-2xl">
                        <div className="flex justify-between text-xs font-mono uppercase text-white/50 mb-4"><span>Subtotal</span><span>${totalPrice}</span></div>
                        <div className="flex justify-between text-xs font-mono uppercase text-white/50 mb-4"><span>Axis Delivery</span><span className="text-emerald-400">FREE</span></div>
                        <div className="w-full h-[1px] bg-white/10 mb-6"></div>
                        <div className="flex justify-between text-lg font-mono uppercase text-white font-bold"><span>Total Bill</span><span>${totalPrice}</span></div>
                      </div>

                      <button 
                        onClick={handlePurchase}
                        className="w-full py-6 bg-accent text-black font-mono text-[10px] tracking-[0.6em] uppercase hover:bg-white transition-all duration-500 rounded-full font-bold shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                      >
                        Authorize & Purchase
                      </button>
                    </div>

                    <div className="flex justify-start pt-10">
                      <button 
                        onClick={() => setCheckoutStep('shopping')}
                        className="flex items-center gap-3 text-white/40 hover:text-white transition-colors"
                      >
                        <ChevronLeft size={18} />
                        <span className="font-mono text-[9px] uppercase tracking-widest">Back to Products</span>
                      </button>
                    </div>
                  </motion.div>
                ) : selectedProduct ? (
                  /* PRODUCT DETAIL VIEW */
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col md:flex-row gap-10 items-center justify-center p-4"
                  >
                    <div className="w-full md:w-1/2 flex justify-center">
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name} 
                        className="rounded-[30px] border border-white/10 w-full max-h-[350px] object-cover shadow-[0_0_50px_rgba(0,0,0,0.5)]" 
                      />
                    </div>
                    
                    <div className="w-full md:w-1/2 text-left">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={cn(
                          "px-4 py-1.5 rounded-full font-mono text-[8px] tracking-widest uppercase border",
                          selectedProduct.category === 'Footwear' 
                            ? "bg-accent/10 border-accent/30 text-accent" 
                            : "bg-white/10 border-white/25 text-white"
                        )}>
                          {selectedProduct.category}
                        </span>
                      </div>
                      <h3 className="text-white font-display text-4xl italic tracking-tighter leading-tight mb-4">{selectedProduct.name}</h3>
                      <p className="text-white/40 text-xs font-mono leading-relaxed mb-6">{selectedProduct.description}</p>
                      
                      <div className="text-2xl font-bold font-mono text-white mb-8">${selectedProduct.price}</div>

                      {/* SIZES */}
                      <div className="mb-8">
                        <p className="text-white/30 font-mono text-[8px] tracking-widest uppercase mb-3">Select Size</p>
                        <div className="flex gap-3 flex-wrap">
                          {selectedProduct.sizes.map(size => (
                            <button 
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={cn(
                                "w-10 h-10 rounded-xl font-mono text-xs flex items-center justify-center border transition-all duration-300",
                                selectedSize === size 
                                  ? "bg-accent border-accent text-black scale-105" 
                                  : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
                              )}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* COLORS */}
                      <div className="mb-10">
                        <p className="text-white/30 font-mono text-[8px] tracking-widest uppercase mb-3">Color Accent</p>
                        <div className="flex gap-3">
                          {colors.map(color => (
                            <button 
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={cn(
                                "px-4 py-2 rounded-xl font-mono text-[9px] tracking-wider border transition-all duration-300",
                                selectedColor === color 
                                  ? "bg-white/10 border-white/30 text-white" 
                                  : "bg-transparent border-white/5 text-white/35 hover:bg-white/5"
                              )}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button 
                          onClick={handleAddToCart}
                          disabled={!selectedSize}
                          className={cn(
                            "flex-1 py-5 font-mono text-[9px] tracking-[0.5em] uppercase transition-all duration-300 rounded-full flex items-center justify-center gap-3",
                            selectedSize 
                              ? "bg-white text-black hover:bg-accent" 
                              : "bg-white/10 border border-white/5 text-white/20 cursor-not-allowed"
                          )}
                        >
                          <ShoppingCart size={14} /> Add To Cart
                        </button>
                        <button 
                          onClick={() => setSelectedProduct(null)}
                          className="px-8 py-5 border border-white/10 rounded-full font-mono text-[9px] tracking-widest uppercase text-white/50 hover:text-white hover:bg-white/5 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* PRODUCT LIST VIEW */
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    <div>
                      {/* HEADER CATEGORY NAVIGATION */}
                      <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-8">
                        <div className="flex gap-4">
                          {(['All', 'Apparel', 'Footwear'] as const).map(cat => (
                            <button 
                              key={cat}
                              onClick={() => setActiveCategory(cat)}
                              className={cn(
                                "px-6 py-2.5 rounded-full font-mono text-[9px] tracking-[0.4em] uppercase border transition-all duration-300",
                                activeCategory === cat 
                                  ? "bg-white/10 border-white/25 text-white" 
                                  : "bg-transparent border-transparent text-white/40 hover:text-white/70"
                              )}
                            >
                              {cat === 'Footwear' ? 'Shoes' : cat}
                            </button>
                          ))}
                        </div>

                        <span className="font-mono text-[8px] tracking-widest text-white/30 uppercase">
                          {filteredProducts.length} Items Available
                        </span>
                      </div>

                      {/* PRODUCTS GRID */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                          <div 
                            key={product.id}
                            onClick={() => {
                              setSelectedProduct(product);
                              setSelectedSize("");
                            }}
                            className="group relative bg-white/[0.01] hover:bg-white/[0.04] border border-white/5 hover:border-accent/30 rounded-[30px] p-5 cursor-pointer transition-all duration-500 hover:-translate-y-1.5 shadow-xl overflow-hidden flex flex-col justify-between min-h-[340px]"
                          >
                            <div>
                              <div className="relative rounded-[20px] overflow-hidden aspect-[4/3] border border-white/5 mb-4">
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[8px] font-mono text-accent tracking-widest uppercase">
                                  {product.category}
                                </div>
                              </div>

                              <h4 className="text-white font-mono text-sm tracking-wide group-hover:text-accent transition-colors truncate">{product.name}</h4>
                              <p className="text-white/40 text-[10px] font-sans mt-2 line-clamp-2 leading-relaxed tracking-normal">{product.description}</p>
                            </div>

                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
                              <span className="text-white font-mono text-base font-bold">${product.price}</span>
                              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 group-hover:border-accent group-hover:text-accent group-hover:bg-accent/10 transition-all">
                                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CART SIDE DRAWER */}
            <AnimatePresence>
              {isCartOpen && (
                <motion.div 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="absolute inset-y-0 right-0 w-full md:w-2/5 bg-[#0a0a0a] border-l border-white/10 z-[120] p-10 flex flex-col justify-between shadow-[-20px_0_60px_rgba(0,0,0,0.8)]"
                >
                  <div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-6 mb-8">
                      <div className="flex items-center gap-3">
                        <ShoppingBag className="text-accent w-5 h-5" />
                        <h4 className="text-white font-display text-2xl italic tracking-tighter">Shopping Bag</h4>
                      </div>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                      >
                        <X className="text-white/40 w-4 h-4" />
                      </button>
                    </div>

                    {cart.length > 0 ? (
                      <div className="flex flex-col gap-6 max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide">
                        {cart.map((item, idx) => (
                          <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 items-center justify-between">
                            <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-xl border border-white/5" />
                            <div className="flex-1 text-left">
                              <p className="text-white font-mono text-xs uppercase tracking-wide truncate max-w-[150px]">{item.product.name}</p>
                              <p className="text-white/40 text-[9px] font-mono mt-1">Size: {item.size} | {item.color}</p>
                              <p className="text-accent text-[10px] font-mono mt-1 font-bold">${item.product.price}</p>
                            </div>
                            
                            <div className="flex items-center gap-3 border border-white/10 px-3 py-1.5 rounded-full">
                              <button onClick={() => handleQuantity(idx, -1)} className="text-white/40 hover:text-white text-sm">-</button>
                              <span className="text-white font-mono text-xs">{item.quantity}</span>
                              <button onClick={() => handleQuantity(idx, 1)} className="text-white/40 hover:text-white text-sm">+</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center">
                        <p className="text-white/20 font-mono text-xs tracking-widest uppercase">Bag is Empty</p>
                      </div>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t border-white/5 pt-8">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-white/40 font-mono text-[9px] tracking-widest uppercase">Subtotal</span>
                        <span className="text-white font-mono text-2xl font-bold">${totalPrice}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setIsCartOpen(false);
                          setCheckoutStep('pay');
                        }}
                        className="w-full py-5 bg-white text-black hover:bg-accent font-mono text-[10px] tracking-[0.5em] uppercase transition-all duration-300 rounded-full font-bold"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
