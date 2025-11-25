import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar, 
  Phone, 
  Lock,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Booking } from '@/lib/schema';
import { useState, useMemo } from 'react';
import ReceiptGenerator from './ReceiptGenerator';

interface AdminBooking extends Booking {
  id: number;
}

interface BookingTableProps {
  bookings: AdminBooking[];
  loading: boolean;
  actionLoading: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onCreateTest: () => void;
}

export default function BookingTable({ 
  bookings, 
  loading, 
  actionLoading, 
  onApprove, 
  onReject,
  onCreateTest
}: BookingTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [showDebug, setShowDebug] = useState(false);
  const [receiptBooking, setReceiptBooking] = useState<AdminBooking | null>(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = 
        booking.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.phone.includes(searchQuery);
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const revenue = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((acc, curr) => acc + Number(curr.price), 0);

    return { total, pending, confirmed, revenue };
  }, [bookings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">Total Bookings</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">Pending Action</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500">Revenue</p>
          <p className="text-2xl font-bold text-indigo-600">Rp {(stats.revenue / 1000).toFixed(0)}k</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 bg-white placeholder:text-slate-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button 
            onClick={() => setShowDebug(!showDebug)}
            className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 bg-white"
          >
            {showDebug ? 'Hide Debug' : 'Debug'}
          </button>
          <button
            onClick={onCreateTest}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            + Test
          </button>
        </div>
      </div>

      {showDebug && (
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 font-mono">
          Debug Mode: {bookings.length} raw records loaded.
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Team</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm text-slate-600">{booking.bookingId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{booking.teamName}</span>
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {booking.phone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-900">{booking.bookingDate}</span>
                      <span className="text-xs text-slate-500">{booking.timeSlot}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {booking.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onApprove(booking.bookingId)}
                          disabled={actionLoading === booking.bookingId}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Approve"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onReject(booking.bookingId)}
                          disabled={actionLoading === booking.bookingId}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => setReceiptBooking(booking)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Download Receipt"
                          >
                            <FileText className="w-5 h-5" />
                          </button>
                        )}
                        <span className={`inline-flex items-center gap-1 ${
                          booking.status === 'cancelled' ? 'text-red-400' : 'text-slate-400'
                        }`}>
                          <Lock className="w-4 h-4" /> {booking.status === 'cancelled' ? 'Cancelled' : 'Processed'}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No bookings found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Generator Modal */}
      {receiptBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Generate Receipt</h3>
              <button
                onClick={() => setReceiptBooking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Generate receipt for {receiptBooking.teamName}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Booking ID: {receiptBooking.bookingId}
              </p>
            </div>
            <ReceiptGenerator 
              booking={receiptBooking} 
              onGenerate={() => setReceiptBooking(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
