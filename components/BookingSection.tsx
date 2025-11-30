'use client'

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NeonButton from './ui/NeonButton';
import { Calendar, Clock, User, Phone, ChevronRight, ChevronLeft, Trophy, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

// --- Schedule Configuration ---

type ScheduleItem = {
  jam: string;
  harga: number;
};

type ScheduleData = {
  [key: string]: ScheduleItem[];
};

type Booking = {
  bookingDate: string;
  timeSlot: string;
  status: string;
};

const RAW_SCHEDULE: ScheduleData = {
  "Senin_sd_Kamis": [
    { "jam": "06.00 - 08.00", "harga": 900000 },
    { "jam": "08.00 - 10.00", "harga": 900000 },
    { "jam": "10.00 - 12.00", "harga": 800000 },
    { "jam": "12.00 - 14.00", "harga": 800000 },
    { "jam": "14.00 - 16.00", "harga": 1100000 },
    { "jam": "16.00 - 18.00", "harga": 1100000 },
    { "jam": "18.00 - 20.00", "harga": 1100000 },
    { "jam": "20.00 - 22.00", "harga": 1100000 },
    { "jam": "22.00 - 24.00", "harga": 1000000 }
  ],
  "Jumat": [
    { "jam": "06.00 - 08.00", "harga": 900000 },
    { "jam": "08.00 - 10.00", "harga": 900000 },
    { "jam": "10.00 - 12.00", "harga": 700000 },
    { "jam": "12.00 - 14.00", "harga": 700000 },
    { "jam": "14.00 - 16.00", "harga": 1200000 },
    { "jam": "16.00 - 18.00", "harga": 1200000 },
    { "jam": "18.00 - 22.00", "harga": 1200000 }, // Range to expand
    { "jam": "22.00 - 24.00", "harga": 1000000 }
  ],
  "Sabtu": [
    { "jam": "06.00 - 08.00", "harga": 1200000 },
    { "jam": "08.00 - 10.00", "harga": 1200000 },
    { "jam": "10.00 - 12.00", "harga": 900000 },
    { "jam": "12.00 - 14.00", "harga": 900000 },
    { "jam": "14.00 - 16.00", "harga": 900000 },
    { "jam": "16.00 - 22.00", "harga": 1200000 }, // Range to expand
    { "jam": "22.00 - 24.00", "harga": 1000000 }
  ],
  "Minggu": [
    { "jam": "06.00 - 10.00", "harga": 1200000 }, // Range to expand
    { "jam": "08.00 - 10.00", "harga": 1200000 },
    { "jam": "10.00 - 12.00", "harga": 800000 },
    { "jam": "12.00 - 14.00", "harga": 800000 },
    { "jam": "14.00 - 16.00", "harga": 800000 },
    { "jam": "16.00 - 18.00", "harga": 1200000 },
    { "jam": "18.00 - 20.00", "harga": 1200000 },
    { "jam": "20.00 - 22.00", "harga": 1200000 },
    { "jam": "22.00 - 24.00", "harga": 1000000 }
  ]
};

// --- Helper Logic ---

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const getDayKey = (date: Date): string => {
  const day = date.getDay(); // 0 = Sun, 1 = Mon...
  if (day === 0) return "Minggu";
  if (day === 5) return "Jumat";
  if (day === 6) return "Sabtu";
  return "Senin_sd_Kamis";
};

const getExpandedSlots = (dayKey: string) => {
  const raw = RAW_SCHEDULE[dayKey];
  const slots: { start: number; end: number; label: string; price: number }[] = [];

  raw.forEach(item => {
    const [startStr, endStr] = item.jam.split(' - ');
    const start = parseFloat(startStr.replace('.', '.'));
    const end = parseFloat(endStr.replace('.', '.'));
    const duration = end - start;

    // If duration is significantly larger than 2 hours, assume it's a range definition 
    // that needs to be broken into 2-hour slots.
    if (duration > 2.05) { 
      let current = start;
      while (current < end - 0.1) { // small buffer
        const slotEnd = current + 2;
        // Ensure we don't go past the defined end
        if (slotEnd > end + 0.1) break; 
        
        const label = `${current.toString().padStart(2, '0')}.00 - ${slotEnd.toString().padStart(2, '0')}.00`;
        slots.push({
          start: current,
          end: slotEnd,
          label: label,
          price: item.harga
        });
        current += 2;
      }
    } else {
      slots.push({
        start,
        end,
        label: item.jam,
        price: item.harga
      });
    }
  });

  // Dedup based on label (in case of overlaps in source data like Minggu)
  const uniqueMap = new Map();
  slots.forEach(slot => uniqueMap.set(slot.label, slot));
  
  return Array.from(uniqueMap.values()).sort((a, b) => a.start - b.start);
};

// --- Main Component ---

const BookingSection: React.FC = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [dateScrollIndex, setDateScrollIndex] = useState(0);
  const [teamName, setTeamName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Fetch bookings on mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        if (response.ok) {
          const data = await response.json();
          if (data.bookings) {
            setBookings(data.bookings);
          }
        }
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
      }
    };

    fetchBookings();
  }, []);

  // Generate next 14 days
  const dates = useMemo(() => {
    const result = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      result.push(d);
    }
    return result;
  }, []);

  const visibleDates = dates.slice(dateScrollIndex, dateScrollIndex + 5); // Show 5 at a time on desktop

  const availableSlots = useMemo(() => {
    const key = getDayKey(selectedDate);
    return getExpandedSlots(key);
  }, [selectedDate]);

  const handleNextDates = () => {
    if (dateScrollIndex + 5 < dates.length) setDateScrollIndex(prev => prev + 1);
  };

  const handlePrevDates = () => {
    if (dateScrollIndex > 0) setDateScrollIndex(prev => prev - 1);
  };

  const selectedSlotData = availableSlots.find(s => s.label === selectedSlot);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot || !teamName.trim() || !phone.trim() || !selectedSlotData) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Format date for display
      const formattedDate = selectedDate.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      });

      const priceFormatted = formatPrice(selectedSlotData.price);

      // Save to database
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamName,
          phone,
          bookingDate: formattedDate,
          timeSlot: selectedSlot,
          price: priceFormatted,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Show the detailed message from the API
        const errorMessage = errorData.message || errorData.error || 'Gagal membuat pemesanan';
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Booking created:', data);
      
      // Show warning if using temporary storage
      if (data.warning) {
        console.warn('⚠️', data.warning);
      }
      if (!data.usingDatabase) {
        console.warn('💡 Tip: Set up database to persist bookings. See DATABASE_SETUP.md');
      }

      // Get booking ID from response
      const bookingId = data.booking?.bookingId || 'N/A';

      // Send WhatsApp confirmation message
      try {
        // Format phone number: remove leading 0 and add 62 country code
        let formattedPhone = phone.trim();
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '62' + formattedPhone.slice(1);
        } else if (!formattedPhone.startsWith('62')) {
          formattedPhone = '62' + formattedPhone;
        }
        const chatId = `${formattedPhone}@c.us`;

        // Bank details from environment variables
        const bankName = process.env.NEXT_PUBLIC_BANK_NAME || 'Bank Mandiri';
        const bankAccount = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || '1610016475977';
        const bankAccountName = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || 'CV BATAS KOTA POINT';

        const bookingText = `✅ *PEMESANAN BERHASIL!*
Terima kasih telah memesan lapangan di Batas Kota

📋 *Detail Pemesanan:*
• Booking ID: ${bookingId}
• Nama Tim: ${teamName}
• Tanggal: ${formattedDate}
• Waktu: ${selectedSlot}
• Nomor WhatsApp: ${phone}
• Total Pembayaran: ${priceFormatted}

💳 *Instruksi Pembayaran:*
Silakan transfer ke rekening berikut:
• Nama Penerima: ${bankAccountName}
• Bank: ${bankName.toUpperCase()}
• Nomor Rekening: ${bankAccount}

⚠️ *Penting:* Setelah melakukan pembayaran, harap konfirmasi melalui WhatsApp dengan melampirkan bukti transfer.

📌 *Peraturan Booking:*
1. Maksimal Telat 10 Menit - Tidak bisa refund jika terlambat
2. Sesi Hangus Jika Tidak Hadir - Pembayaran tidak dapat dikembalikan
3. Reschedule Harus H-1 - Perubahan jadwal harus dilakukan sehari sebelumnya
4. Sesi Tidak Bisa Dipindah - Tidak dapat dipindah ke orang lain (kecuali antar anggota tim)
5. Pembayaran - DP 50%, dan untuk pelunasannya H-1

_Batas Kota - The Town Space_`;

        const waApiEndpoint = process.env.NEXT_PUBLIC_WHATSAPP_API_ENDPOINT || '';
        if (!waApiEndpoint) {
          console.warn('WhatsApp API endpoint not configured');
          throw new Error('WhatsApp API endpoint not configured');
        }

        await fetch(waApiEndpoint, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: chatId,
            reply_to: null,
            text: bookingText,
            linkPreview: true,
            linkPreviewHighQuality: false,
            session: 'default'
          }),
        });
        console.log('WhatsApp confirmation sent to:', chatId);
      } catch (waError) {
        console.error('Failed to send WhatsApp confirmation:', waError);
        // Don't block booking flow if WhatsApp fails
      }

      // Create query params for success page
      const params = new URLSearchParams({
        team: teamName,
        date: formattedDate,
        time: selectedSlot,
        price: priceFormatted,
        phone: phone,
        bookingId: bookingId
      });

      // Redirect to success page
      router.push(`/booking-success?${params.toString()}`);
    } catch (err) {
      console.error('Booking error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat pemesanan';
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-24 bg-black relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-zinc-900/20 to-transparent pointer-events-none" />
      
      {/* Custom Background Shape - Abstract Field Diagram */}
      <div className="absolute bottom-0 right-0 w-full h-full pointer-events-none opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
          {/* Abstract Play Tactics Circles */}
          <circle cx="80%" cy="80%" r="300" fill="none" stroke="#39ff14" strokeWidth="2" strokeDasharray="20 20" />
          <circle cx="80%" cy="80%" r="200" fill="none" stroke="#39ff14" strokeWidth="1" />
          <circle cx="80%" cy="80%" r="50" fill="#39ff14" fillOpacity="0.2" />
          
          {/* Tactics Lines/Arrows */}
          <path d="M 500 800 Q 600 600 800 500" fill="none" stroke="#39ff14" strokeWidth="2" strokeDasharray="10 10" />
          <path d="M 400 900 Q 550 750 750 600" fill="none" stroke="#39ff14" strokeWidth="2" strokeOpacity="0.5" />
          
          {/* Crosshairs */}
          <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#39ff14" strokeWidth="1" strokeOpacity="0.1" />
          <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#39ff14" strokeWidth="1" strokeOpacity="0.1" />
        </svg>
      </div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white uppercase mb-4">
            Pesan <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-green to-emerald-500 drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">Lapangan</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Pilih tanggal dan waktu di bawah. Harga bervariasi berdasarkan hari dan waktu.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT COLUMN: Selection Grid */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Date Selector */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="font-display text-sm uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Pilih Tanggal
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={handlePrevDates} 
                    disabled={dateScrollIndex === 0}
                    className="p-2 rounded-full hover:bg-zinc-800 disabled:opacity-30 transition-colors text-neon-green"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleNextDates} 
                    disabled={dateScrollIndex + 5 >= dates.length}
                    className="p-2 rounded-full hover:bg-zinc-800 disabled:opacity-30 transition-colors text-neon-green"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {visibleDates.map((date, idx) => {
                  const isSelected = date.toDateString() === selectedDate.toDateString();
                  const dayName = date.toLocaleDateString('id-ID', { weekday: 'short' });
                  const dayNum = date.getDate();
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                      className={`
                        relative p-4 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-1 group
                        ${isSelected 
                          ? 'bg-neon-green border-neon-green text-black shadow-[0_0_15px_rgba(57,255,20,0.4)] scale-105 z-10' 
                          : 'bg-zinc-900/50 border-zinc-800 text-gray-400 hover:border-neon-green/50 hover:text-white'}
                      `}
                    >
                      <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-black' : 'text-gray-500'}`}>
                        {dayName}
                      </span>
                      <span className="font-display font-bold text-2xl">
                        {dayNum}
                      </span>
                      {isSelected && (
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slot Selector */}
            <div className="space-y-3 animate-fade-in">
              <h3 className="font-display text-sm uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Pilih Waktu
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Format current date once for all slots */}
                {(() => {
                  const formattedDate = selectedDate.toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  });

                  return availableSlots.map((slot, idx) => {
                    const isSelected = selectedSlot === slot.label;
                    
                    // Check if slot is booked (confirmed status)
                    const isBooked = bookings.some(b => 
                      b.bookingDate === formattedDate && 
                      b.timeSlot === slot.label && 
                      b.status === 'confirmed'
                    );

                    return (
                      <button
                        key={idx}
                        disabled={isBooked}
                        onClick={() => !isBooked && setSelectedSlot(slot.label)}
                        className={`
                          relative overflow-hidden p-4 rounded-xl border text-left transition-all duration-300 group
                          ${isBooked 
                            ? 'bg-red-900/20 border-red-900/50 cursor-not-allowed opacity-80'
                            : isSelected 
                              ? 'bg-neon-green/10 border-neon-green shadow-[inset_0_0_20px_rgba(57,255,20,0.1)]' 
                              : 'bg-zinc-900/30 border-zinc-800 hover:border-neon-green/50 hover:bg-zinc-900'}
                        `}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={`font-sans font-bold text-lg ${
                            isBooked ? 'text-red-500' : isSelected ? 'text-neon-green' : 'text-white'
                          }`}>
                            {slot.label}
                          </span>
                          {isBooked ? (
                            <Lock className="w-5 h-5 text-red-500" />
                          ) : isSelected ? (
                            <CheckCircle2 className="w-5 h-5 text-neon-green" />
                          ) : null}
                        </div>
                        <div className={`text-sm font-sans ${
                          isBooked ? 'text-red-400 font-bold uppercase' : isSelected ? 'text-white' : 'text-gray-500'
                        }`}>
                          {isBooked ? 'BOOKED' : formatPrice(slot.price)}
                        </div>
                        
                        {/* Hover Effect */}
                        {!isBooked && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-green/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        )}
                      </button>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Booking Form */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green to-transparent" />
                
                <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2 text-white">
                  <Trophy className="text-neon-green w-5 h-5" /> Ringkasan Pemesanan
                </h3>

                <div className="space-y-6">
                  {/* Summary Card */}
                  <div className="bg-black/50 rounded-lg p-4 space-y-3 border border-zinc-800/50">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                      <span className="text-gray-400 text-sm">Tanggal</span>
                      <span className="text-white font-medium">{selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                      <span className="text-gray-400 text-sm">Waktu</span>
                      <span className={`font-medium ${selectedSlot ? 'text-white' : 'text-zinc-600 italic'}`}>
                        {selectedSlot || 'Pilih waktu'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-gray-400 text-sm">Total</span>
                      <span className="text-neon-green font-display font-bold text-lg">
                        {selectedSlotData ? formatPrice(selectedSlotData.price) : '-'}
                      </span>
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Nama Tim</label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-neon-green transition-colors" />
                        <input 
                          type="text" 
                          placeholder="FC Batas Kota"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          required
                          className="w-full bg-black border border-zinc-700 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:border-neon-green focus:ring-1 focus:ring-neon-green outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase font-bold text-gray-500 tracking-wider">Nomor WhatsApp</label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-neon-green transition-colors" />
                        <input 
                          type="tel" 
                          placeholder="0812..."
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="w-full bg-black border border-zinc-700 rounded-lg py-3 pl-10 pr-4 text-white text-sm focus:border-neon-green focus:ring-1 focus:ring-neon-green outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Action Button */}
                    <NeonButton 
                      type="submit"
                      className={`w-full flex justify-center ${(!selectedSlot || !teamName.trim() || !phone.trim() || isSubmitting) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                      disabled={!selectedSlot || !teamName.trim() || !phone.trim() || isSubmitting}
                    >
                      {isSubmitting ? 'Memproses...' : 'Konfirmasi Pemesanan'}
                    </NeonButton>

                    {/* Error Message */}
                    {error && (
                      <div className="flex items-center justify-center gap-2 text-xs text-red-500/80 bg-red-500/10 p-2 rounded">
                        <AlertCircle className="w-3 h-3" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Validation Warning */}
                    {!error && (!selectedSlot || !teamName.trim() || !phone.trim()) && (
                      <div className="flex items-center justify-center gap-2 text-xs text-yellow-500/80 bg-yellow-500/10 p-2 rounded">
                        <AlertCircle className="w-3 h-3" />
                        <span>
                          {!selectedSlot && 'Silakan pilih waktu terlebih dahulu'}
                          {selectedSlot && (!teamName.trim() || !phone.trim()) && 'Silakan lengkapi data pemesanan'}
                        </span>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BookingSection;
