import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, CreditCard, Film, Ticket, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CinemaBookingProps {
  isOpen: boolean;
  onClose: () => void;
}

type BookingStep = 'movie' | 'seats' | 'snacks' | 'checkout' | 'confirmed';

interface Movie {
  id: string;
  title: string;
  genre: string;
  format: string;
  duration: string;
  rating: string;
  image: string;
  times: string[];
  summary: string;
}

interface Snack {
  id: string;
  name: string;
  price: number;
  description: string;
}

const MOVIES: Movie[] = [
  {
    id: 'metropolis-rising',
    title: 'Metropolis Rising',
    genre: 'Sci-Fi',
    format: 'IMAX Laser',
    duration: '142 min',
    rating: 'U/A 13+',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=900&q=80',
    times: ['10:30 AM', '1:45 PM', '5:20 PM', '9:10 PM'],
    summary: 'A luminous city falls, rebuilds, and discovers the machine heart beneath its streets.',
  },
  {
    id: 'moonlit-vows',
    title: 'Moonlit Vows',
    genre: 'Romance',
    format: 'Dolby Atmos',
    duration: '128 min',
    rating: 'U/A',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=900&q=80',
    times: ['11:15 AM', '3:30 PM', '7:00 PM'],
    summary: 'A quiet love story set across one wedding night, one railway platform, and one old promise.',
  },
  {
    id: 'velocity-nine',
    title: 'Velocity Nine',
    genre: 'Action',
    format: '4DX',
    duration: '116 min',
    rating: 'U/A 16+',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900&q=80',
    times: ['12:05 PM', '4:25 PM', '8:40 PM', '11:15 PM'],
    summary: 'A racer, a stolen prototype, and a city-wide chase through rainlit expressways.',
  },
];

const SNACKS: Snack[] = [
  { id: 'popcorn', name: 'Truffle Popcorn Tub', price: 260, description: 'Large tub with smoked cheese dust.' },
  { id: 'soda', name: 'Twin Soda Combo', price: 220, description: 'Two chilled beverages with refill code.' },
  { id: 'nachos', name: 'Loaded Nachos', price: 240, description: 'Crisp chips, salsa, jalapenos, cheese.' },
  { id: 'brownie', name: 'Warm Brownie Box', price: 180, description: 'Two brownies with chocolate dip.' },
];

const TAKEN_SEATS = new Set([3, 4, 11, 18, 19, 28, 36, 37, 46, 54]);

const seatLabel = (id: number) => {
  const row = String.fromCharCode(65 + Math.floor(id / 10));
  return `${row}${(id % 10) + 1}`;
};

