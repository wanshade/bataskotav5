import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Lock, CheckCircle2 } from 'lucide-react';
import type { Booking } from '@/lib/schema';

// Reuse types and constants from BookingSection but simplified
type ScheduleItem = {
  jam: string;
  harga: number;
};

type ScheduleData = {
  [key: string]: ScheduleItem[];
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
    { "jam": "18.00 - 22.00", "harga": 1200000 },
    { "jam": "22.00 - 24.00", "harga": 1000000 }
  ],
  "Sabtu": [
    { "jam": "06.00 - 08.00", "harga": 1200000 },
    { "jam": "08.00 - 10.00", "harga": 1200000 },
    { "jam": "10.00 - 12.00", "harga": 900000 },
    { "jam": "12.00 - 14.00", "harga": 900000 },
    { "jam": "14.00 - 16.00", "harga": 900000 },
    { "jam": "16.00 - 22.00", "harga": 1200000 },
    { "jam": "22.00 - 24.00", "harga": 1000000 }
  ],
  "Minggu": [
    { "jam": "06.00 - 10.00", "harga": 1200000 },
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

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const getDayKey = (date: Date): string => {
  const day = date.getDay();
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

    if (duration > 2.05) { 
      let current = start;
      while (current < end - 0.1) {
        const slotEnd = current + 2;
        if (slotEnd > end + 0.1) break; 
        const label = `${current.toString().padStart(2, '0')}.00 - ${slotEnd.toString().padStart(2, '0')}.00`;
        slots.push({ start: current, end: slotEnd, label: label, price: item.harga });
        current += 2;
      }
    } else {
      slots.push({ start, end, label: item.jam, price: item.harga });
    }
  });
  
  const uniqueMap = new Map();
  slots.forEach(slot => uniqueMap.set(slot.label, slot));
  return Array.from(uniqueMap.values()).sort((a, b) => a.start - b.start);
};

interface ScheduleGridProps {
  bookings: Booking[];
  loading: boolean;
}

export default function ScheduleGrid({ bookings, loading }: ScheduleGridProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateScrollIndex, setDateScrollIndex] = useState(0);

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

  const visibleDates = dates.slice(dateScrollIndex, dateScrollIndex + 7); // Show 7 for admin

  const availableSlots = useMemo(() => {
    const key = getDayKey(selectedDate);
    return getExpandedSlots(key);
  }, [selectedDate]);

  const handleNextDates = () => {
    if (dateScrollIndex + 7 < dates.length) setDateScrollIndex(prev => prev + 1);
  };

  const handlePrevDates = () => {
    if (dateScrollIndex > 0) setDateScrollIndex(prev => prev - 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const formattedDate = selectedDate.toLocaleDateString('id-ID', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Schedule Overview</h2>
          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-500 font-medium">{formattedDate}</p>
            <div className="flex gap-1">
              <button onClick={handlePrevDates} disabled={dateScrollIndex === 0} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30">
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <button onClick={handleNextDates} disabled={dateScrollIndex + 7 >= dates.length} className="p-1 hover:bg-slate-100 rounded disabled:opacity-30">
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Date Scroller */}
        <div className="grid grid-cols-7 gap-2 mb-8">
          {visibleDates.map((date, idx) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            return (
              <button
                key={idx}
                onClick={() => setSelectedDate(date)}
                className={`p-3 rounded-lg border text-center transition-all ${
                  isSelected 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <div className="text-xs font-bold uppercase">{date.toLocaleDateString('id-ID', { weekday: 'short' })}</div>
                <div className="text-lg font-bold">{date.getDate()}</div>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {availableSlots.map((slot, idx) => {
            // Find booking for this slot
            const booking = bookings.find(b => 
              b.bookingDate === formattedDate && 
              b.timeSlot === slot.label && 
              b.status === 'confirmed'
            );

            const isBooked = !!booking;

            return (
              <div 
                key={idx}
                className={`relative p-4 rounded-lg border transition-all ${
                  isBooked 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-slate-50 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-bold ${isBooked ? 'text-red-700' : 'text-slate-700'}`}>
                    {slot.label}
                  </span>
                  {isBooked ? (
                    <Lock className="w-4 h-4 text-red-500" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                
                {isBooked ? (
                  <div className="mt-2">
                    <p className="text-xs font-bold text-red-600 uppercase mb-1">BOOKED BY</p>
                    <p className="text-sm font-medium text-slate-900 truncate">{booking.teamName}</p>
                    <p className="text-xs text-slate-500">{booking.phone}</p>
                  </div>
                ) : (
                  <div className="mt-2">
                    <p className="text-sm text-slate-500">Available</p>
                    <p className="text-xs text-indigo-600 font-medium mt-1">{formatPrice(slot.price)}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
