import { Booking } from '@/lib/schema';
import { Calendar, Clock, Users, ArrowRight, CheckCircle2, Clock3, XCircle } from 'lucide-react';

interface AdminBooking extends Booking {
  id: number;
}

interface RecentBookingsProps {
  bookings: AdminBooking[];
  onViewAll: () => void;
}

export default function RecentBookings({ bookings, onViewAll }: RecentBookingsProps) {
  // Get 5 most recent bookings
  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock3 className="w-4 h-4 text-amber-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock3 className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <Calendar className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Recent Bookings</h3>
            <p className="text-sm text-slate-500">Latest booking activities</p>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {recentBookings.length === 0 ? (
          <div className="p-8 text-center">
            <div className="p-4 bg-slate-50 rounded-full w-fit mx-auto mb-3">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">No bookings yet</p>
          </div>
        ) : (
          recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Users className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{booking.teamName}</p>
                    <div className="flex flex-col gap-1 mt-0.5">
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {booking.bookingDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {booking.timeSlot}
                        </span>
                      </div>
                      
                      {(booking.addDokumentasi || booking.addWasit) && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {booking.addDokumentasi && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                              📸 Dok
                            </span>
                          )}
                          {booking.addWasit && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                              🏁 Wasit
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-emerald-600">{formatPrice(Number(booking.price))}</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border mt-1 ${getStatusStyle(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
