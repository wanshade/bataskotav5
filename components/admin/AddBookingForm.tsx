import { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  X,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

// Schedule data - same as ScheduleGrid
const RAW_SCHEDULE = {
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
  const raw = RAW_SCHEDULE[dayKey as keyof typeof RAW_SCHEDULE];
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

interface AddBookingFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  existingBookings: Array<{
    bookingDate: string;
    timeSlot: string;
    status: string;
  }>;
}

export default function AddBookingForm({ onSuccess, onCancel, existingBookings }: AddBookingFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateScrollIndex, setDateScrollIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [teamName, setTeamName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const dates = useMemo(() => {
    const result = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      result.push(d);
    }
    return result;
  }, []);

  const visibleDates = dates.slice(dateScrollIndex, dateScrollIndex + 7);

  const availableSlots = useMemo(() => {
    const key = getDayKey(selectedDate);
    return getExpandedSlots(key);
  }, [selectedDate]);

  const formattedDate = selectedDate.toLocaleDateString('id-ID', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long',
    year: 'numeric'
  });

  const isSlotBooked = (slotLabel: string) => {
    return existingBookings.some(b => 
      b.bookingDate === formattedDate && 
      b.timeSlot === slotLabel && 
      b.status === 'confirmed'
    );
  };

  const isSlotTimePassed = (slotLabel: string): boolean => {
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    
    if (!isToday) return false;
    
    const startTimeStr = slotLabel.split(' - ')[0];
    const startHour = parseInt(startTimeStr.split('.')[0]);
    const startMinute = parseInt(startTimeStr.split('.')[1] || '0');
    
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    
    if (startHour < currentHour) return true;
    if (startHour === currentHour && startMinute <= currentMinute) return true;
    
    return false;
  };

  const selectedSlotData = availableSlots.find(s => s.label === selectedSlot);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!teamName.trim()) {
      setError('Nama tim wajib diisi');
      return;
    }
    if (!phone.trim()) {
      setError('Nomor HP wajib diisi');
      return;
    }
    if (!selectedSlot) {
      setError('Pilih jadwal booking terlebih dahulu');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName,
          phone,
          bookingDate: formattedDate,
          timeSlot: selectedSlot,
          price: selectedSlotData?.price || 0,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Booking berhasil dibuat!');
        setTeamName('');
        setPhone('');
        setSelectedSlot('');
        onSuccess();
      } else {
        setError(data.error || 'Gagal membuat booking');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Tambah Booking Baru</h2>
            <p className="text-sm text-slate-500">Buat booking manual untuk customer</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Date Selection */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Pilih Tanggal</h3>
              <p className="text-sm text-slate-500">Tanggal dipilih: <span className="font-medium text-indigo-600">{formattedDate}</span></p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDateScrollIndex(prev => Math.max(0, prev - 1))}
              disabled={dateScrollIndex === 0}
              className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex-1 grid grid-cols-7 gap-2">
              {visibleDates.map((date, idx) => {
                const isSelected = date.toDateString() === selectedDate.toDateString();
                const isToday = date.toDateString() === new Date().toDateString();
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedSlot('');
                    }}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      isSelected 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
                        : isToday
                          ? 'bg-green-50 border-green-400 text-green-700 hover:bg-green-100'
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1">
                      {date.toLocaleDateString('id-ID', { weekday: 'short' })}
                    </div>
                    <div className="text-xl font-bold">{date.getDate()}</div>
                    {isToday && <div className="text-[10px] font-medium mt-1 opacity-80">Hari Ini</div>}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setDateScrollIndex(prev => Math.min(dates.length - 7, prev + 1))}
              disabled={dateScrollIndex + 7 >= dates.length}
              className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </section>

        {/* Time Slot Selection */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Pilih Jadwal</h3>
              <p className="text-sm text-slate-500">Pilih slot waktu yang tersedia</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableSlots.map((slot) => {
              const booked = isSlotBooked(slot.label);
              const timePassed = isSlotTimePassed(slot.label);
              const isSelected = selectedSlot === slot.label;
              
              return (
                <button
                  key={slot.label}
                  type="button"
                  disabled={booked || timePassed}
                  onClick={() => setSelectedSlot(slot.label)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    booked
                      ? 'bg-red-50 border-red-200 cursor-not-allowed opacity-70'
                      : timePassed
                        ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60'
                        : isSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200 transform scale-[1.02]'
                          : 'bg-white border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-md'
                  }`}
                >
                  <div className={`font-bold text-lg ${
                    isSelected ? 'text-white' : booked ? 'text-red-700' : timePassed ? 'text-gray-500 line-through' : 'text-slate-800'
                  }`}>
                    {slot.label}
                  </div>
                  <div className={`text-sm mt-1 font-medium ${
                    isSelected ? 'text-emerald-100' : booked ? 'text-red-500' : timePassed ? 'text-gray-400' : 'text-emerald-600'
                  }`}>
                    {booked ? '❌ Sudah Dibooking' : timePassed ? '⏰ Jam Lewat' : formatPrice(slot.price)}
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {selectedSlotData && (
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-800">Jadwal dipilih:</span>
                </div>
                <span className="text-lg font-bold text-emerald-700">
                  {selectedSlot} • {formatPrice(selectedSlotData.price)}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Customer Information */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Informasi Customer</h3>
              <p className="text-sm text-slate-500">Masukkan detail tim dan kontak</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Team Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Nama Tim <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Users className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Contoh: Tim Bola Keren"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                  required
                />
              </div>
              <p className="text-xs text-slate-500">Masukkan nama tim yang akan bermain</p>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Nomor WhatsApp <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
                  required
                />
              </div>
              <p className="text-xs text-slate-500">Nomor HP aktif untuk konfirmasi</p>
            </div>
          </div>
        </section>

        {/* Summary & Actions */}
        <section className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Ringkasan Booking</h3>
          
          <div className="bg-white rounded-xl p-4 mb-6 space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Tanggal</span>
              <span className="font-medium text-slate-900">{formattedDate}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Jadwal</span>
              <span className="font-medium text-slate-900">{selectedSlot || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Nama Tim</span>
              <span className="font-medium text-slate-900">{teamName || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-500">Nomor HP</span>
              <span className="font-medium text-slate-900">{phone || '-'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-500">Total Harga</span>
              <span className="text-xl font-bold text-emerald-600">
                {selectedSlotData ? formatPrice(selectedSlotData.price) : '-'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-white hover:border-slate-400 font-semibold transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || !selectedSlot || !teamName || !phone}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-semibold transition-all disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Buat Booking
                </>
              )}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}
