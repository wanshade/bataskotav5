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
  FileText,
  MessageCircle,
  Download,
  FileSpreadsheet,
  Wallet,
  CreditCard,
  Trash2
} from 'lucide-react';
import { Booking } from '@/lib/schema';
import { useState, useMemo } from 'react';
import ReceiptGenerator from './ReceiptGenerator';
import { exportToCSV, exportToExcel } from '@/lib/export';

interface AdminBooking extends Booking {
  id: number;
}

interface BookingTableProps {
  bookings: AdminBooking[];
  loading: boolean;
  actionLoading: string | null;
  onApprove: (id: string) => Promise<boolean | void> | void;
  onReject: (id: string) => void;
  onCreateTest: () => void;
  onUpdatePayment?: (id: string, paymentStatus: 'pending' | 'dp' | 'paid', dpAmount?: number) => Promise<void>;
  userRole?: string;
  onDelete?: (id: string) => Promise<void>;
}

export default function BookingTable({
  bookings,
  loading,
  actionLoading,
  onApprove,
  onReject,
  onCreateTest,
  onUpdatePayment,
  userRole = 'admin',
  onDelete
}: BookingTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [showDebug, setShowDebug] = useState(false);
  const [receiptBooking, setReceiptBooking] = useState<AdminBooking | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'approve' | 'reject' | null;
    booking: AdminBooking | null;
  }>({ type: null, booking: null });
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<string | null>(null);
  const [dpInputValue, setDpInputValue] = useState<string>('');

  // Approval modal payment state
  const [approvalPaymentType, setApprovalPaymentType] = useState<'dp' | 'paid' | null>(null);
  const [approvalDpAmount, setApprovalDpAmount] = useState<string>('');

  // Lunasi modal state
  const [lunasiBooking, setLunasiBooking] = useState<AdminBooking | null>(null);
  const [lunasiLoading, setLunasiLoading] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<AdminBooking | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Generate WhatsApp confirmation message
  const generateWhatsAppMessage = (booking: AdminBooking) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const statusText = booking.status === 'confirmed'
      ? '✅ *DIKONFIRMASI*'
      : booking.status === 'cancelled'
        ? '❌ *DIBATALKAN*'
        : '⏳ *MENUNGGU KONFIRMASI*';

    const message = `
🏟️ *BATAS KOTA - THE TOWN SPACE*
━━━━━━━━━━━━━━━━━━━━

Halo *${booking.teamName}*! 👋

Terima kasih telah mempercayai kami untuk kebutuhan minisoccer Anda.

📋 *DETAIL PEMESANAN*
━━━━━━━━━━━━━━━━━━━━
🆔 ID Booking: *${booking.bookingId}*
📅 Tanggal: *${formatDate(booking.bookingDate)}*
⏰ Waktu: *${booking.timeSlot}*${booking.addDokumentasi || booking.addWasit ? `\n📌 Add-On: ${(booking.addDokumentasi ? '*📸 Dokumentasi*' : '')}${(booking.addDokumentasi && booking.addWasit ? ' & ' : '')}${(booking.addWasit ? '*🏁 Wasit*' : '')}` : ''}
💰 Total: *Rp ${booking.price.toLocaleString('id-ID')}*

📊 *STATUS PEMESANAN*
${statusText}

${booking.status === 'confirmed' ? `
✨ *Booking Anda telah dikonfirmasi!*

Silakan datang 15 menit sebelum waktu bermain untuk persiapan. Tim kami siap menyambut Anda di lapangan.

📍 Lokasi: Selong, Lombok Timur
📞 Info: 08xx-xxxx-xxxx

🚨 *PERINGATAN PENIPUAN*
━━━━━━━━━━━━━━━━━━━━
⚠️ Transfer HANYA ke rekening atas nama *CV BATAS KOTA POINT*
⚠️ Kami TIDAK bertanggung jawab atas transfer ke rekening lain
⚠️ Pastikan nama penerima sesuai sebelum transfer

🚫 *PERATURAN CANCEL*
━━━━━━━━━━━━━━━━━━━━

1️⃣ Jika melakukan pembatalan pemesanan maka sejumlah uang yang telah masuk dianggap *HANGUS* dan tidak bisa untuk merubah jadwal

