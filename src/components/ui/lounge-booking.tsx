import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Check, ChevronRight, Clock, CreditCard, Heart, Mail, Music, Phone, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type EventType = 'Party' | 'Wedding' | 'Family Function' | 'Ceremony';

interface Lounge {
  id: string;
  name: string;
  capacity: string;
  price: number;
  idealFor: EventType[];
  image: string;
  features: string[];
}

const LOUNGES: Lounge[] = [
  {
    id: 'aurora-hall',
    name: 'Aurora Grand Hall',
    capacity: '120-250 guests',
    price: 95000,
    idealFor: ['Wedding', 'Ceremony'],
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&q=80',
    features: ['Stage lighting', 'Mandap setup', 'Banquet dining', 'Valet desk'],
  },
  {
    id: 'velvet-lounge',
    name: 'Velvet Sky Lounge',
    capacity: '40-90 guests',
    price: 42000,
    idealFor: ['Party', 'Family Function'],
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1000&q=80',
    features: ['DJ console', 'Private buffet', 'Mocktail bar', 'Photo wall'],
  },
  {
    id: 'lotus-suite',
    name: 'Lotus Family Suite',
    capacity: '25-70 guests',
    price: 28000,
    idealFor: ['Family Function', 'Ceremony'],
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1000&q=80',
    features: ['Pooja zone', 'Kids corner', 'Family dining', 'Live counter'],
  },
];

const eventTypes: EventType[] = ['Party', 'Wedding', 'Family Function', 'Ceremony'];
const timeSlots = ['10:00 AM', '1:00 PM', '5:00 PM', '8:00 PM'];