export function CinemaFloorSystem({ onBook }: { onBook: () => void }) {
  const featured = MOVIES[0];

  return (
    <div className="relative w-full min-h-screen px-10 md:px-20 xl:px-32 py-28 flex items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/55 to-black pointer-events-none" />
      <div className="relative z-10 w-full grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-10 items-stretch">
        <section className="min-h-[72vh] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full border border-accent/30 flex items-center justify-center text-accent bg-black/35 backdrop-blur-xl">
                <Film size={18} />
              </div>
              <span className="font-mono text-[9px] tracking-[0.7em] uppercase text-accent">Cinematic Hub - Level 02</span>
            </div>
            <h1 className="font-display italic text-[clamp(3.7rem,8vw,8.3rem)] leading-none tracking-tighter text-white mb-6">
              Cinematic Hub
            </h1>
            <p className="max-w-3xl text-white/45 font-mono text-[10px] md:text-xs tracking-[0.35em] uppercase leading-loose">
              Choose movies, seats, snacks, and confirm a cinema booking in one flow.
            </p>
          </div>

          <button
            onClick={onBook}
            className="mt-12 w-fit group flex items-center gap-6 bg-white text-black px-9 py-5 rounded-full hover:bg-accent transition-all font-mono text-[10px] tracking-[0.45em] uppercase"
          >
            Book Tickets
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 content-end">
          {MOVIES.map(movie => (
            <button
              key={movie.id}
              onClick={onBook}
              className={cn(
                'group text-left min-h-[430px] border border-white/10 bg-black/45 backdrop-blur-xl overflow-hidden transition-all hover:-translate-y-1 hover:border-accent/40',
                movie.id === featured.id && 'md:col-span-2',
              )}
            >
              <div className="relative h-72 overflow-hidden">
                <img src={movie.image} alt={movie.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="font-mono text-[8px] tracking-[0.35em] uppercase text-accent">{movie.format}</span>
                  <h2 className="mt-3 font-display italic text-4xl text-white leading-none">{movie.title}</h2>
                </div>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-4 font-mono text-[9px] tracking-[0.25em] uppercase text-white/45">
                  <span>{movie.genre}</span>
                  <span>{movie.duration}</span>
                  <span>{movie.rating}</span>
                </div>
                <p className="mt-4 text-white/40 text-xs leading-relaxed">{movie.summary}</p>
              </div>
            </button>
          ))}
        </section>
      </div>
    </div>
  );
}

export function CinemaBookingSystem({ isOpen, onClose }: CinemaBookingProps) {
  const [step, setStep] = useState<BookingStep>('movie');
  const [selectedMovieId, setSelectedMovieId] = useState(MOVIES[0].id);
  const [selectedTime, setSelectedTime] = useState(MOVIES[0].times[2]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [snackCart, setSnackCart] = useState<Record<string, number>>({});
  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');

  const selectedMovie = useMemo(
    () => MOVIES.find(movie => movie.id === selectedMovieId) || MOVIES[0],
    [selectedMovieId],
  );

  const snackTotal = SNACKS.reduce((sum, snack) => sum + snack.price * (snackCart[snack.id] || 0), 0);
  const seatTotal = selectedSeats.length * 320;
  const totalPrice = seatTotal + snackTotal;
  const canCheckout = selectedSeats.length > 0;
  const canConfirm = canCheckout && guestName.trim() && phone.trim();

  const selectMovie = (movie: Movie) => {
    setSelectedMovieId(movie.id);
    setSelectedTime(movie.times[0]);
    setSelectedSeats([]);
    setStep('seats');
  };

  const toggleSeat = (id: number) => {
    if (TAKEN_SEATS.has(id)) return;
    setSelectedSeats(prev => prev.includes(id) ? prev.filter(seat => seat !== id) : [...prev, id]);
  };

  const updateSnack = (id: string, delta: number) => {
    setSnackCart(prev => {
      const next = Math.max(0, (prev[id] || 0) + delta);
      return { ...prev, [id]: next };
    });
  };

  const resetAndClose = () => {
    setStep('movie');
    setSelectedSeats([]);
    setSnackCart({});
    setGuestName('');
    setPhone('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[220] flex items-center justify-center p-4 md:p-8 bg-black/92 backdrop-blur-3xl"
        >
          <motion.div
            initial={{ scale: 0.94, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 30, opacity: 0 }}
            className="w-full max-w-7xl h-full max-h-[88vh] bg-[#080808] border border-white/10 rounded-[36px] overflow-hidden grid grid-cols-1 lg:grid-cols-[360px_1fr] shadow-[0_0_110px_rgba(212,175,55,0.13)] relative"
          >
            <button onClick={resetAndClose} className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 z-30">
              <X className="text-white/50 w-5 h-5" />
            </button>

            <aside className="relative border-r border-white/10 p-8 flex flex-col justify-between overflow-hidden">
              <img src={selectedMovie.image} alt={selectedMovie.title} className="absolute inset-0 h-full w-full object-cover opacity-20 blur-sm scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/80 to-black" />
              <div className="relative z-10">
                <span className="font-mono text-accent text-[9px] tracking-[0.7em] uppercase">Now Booking</span>
                <h2 className="text-white font-display text-5xl italic mt-6 leading-none">{selectedMovie.title}</h2>
                <p className="text-white/40 text-xs mt-6 leading-relaxed">{selectedMovie.summary}</p>
                <div className="grid grid-cols-2 gap-3 mt-8">
                  {[selectedMovie.genre, selectedMovie.format, selectedMovie.duration, selectedMovie.rating].map(meta => (
                    <div key={meta} className="border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-[9px] tracking-[0.25em] uppercase text-white/55">
                      {meta}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative z-10 border-t border-white/10 pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-accent text-black flex items-center justify-center">
                    <Ticket size={20} />
                  </div>
                  <div>
                    <p className="text-white/45 text-[9px] font-mono tracking-[0.35em] uppercase">Total Bill</p>
                    <p className="text-white text-2xl font-mono">Rs {totalPrice.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </aside>

            <section className="p-6 md:p-10 overflow-y-auto scrollbar-hide">
              <div className="flex flex-wrap items-center gap-3 mb-9 pr-16">
                {(['movie', 'seats', 'snacks', 'checkout'] as const).map((name, index) => (
                  <button
                    key={name}
                    onClick={() => setStep(name)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2 rounded-full border font-mono text-[9px] tracking-[0.3em] uppercase transition-all',
                      step === name ? 'bg-accent text-black border-accent' : 'bg-white/[0.03] text-white/35 border-white/10 hover:text-white',
                    )}
                  >
                    {index + 1}
                    {name}
                  </button>
                ))}
              </div>

              {step === 'movie' && (
                <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {MOVIES.map(movie => (
                    <button key={movie.id} onClick={() => selectMovie(movie)} className="group text-left border border-white/10 bg-white/[0.03] hover:border-accent/40 transition-all overflow-hidden">
                      <div className="relative h-52 overflow-hidden">
                        <img src={movie.image} alt={movie.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                        <h3 className="absolute bottom-4 left-4 right-4 font-display italic text-3xl text-white leading-none">{movie.title}</h3>
                      </div>
                      <div className="p-5">
                        <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-accent">{movie.format}</p>
                        <p className="mt-3 text-white/40 text-xs leading-relaxed">{movie.summary}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}

              {step === 'seats' && (
                <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}>
                  <div className="flex flex-wrap gap-3 mb-8">
                    {selectedMovie.times.map(time => (
                      <button key={time} onClick={() => setSelectedTime(time)} className={cn('px-5 py-3 border font-mono text-[9px] tracking-[0.3em] uppercase transition-all', selectedTime === time ? 'bg-accent border-accent text-black' : 'bg-white/[0.03] border-white/10 text-white/45 hover:text-white')}>
                        {time}
                      </button>
                    ))}
                  </div>
                  <div className="mx-auto max-w-2xl">
                    <div className="h-8 rounded-[50%] border-t border-accent/60 bg-accent/10 blur-[1px] mb-10" />
                    <div className="grid grid-cols-10 gap-3">
                      {Array.from({ length: 60 }, (_, id) => (
                        <button
                          key={id}
                          onClick={() => toggleSeat(id)}
                          disabled={TAKEN_SEATS.has(id)}
                          className={cn(
                            'aspect-square rounded-md border font-mono text-[9px] transition-all',
                            TAKEN_SEATS.has(id) && 'bg-white/5 border-white/5 text-white/10 cursor-not-allowed',
                            !TAKEN_SEATS.has(id) && selectedSeats.includes(id) && 'bg-accent border-accent text-black scale-105',
                            !TAKEN_SEATS.has(id) && !selectedSeats.includes(id) && 'bg-white/[0.04] border-white/10 text-white/35 hover:text-white hover:border-white/30',
                          )}
                        >
                          {seatLabel(id)}
                        </button>
                      ))}
                    </div>
                    <div className="mt-8 flex justify-between items-center">
                      <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/35">{selectedSeats.length} seats selected</p>
                      <button disabled={!canCheckout} onClick={() => setStep('snacks')} className={cn('px-7 py-4 rounded-full font-mono text-[9px] tracking-[0.35em] uppercase transition-all', canCheckout ? 'bg-white text-black hover:bg-accent' : 'bg-white/10 text-white/25 cursor-not-allowed')}>
                        Add Snacks
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 'snacks' && (
                <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {SNACKS.map(snack => (
                    <div key={snack.id} className="border border-white/10 bg-white/[0.03] p-6 flex items-center justify-between gap-6">
                      <div>
                        <h3 className="font-mono text-sm uppercase tracking-wider text-white">{snack.name}</h3>
                        <p className="mt-2 text-white/35 text-xs">{snack.description}</p>
                        <p className="mt-4 font-mono text-accent">Rs {snack.price}</p>
                      </div>
                      <div className="flex items-center gap-3 border border-white/10 rounded-full px-3 py-2">
                        <button onClick={() => updateSnack(snack.id, -1)} className="text-white/45 hover:text-white">-</button>
                        <span className="font-mono text-white w-5 text-center">{snackCart[snack.id] || 0}</span>
                        <button onClick={() => updateSnack(snack.id, 1)} className="text-white/45 hover:text-white">+</button>
                      </div>
                    </div>
                  ))}
                  <div className="md:col-span-2 flex justify-end pt-4">
                    <button onClick={() => setStep('checkout')} className="px-7 py-4 rounded-full bg-white text-black hover:bg-accent font-mono text-[9px] tracking-[0.35em] uppercase transition-all">
                      Checkout
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'checkout' && (
                <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} className="max-w-xl mx-auto">
                  <div className="text-center mb-8">
                    <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                      <CreditCard size={28} />
                    </div>
                    <h3 className="font-display italic text-4xl text-white">Secure Cinema Checkout</h3>
                    <p className="mt-3 font-mono text-[9px] tracking-[0.35em] uppercase text-white/35">
                      {selectedMovie.title} - {selectedTime} - {selectedSeats.map(seatLabel).join(', ')}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <label className="block">
                      <span className="flex gap-2 items-center font-mono text-[9px] tracking-[0.35em] uppercase text-white/35 mb-3"><User size={13} /> Name</span>
                      <input value={guestName} onChange={event => setGuestName(event.target.value)} className="w-full bg-white/[0.04] border border-white/10 px-4 py-4 text-white outline-none focus:border-accent" />
                    </label>
                    <label className="block">
                      <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-white/35 mb-3 block">Phone</span>
                      <input value={phone} onChange={event => setPhone(event.target.value)} className="w-full bg-white/[0.04] border border-white/10 px-4 py-4 text-white outline-none focus:border-accent" />
                    </label>
                  </div>
                  <div className="mt-8 border border-white/10 bg-white/[0.03] p-6 space-y-3 font-mono text-sm">
                    <div className="flex justify-between text-white/50"><span>Tickets</span><span>Rs {seatTotal.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between text-white/50"><span>Snacks</span><span>Rs {snackTotal.toLocaleString('en-IN')}</span></div>
                    <div className="h-[1px] bg-white/10" />
                    <div className="flex justify-between text-white text-lg"><span>Total</span><span>Rs {totalPrice.toLocaleString('en-IN')}</span></div>
                  </div>
                  <button disabled={!canConfirm} onClick={() => setStep('confirmed')} className={cn('mt-8 w-full py-5 rounded-full font-mono text-[10px] tracking-[0.45em] uppercase transition-all', canConfirm ? 'bg-accent text-black hover:bg-white' : 'bg-white/10 text-white/25 cursor-not-allowed')}>
                    Confirm Booking
                  </button>
                </motion.div>
              )}

              {step === 'confirmed' && (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="h-full min-h-[500px] flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 flex items-center justify-center mb-8">
                    <Check size={44} />
                  </div>
                  <h3 className="font-display italic text-6xl text-white leading-none mb-5">Tickets Confirmed</h3>
                  <p className="max-w-xl text-white/45 font-mono text-[10px] tracking-[0.35em] uppercase leading-loose">
                    {guestName}, your {selectedMovie.title} booking for {selectedTime} is confirmed. Seats: {selectedSeats.map(seatLabel).join(', ')}.
                  </p>
                  <button onClick={resetAndClose} className="mt-10 px-10 py-4 rounded-full bg-white text-black hover:bg-accent transition-all font-mono text-[9px] tracking-[0.45em] uppercase">
                    Close
                  </button>
                </motion.div>
              )}
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