2️⃣ Jika melakukan pembatalan atau perubahan jadwal saat hari yang sudah ditentukan maka pembayaran yang telah dilakukan akan dianggap *HANGUS*

3️⃣ Jika pergantian jadwal dari jam premium ke jam reguler maka kelebihan uang *tidak bisa di refund* untuk kelebihan biayanya

4️⃣ Jika pergantian jadwal dari jam reguler ke jam premium maka customer dikenakan *biaya tambahan*

📋 *BOOKING ORDER*
━━━━━━━━━━━━━━━━━━━━

1️⃣ Booking bisa melalui website atau via whatsapp admin
2️⃣ Tanda putih pada jadwal berarti available (jam kosong)
3️⃣ Jam kosong yang telah dibooking akan berubah menjadi kuning, berarti sudah dibooking dan customer diberikan kesempatan *15 menit* untuk melakukan pelunasan
4️⃣ Jika dalam 15 menit belum melakukan pelunasan maka secara otomatis tanda booking order pada website kembali menjadi putih (available) dan bisa kembali dibooking oleh siapa saja
5️⃣ Tanda merah pada booking order berarti customer sudah melakukan pembayaran dan siap untuk bermain pada jadwal tersebut

⏰ *PERIODE BOOKING ORDER*
━━━━━━━━━━━━━━━━━━━━

1️⃣ Minimum order *1 jam sebelumnya*. 1 jam sebelum jam bermain pada jadwal booking hanya bisa dibooking via whatsapp melalui admin
2️⃣ Silahkan menghubungi admin
3️⃣ Untuk booking *wajib melakukan pelunasan*

_Jangan lupa bawa air minum dan semangat juara!_ ⚽🔥
` : booking.status === 'cancelled' ? `
❌ *Pemesanan dibatalkan*

Maaf, pemesanan Anda tidak dapat diproses. Silakan hubungi kami untuk informasi lebih lanjut atau booking ulang.

📞 Hubungi: 08xx-xxxx-xxxx
` : `
⏳ *Menunggu Konfirmasi*

