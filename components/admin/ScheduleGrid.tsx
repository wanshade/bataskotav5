import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Lock, CheckCircle2, Clock, XCircle, Phone, User, Calendar, CreditCard } from 'lucide-react';
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

  // Check if slot time has passed for today
  const isSlotTimePassed = (slotLabel: string): boolean => {
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    
    if (!isToday) return false;
    
    // Extract start time from slot label (e.g., "14.00 - 16.00" -> 14)
    const startTimeStr = slotLabel.split(' - ')[0];
    const startHour = parseInt(startTimeStr.split('.')[0]);
    const startMinute = parseInt(startTimeStr.split('.')[1] || '0');
    
    // Get current time
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    
    // Compare times
    if (startHour < currentHour) return true;
    if (startHour === currentHour && startMinute <= currentMinute) return true;
    
    return false;
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

  // Check if selected date is today
  const isToday = selectedDate.toDateString() === new Date().toDateString();

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

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-100 border border-slate-300"></div>
            <span className="text-sm text-slate-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></div>
            <span className="text-sm text-slate-600">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
            <span className="text-sm text-slate-600">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
            <span className="text-sm text-slate-600">Cancelled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-200 border border-gray-300"></div>
            <span className="text-sm text-slate-600">Jam Sudah Lewat</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {availableSlots.map((slot, idx) => {
            // Find all bookings for this slot (not just confirmed)
            const booking = bookings.find(b => 
              b.bookingDate === formattedDate && 
              b.timeSlot === slot.label
            );

            const hasBooking = !!booking;
            const status = booking?.status || 'available';
            const timePassed = isSlotTimePassed(slot.label);

            // Style based on status
            const getSlotStyles = () => {
              if (timePassed) {
                return 'bg-gray-100 border-gray-300 opacity-60';
              }
              switch (status) {
                case 'confirmed':
                  return 'bg-green-50 border-green-300 ring-2 ring-green-200';
                case 'pending':
                  return 'bg-yellow-50 border-yellow-300 ring-2 ring-yellow-200';
                case 'cancelled':
                  return 'bg-red-50 border-red-300';
                default:
                  return 'bg-slate-50 border-slate-200 hover:border-indigo-300';
              }
            };

            const getStatusIcon = () => {
              if (timePassed) {
                return <Clock className="w-4 h-4 text-gray-400" />;
              }
              switch (status) {
                case 'confirmed':
                  return <Lock className="w-4 h-4 text-green-600" />;
                case 'pending':
                  return <Clock className="w-4 h-4 text-yellow-600" />;
                case 'cancelled':
                  return <XCircle className="w-4 h-4 text-red-500" />;
                default:
                  return <CheckCircle2 className="w-4 h-4 text-slate-300" />;
              }
            };

            const getStatusBadge = () => {
              if (timePassed) {
                return (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gray-200 text-gray-600">
                    <Clock className="w-3 h-3 mr-1" /> JAM LEWAT
                  </span>
                );
              }
              switch (status) {
                case 'confirmed':
                  return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> CONFIRMED
                    </span>
                  );
                case 'pending':
                  return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
                      <Clock className="w-3 h-3 mr-1" /> PENDING
                    </span>
                  );
                case 'cancelled':
                  return (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                      <XCircle className="w-3 h-3 mr-1" /> CANCELLED
                    </span>
                  );
                default:
                  return null;
              }
            };

            return (
              <div 
                key={idx}
                className={`relative p-4 rounded-lg border transition-all ${getSlotStyles()}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`font-bold ${
                    timePassed ? 'text-gray-500 line-through' :
                    status === 'confirmed' ? 'text-green-700' : 
                    status === 'pending' ? 'text-yellow-700' : 
                    status === 'cancelled' ? 'text-red-700' : 
                    'text-slate-700'
                  }`}>
                    {slot.label}
                  </span>
                  {getStatusIcon()}
                </div>
                
                {hasBooking && booking ? (
                  <div className="mt-2 space-y-2">
                    {getStatusBadge()}
                    
                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-1 mb-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <p className="text-sm font-semibold text-slate-900 truncate">{booking.teamName}</p>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <p className="text-xs text-slate-600">{booking.phone}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3 text-slate-400" />
                        <p className="text-xs font-medium text-indigo-600">
                          {formatPrice(Number(booking.price))}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-xs text-slate-400">
                        ID: <span className="font-mono">{booking.bookingId}</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    {timePassed ? (
                      <p className="text-sm text-gray-500">Jam Sudah Lewat</p>
                    ) : (
                      <>
                        <p className="text-sm text-slate-500">Available</p>
                        <p className="text-xs text-indigo-600 font-medium mt-1">{formatPrice(slot.price)}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary Stats for Selected Date */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {(() => {
            const dayBookings = bookings.filter(b => b.bookingDate === formattedDate);
            const pending = dayBookings.filter(b => b.status === 'pending').length;
            const confirmed = dayBookings.filter(b => b.status === 'confirmed').length;
            const cancelled = dayBookings.filter(b => b.status === 'cancelled').length;
            const available = availableSlots.length - dayBookings.filter(b => b.status !== 'cancelled').length;
            
            return (
              <>
                <div className="bg-slate-100 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-slate-700">{available}</p>
                  <p className="text-xs text-slate-500">Available</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-700">{pending}</p>
                  <p className="text-xs text-yellow-600">Pending</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-700">{confirmed}</p>
                  <p className="text-xs text-green-600">Confirmed</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-700">{cancelled}</p>
                  <p className="text-xs text-red-600">Cancelled</p>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