export function LoungeBookingSystem() {
  const [eventType, setEventType] = useState<EventType>('Wedding');
  const [selectedLoungeId, setSelectedLoungeId] = useState(LOUNGES[0].id);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(timeSlots[2]);
  const [guestCount, setGuestCount] = useState(120);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const selectedLounge = useMemo(
    () => LOUNGES.find(lounge => lounge.id === selectedLoungeId) || LOUNGES[0],
    [selectedLoungeId],
  );

  const packageTotal = selectedLounge.price + Math.max(0, guestCount - 50) * 650;
  const canConfirm = Boolean(selectedDate && contactName.trim() && contactPhone.trim());

  const confirmBooking = () => {
    if (!canConfirm) return;
    setIsConfirmed(true);
  };

  return (
    <div className="relative w-full min-h-screen px-10 md:px-20 xl:px-32 py-28 flex items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/50 to-black pointer-events-none" />
      <div className="relative z-10 w-full grid grid-cols-1 xl:grid-cols-[0.92fr_1.08fr] gap-10">
        <section className="flex flex-col justify-between min-h-[72vh]">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-full border border-accent/30 flex items-center justify-center text-accent bg-black/35 backdrop-blur-xl">
                <Heart size={18} />
              </div>
              <span className="font-mono text-[9px] tracking-[0.7em] uppercase text-accent">Lounges - Level 05</span>
            </div>
            <h1 className="font-display italic text-[clamp(3.7rem,8vw,8.3rem)] leading-none tracking-tighter text-white mb-6">
              Sky Deck Lounge
            </h1>
            <p className="max-w-3xl text-white/45 font-mono text-[10px] md:text-xs tracking-[0.35em] uppercase leading-loose">
              Book premium lounge spaces for parties, weddings, family functions, and ceremonies.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            {LOUNGES.map(lounge => (
              <button
                key={lounge.id}
                onClick={() => setSelectedLoungeId(lounge.id)}
                className={cn(
                  'group text-left border bg-black/50 backdrop-blur-xl p-4 transition-all hover:-translate-y-1',
                  selectedLoungeId === lounge.id ? 'border-accent/60' : 'border-white/10 hover:border-white/25',
                )}
              >
                <div className="relative h-36 overflow-hidden mb-4 border border-white/10">
                  <img src={lounge.image} alt={lounge.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <span className="absolute bottom-3 left-3 font-mono text-[8px] tracking-[0.3em] uppercase text-accent">{lounge.capacity}</span>
                </div>
                <h3 className="font-display italic text-3xl text-white leading-none">{lounge.name}</h3>
                <p className="mt-3 font-mono text-[9px] tracking-[0.25em] uppercase text-white/35">
                  Starts Rs {lounge.price.toLocaleString('en-IN')}
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-black/60 border border-white/10 backdrop-blur-2xl p-6 md:p-8 min-h-[72vh]">
          <AnimatePresence mode="wait">
            {isConfirmed ? (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="h-full flex flex-col items-center justify-center text-center"
              >
                <div className="w-24 h-24 rounded-full border border-emerald-400/30 bg-emerald-400/10 flex items-center justify-center text-emerald-300 mb-8">
                  <Check size={44} />
                </div>
                <h2 className="font-display italic text-6xl text-white leading-none mb-5">Booking Requested</h2>
                <p className="max-w-lg text-white/45 font-mono text-[10px] tracking-[0.35em] uppercase leading-loose">
                  {selectedLounge.name} is reserved for review on {selectedDate} at {selectedTime}. The events team will contact {contactName}.
                </p>
                <button
                  onClick={() => setIsConfirmed(false)}
                  className="mt-10 px-10 py-4 rounded-full bg-white text-black hover:bg-accent transition-all font-mono text-[9px] tracking-[0.45em] uppercase"
                >
                  Edit Booking
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                className="h-full grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8"
              >
                <div className="flex flex-col">
                  <div className="relative h-64 overflow-hidden border border-white/10 mb-6">
                    <img src={selectedLounge.image} alt={selectedLounge.name} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5">
                      <h2 className="font-display italic text-5xl text-white leading-none">{selectedLounge.name}</h2>
                      <p className="mt-3 font-mono text-[9px] tracking-[0.3em] uppercase text-white/55">{selectedLounge.capacity}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedLounge.features.map(feature => (
                      <div key={feature} className="border border-white/10 bg-white/[0.03] p-4">
                        <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/55">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-7">
                  <div className="space-y-6">
                    <div>
                      <label className="block font-mono text-[9px] tracking-[0.4em] uppercase text-white/35 mb-3">Event Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        {eventTypes.map(type => (
                          <button
                            key={type}
                            onClick={() => setEventType(type)}
                            className={cn(
                              'px-4 py-3 border font-mono text-[9px] tracking-[0.25em] uppercase transition-all',
                              eventType === type ? 'bg-accent border-accent text-black' : 'bg-white/[0.03] border-white/10 text-white/45 hover:text-white',
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="block">
                        <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.35em] uppercase text-white/35 mb-3"><CalendarDays size={13} /> Date</span>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={event => setSelectedDate(event.target.value)}
                          className="w-full bg-white/[0.04] border border-white/10 px-4 py-4 text-white font-mono text-sm outline-none focus:border-accent"
                        />
                      </label>
                      <label className="block">
                        <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.35em] uppercase text-white/35 mb-3"><Clock size={13} /> Time</span>
                        <select
                          value={selectedTime}
                          onChange={event => setSelectedTime(event.target.value)}
                          className="w-full bg-black border border-white/10 px-4 py-4 text-white font-mono text-sm outline-none focus:border-accent"
                        >
                          {timeSlots.map(slot => <option key={slot}>{slot}</option>)}
                        </select>
                      </label>
                    </div>

                    <label className="block">
                      <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.35em] uppercase text-white/35 mb-3"><Users size={13} /> Guests</span>
                      <input
                        type="range"
                        min={20}
                        max={300}
                        step={10}
                        value={guestCount}
                        onChange={event => setGuestCount(Number(event.target.value))}
                        className="w-full accent-[#d4af37]"
                      />
                      <div className="mt-2 flex justify-between font-mono text-[9px] tracking-[0.25em] uppercase text-white/35">
                        <span>{guestCount} Guests</span>
                        <span>Rs {packageTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="block md:col-span-2">
                        <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-white/35 mb-3 block">Contact Name</span>
                        <input value={contactName} onChange={event => setContactName(event.target.value)} className="w-full bg-white/[0.04] border border-white/10 px-4 py-4 text-white outline-none focus:border-accent" />
                      </label>
                      <label className="block">
                        <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.35em] uppercase text-white/35 mb-3"><Phone size={13} /> Phone</span>
                        <input value={contactPhone} onChange={event => setContactPhone(event.target.value)} className="w-full bg-white/[0.04] border border-white/10 px-4 py-4 text-white outline-none focus:border-accent" />
                      </label>
                      <label className="block">
                        <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.35em] uppercase text-white/35 mb-3"><Mail size={13} /> Email</span>
                        <input value={contactEmail} onChange={event => setContactEmail(event.target.value)} className="w-full bg-white/[0.04] border border-white/10 px-4 py-4 text-white outline-none focus:border-accent" />
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 flex items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <Music className="text-accent" size={20} />
                      <div>
                        <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-white/35">{eventType} Package</p>
                        <p className="font-mono text-xl text-white">Rs {packageTotal.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <button
                      onClick={confirmBooking}
                      disabled={!canConfirm}
                      className={cn(
                        'px-7 py-4 rounded-full font-mono text-[9px] tracking-[0.35em] uppercase flex items-center gap-3 transition-all',
                        canConfirm ? 'bg-white text-black hover:bg-accent' : 'bg-white/10 text-white/25 cursor-not-allowed',
                      )}
                    >
                      <CreditCard size={15} />
                      Request
                      <ChevronRight size={15} />
                    </button>
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