Pemesanan Anda sedang kami proses. Kami akan segera menghubungi Anda untuk konfirmasi.
`}

━━━━━━━━━━━━━━━━━━━━
_Terima kasih telah memilih Batas Kota!_
_Setiap permainan punya cerita._ ⚽✨
    `.trim();

    return encodeURIComponent(message);
  };

  // Send WhatsApp message
  const sendWhatsAppMessage = (booking: AdminBooking) => {
    const message = generateWhatsAppMessage(booking);
    const whatsappUrl = `https://wa.me/${booking.phone.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredBookings = useMemo(() => {
    const filtered = bookings.filter(booking => {
      const matchesSearch =
        booking.teamName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.phone.includes(searchQuery);

      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort bookings: pending first, then confirmed, then cancelled
    return filtered.sort((a, b) => {
      const statusOrder = { pending: 0, confirmed: 1, cancelled: 2 };
      return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
    });
  }, [bookings, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;

    // Calculate revenue based on payment status
    const revenue = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((acc, curr) => {
        if (curr.paymentStatus === 'paid') {
          return acc + Number(curr.totalPrice || curr.price);
        } else if (curr.paymentStatus === 'dp' && curr.dpAmount) {
          return acc + Number(curr.dpAmount);
        }
        return acc;
      }, 0);

    // Calculate pending payments
    const pendingRevenue = bookings
      .filter(b => b.status === 'confirmed' && (b.paymentStatus === 'pending' || b.paymentStatus === 'dp'))
      .reduce((acc, curr) => {
        const total = Number(curr.totalPrice || curr.price);
        if (curr.paymentStatus === 'dp' && curr.dpAmount) {
          return acc + (total - Number(curr.dpAmount));
        }
        return acc + total;
      }, 0);

    // Count DP bookings
    const dpCount = bookings.filter(b => b.status === 'confirmed' && b.paymentStatus === 'dp').length;

    return { total, pending, confirmed, revenue, pendingRevenue, dpCount };
  }, [bookings]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#147c60]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Calendar className="w-5 h-5 text-[#147c60]" />
            </div>
            <p className="text-sm text-slate-500">Total Bookings</p>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-sm text-slate-500">Pending Action</p>
          </div>
          <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-slate-500">Confirmed</p>
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
        </div>

        {/* DP Bookings Count */}
        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-slate-500">Status DP</p>
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.dpCount}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Wallet className="w-5 h-5 text-[#147c60]" />
            </div>
            <p className="text-sm text-slate-500">Diterima</p>
          </div>
          <p className="text-3xl font-bold text-[#147c60]">Rp {(stats.revenue / 1000).toFixed(0)}k</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-sm text-slate-500">Belum Dibayar</p>
          </div>
          <p className="text-3xl font-bold text-orange-600">Rp {(stats.pendingRevenue / 1000).toFixed(0)}k</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            className="w-full pl-12 pr-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#147c60]/20 focus:border-[#147c60] text-slate-700 bg-white placeholder:text-slate-400 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'confirmed' | 'cancelled')}
            className="px-4 py-3 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#147c60]/20 focus:border-[#147c60] text-slate-700 bg-white transition-all"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Export Menu */}
          <div className="relative">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="flex items-center gap-2 px-4 py-3 border border-emerald-100 rounded-xl hover:bg-emerald-50 text-slate-600 bg-white transition-all"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            {exportMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setExportMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-emerald-100 shadow-lg z-20 overflow-hidden">
                  <button
                    onClick={() => { exportToCSV(filteredBookings); setExportMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-emerald-50 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    Export as CSV
                  </button>
                  <button
                    onClick={() => { exportToExcel(filteredBookings); setExportMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-emerald-50 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    Export as Excel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>


      {/* Table */}
      <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-emerald-50/50 border-b border-emerald-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#147c60] uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#147c60] uppercase tracking-wider">Team</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#147c60] uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#147c60] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#147c60] uppercase tracking-wider">Pembayaran</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#147c60] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-emerald-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">{booking.bookingId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{booking.teamName}</span>
                      <span className="text-sm text-slate-500 flex items-center gap-1 mb-1">
                        <Phone className="w-3 h-3" /> {booking.phone}
                      </span>
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
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-800">{booking.bookingDate}</span>
                      <span className="text-xs text-slate-500">{booking.timeSlot}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700 border border-green-200' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700 border border-red-200' :
                          'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingPayment === booking.bookingId ? (
                      <div className="flex flex-col gap-2 min-w-[180px]">
                        <select
                          value={booking.paymentStatus || 'pending'}
                          onChange={async (e) => {
                            const newStatus = e.target.value as 'pending' | 'dp' | 'paid';
                            if (newStatus === 'dp') {
                              // Keep editing mode for DP input
                              return;
                            }
                            if (onUpdatePayment) {
                              await onUpdatePayment(booking.bookingId, newStatus);
                            }
                            setEditingPayment(null);
                          }}
                          className="text-sm text-slate-800 px-3 py-2 border border-emerald-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#147c60]/20"
                        >
                          <option value="pending">Belum Bayar</option>
                          <option value="dp">DP</option>
                          <option value="paid">Lunas</option>
                        </select>
                        {booking.paymentStatus === 'dp' && (
                          <div className="flex gap-2 items-center">
                            <div className="relative flex-1">
                              <span className="absolute inset-y-0 left-0 pl-2 flex items-center text-slate-400 text-xs">Rp</span>
                              <input
                                type="text"
                                placeholder="500000"
                                value={dpInputValue}
                                onChange={(e) => setDpInputValue(e.target.value.replace(/\D/g, ''))}
                                className="text-sm text-slate-800 pl-7 pr-2 py-2 border border-emerald-200 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#147c60]/20 placeholder:text-slate-400"
                              />
                            </div>
                            <button
                              onClick={async () => {
                                const dpValue = parseInt(dpInputValue.replace(/\D/g, ''));
                                if (dpValue && onUpdatePayment) {
                                  await onUpdatePayment(booking.bookingId, 'dp', dpValue);
                                }
                                setEditingPayment(null);
                                setDpInputValue('');
                              }}
                              className="px-3 py-2 bg-[#147c60] text-white text-xs font-semibold rounded-lg hover:bg-[#106b52] transition-colors whitespace-nowrap"
                            >
                              Simpan
                            </button>
                          </div>
                        )}
                        {dpInputValue && (
                          <p className="text-xs text-emerald-600 font-medium">
                            Rp {parseInt(dpInputValue).toLocaleString('id-ID')}
                          </p>
                        )}
                        <button
                          onClick={() => {
                            setEditingPayment(null);
                            setDpInputValue('');
                          }}
                          className="text-xs text-slate-500 hover:text-red-500 transition-colors"
                        >
                          ✕ Batal
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize
                          ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700 border border-green-200' :
                            booking.paymentStatus === 'dp' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                              'bg-gray-100 text-gray-700 border border-gray-200'}`}
                        >
                          {booking.paymentStatus === 'paid' ? 'Lunas' :
                            booking.paymentStatus === 'dp' ? `DP ${booking.dpAmount ? `Rp ${(booking.dpAmount / 1000).toFixed(0)}k` : ''}` :
                              'Belum Bayar'}
                        </span>
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => {
                              setEditingPayment(booking.bookingId);
                              setDpInputValue(booking.dpAmount ? booking.dpAmount.toString() : '');
                            }}
                            className="p-1 text-slate-400 hover:text-[#147c60] rounded transition-colors"
                            title="Edit Pembayaran"
                          >
                            <Wallet className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {booking.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setConfirmAction({ type: 'approve', booking });
                            // Default to full payment for approval
                            setApprovalPaymentType('paid');
                          }}
                          disabled={actionLoading === booking.bookingId}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setConfirmAction({ type: 'reject', booking })}
                          disabled={actionLoading === booking.bookingId}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        {/* Delete button - admin & superadmin */}
                        {(userRole === 'admin' || userRole === 'superadmin') && onDelete && (
                          <button
                            onClick={() => setDeleteTarget(booking)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Hapus Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="flex justify-end gap-2">
                        {booking.status === 'confirmed' && (
                          <>
                            {/* Show Lunasi button for DP bookings */}
                            {booking.paymentStatus === 'dp' && onUpdatePayment && (
                              <button
                                onClick={() => setLunasiBooking(booking)}
                                className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 rounded-lg transition-all text-sm font-semibold shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 hover:scale-[1.02] active:scale-95"
                                title="Lunasi Booking"
                              >
                                💰 Lunasi
                              </button>
                            )}
                            <button
                              onClick={() => sendWhatsAppMessage(booking)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Send WhatsApp Confirmation"
                            >
                              <MessageCircle className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => window.open(`/receipt/${booking.bookingId}`, '_blank')}
                              className="p-2 text-[#147c60] hover:bg-emerald-50 rounded-lg transition-colors"
                              title="View Receipt"
                            >
                              <FileText className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <span className={`inline-flex items-center gap-1 text-sm ${booking.status === 'cancelled' ? 'text-red-400' : 'text-slate-400'
                          }`}>
                          <Lock className="w-4 h-4" /> {booking.status === 'cancelled' ? 'Cancelled' : 'Processed'}
                        </span>
                        {/* Delete button - admin & superadmin */}
                        {(userRole === 'admin' || userRole === 'superadmin') && onDelete && (
                          <button
                            onClick={() => setDeleteTarget(booking)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Hapus Booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-emerald-50 rounded-full">
                        <Calendar className="w-8 h-8 text-[#147c60]" />
                      </div>
                      <p className="text-slate-500">No bookings found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction.type && confirmAction.booking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-center w-14 h-14 mx-auto mb-5 rounded-full bg-emerald-50">
              <AlertCircle className="w-7 h-7 text-[#147c60]" />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-800 mb-2">
              {confirmAction.type === 'approve' ? 'Approve Booking' : 'Reject Booking'}
            </h3>
            <p className="text-center text-slate-500 mb-4">
              {confirmAction.type === 'approve'
                ? 'Pilih status pembayaran untuk booking ini:'
                : 'Are you sure you want to reject this booking?'}
              <br />
              <span className="font-semibold text-[#147c60]">
                {confirmAction.booking.teamName} - {confirmAction.booking.bookingId}
              </span>
            </p>

            {/* Payment Options for Approval */}
            {confirmAction.type === 'approve' && (
              <div className="mb-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setApprovalPaymentType('dp')}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${approvalPaymentType === 'dp'
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                      }`}
                  >
                    <div className="font-semibold text-sm">DP (Bayar Sebagian)</div>
                    <div className="text-xs text-slate-500 mt-1">Customer bayar DP</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setApprovalPaymentType('paid')}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${approvalPaymentType === 'paid'
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : 'bg-white border-gray-200 hover:border-green-300'
                      }`}
                  >
                    <div className="font-semibold text-sm">Lunas</div>
                    <div className="text-xs text-slate-500 mt-1">Pembayaran penuh</div>
                  </button>
                </div>

                {approvalPaymentType === 'dp' && (
                  <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <label className="block text-sm font-semibold text-slate-700">
                      💰 Jumlah DP <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 font-medium">Rp</span>
                      <input
                        type="text"
                        value={approvalDpAmount}
                        onChange={(e) => setApprovalDpAmount(e.target.value.replace(/\D/g, ''))}
                        placeholder="500000"
                        className="w-full pl-12 pr-4 py-3 text-lg font-semibold text-slate-800 bg-white border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 placeholder:text-slate-300 transition-all"
                      />
                    </div>
                    {approvalDpAmount && (
                      <p className="text-sm font-semibold text-blue-700">
                        DP: Rp {parseInt(approvalDpAmount).toLocaleString('id-ID')}
                      </p>
                    )}
                    <p className="text-xs text-slate-500">
                      Total harga: <span className="font-semibold">Rp {Number(confirmAction.booking.totalPrice || confirmAction.booking.price).toLocaleString('id-ID')}</span>
                    </p>
                  </div>
                )}

                {approvalPaymentType === 'paid' && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      Total pembayaran: <span className="font-bold">
                        Rp {Number(confirmAction.booking.totalPrice || confirmAction.booking.price).toLocaleString('id-ID')}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={async () => {
                  const bookingIdToProcess = confirmAction.booking!.bookingId;
                  if (confirmAction.type === 'approve') {
                    // Update payment status first if needed
                    if (onUpdatePayment && approvalPaymentType) {
                      const dpValue = approvalPaymentType === 'dp' && approvalDpAmount
                        ? parseInt(approvalDpAmount)
                        : undefined;
                      await onUpdatePayment(bookingIdToProcess, approvalPaymentType, dpValue);
                    }
                    await onApprove(bookingIdToProcess);
                    window.open(`/receipt/${bookingIdToProcess}`, '_blank');
                  } else {
                    onReject(bookingIdToProcess);
                  }
                  setConfirmAction({ type: null, booking: null });
                  setApprovalPaymentType(null);
                  setApprovalDpAmount('');
                }}
                disabled={
                  actionLoading === confirmAction.booking.bookingId ||
                  (confirmAction.type === 'approve' && !approvalPaymentType) ||
                  (confirmAction.type === 'approve' && approvalPaymentType === 'dp' && !approvalDpAmount)
                }
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${confirmAction.type === 'approve'
                  ? 'bg-[#147c60] hover:bg-[#106b52] text-white disabled:bg-emerald-300 shadow-lg shadow-emerald-200'
                  : 'bg-red-500 hover:bg-red-600 text-white disabled:bg-red-300 shadow-lg shadow-red-200'
                  }`}
              >
                {actionLoading === confirmAction.booking.bookingId ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Yes, ${confirmAction.type === 'approve' ? 'Approve' : 'Reject'}`
                )}
              </button>
              <button
                onClick={() => {
                  setConfirmAction({ type: null, booking: null });
                  setApprovalPaymentType(null);
                  setApprovalDpAmount('');
                }}
                disabled={actionLoading === confirmAction.booking.bookingId}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors disabled:bg-slate-50 disabled:text-slate-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lunasi Confirmation Modal */}
      {lunasiBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl p-0 max-w-md w-full mx-4 shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-6 text-white relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -right-2 bottom-0 w-16 h-16 bg-white/10 rounded-full"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 text-3xl">
                  💰
                </div>
                <h3 className="text-xl font-bold">Konfirmasi Pelunasan</h3>
                <p className="text-emerald-100 text-sm mt-1">Pastikan pembayaran sudah diterima</p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Tim</span>
                  <span className="font-bold text-slate-800">{lunasiBooking.teamName}</span>
                </div>
                <div className="border-t border-slate-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Booking ID</span>
                  <span className="font-mono text-sm text-slate-600 bg-slate-200 px-2 py-0.5 rounded">{lunasiBooking.bookingId}</span>
                </div>
                <div className="border-t border-slate-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Tanggal</span>
                  <span className="text-sm font-semibold text-slate-700">{lunasiBooking.bookingDate}</span>
                </div>
                <div className="border-t border-slate-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Jadwal</span>
                  <span className="text-sm font-semibold text-slate-700">{lunasiBooking.timeSlot}</span>
                </div>
                <div className="border-t border-slate-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">DP Dibayar</span>
                  <span className="text-sm font-bold text-blue-600">
                    Rp {lunasiBooking.dpAmount ? Number(lunasiBooking.dpAmount).toLocaleString('id-ID') : '0'}
                  </span>
                </div>
                <div className="border-t border-slate-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Sisa Pembayaran</span>
                  <span className="text-lg font-bold text-emerald-600">
                    Rp {(Number(lunasiBooking.totalPrice || lunasiBooking.price) - Number(lunasiBooking.dpAmount || 0)).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Total highlight */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-4 text-center">
                <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-1">Total Pembayaran Penuh</p>
                <p className="text-2xl font-bold text-emerald-700">
                  Rp {Number(lunasiBooking.totalPrice || lunasiBooking.price).toLocaleString('id-ID')}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setLunasiBooking(null)}
                  disabled={lunasiLoading}
                  className="flex-1 px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={async () => {
                    if (onUpdatePayment) {
                      setLunasiLoading(true);
                      try {
                        await onUpdatePayment(lunasiBooking.bookingId, 'paid');
                      } finally {
                        setLunasiLoading(false);
                        setLunasiBooking(null);
                      }
                    }
                  }}
                  disabled={lunasiLoading}
                  className="flex-1 px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 disabled:opacity-70 active:scale-95"
                >
                  {lunasiLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    <span>✅ Ya, Lunasi</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Generator Modal */}
      {receiptBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">Generate Receipt</h3>
              <button
                onClick={() => setReceiptBooking(null)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-sm text-slate-600">
                Generate receipt for <span className="font-semibold text-[#147c60]">{receiptBooking.teamName}</span>
              </p>
              <p className="text-sm text-slate-500 mt-1 font-mono">
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

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl p-0 max-w-md w-full mx-4 shadow-2xl overflow-hidden animate-[slideUp_0.3s_ease-out]">
            {/* Header with danger gradient */}
            <div className="bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 p-6 text-white relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -right-2 bottom-0 w-16 h-16 bg-white/10 rounded-full"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                  <Trash2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold">Hapus Booking</h3>
                <p className="text-red-100 text-sm mt-1">Tindakan ini tidak dapat dibatalkan!</p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="p-6 space-y-4">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Tim</span>
                  <span className="font-bold text-slate-800">{deleteTarget.teamName}</span>
                </div>
                <div className="border-t border-red-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Booking ID</span>
                  <span className="font-mono text-sm text-slate-600 bg-red-100 px-2 py-0.5 rounded">{deleteTarget.bookingId}</span>
                </div>
                <div className="border-t border-red-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Tanggal</span>
                  <span className="text-sm font-semibold text-slate-700">{deleteTarget.bookingDate}</span>
                </div>
                <div className="border-t border-red-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Jadwal</span>
                  <span className="text-sm font-semibold text-slate-700">{deleteTarget.timeSlot}</span>
                </div>
                <div className="border-t border-red-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize
                    ${deleteTarget.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      deleteTarget.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'}`}>
                    {deleteTarget.status}
                  </span>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Data booking akan <span className="font-bold">dihapus permanen</span> dari database dan tidak bisa dikembalikan.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={async () => {
                    if (onDelete) {
                      setDeleteLoading(true);
                      try {
                        await onDelete(deleteTarget.bookingId);
                      } finally {
                        setDeleteLoading(false);
                        setDeleteTarget(null);
                      }
                    }
                  }}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-3.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-200 hover:shadow-xl hover:shadow-red-300 disabled:opacity-70 active:scale-95"
                >
                  {deleteLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Menghapus...</span>
                    </div>
                  ) : (
                    <span>🗑️ Ya, Hapus</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
