'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, Download, ArrowLeft, Calendar, Clock, User, Phone, Hash } from 'lucide-react';
import Link from 'next/link';

interface Booking {
  id: number;
  bookingId: string;
  teamName: string;
  phone: string;
  bookingDate: string;
  timeSlot: string;
  price: number;
  status: string;
  createdAt: string;
  approvedAt?: string;
}

export default function ReceiptPage() {
  const params = useParams();
  const bookingId = params.bookingId as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`);
        if (!response.ok) {
          throw new Error('Booking not found');
        }
        const data = await response.json();
        setBooking(data.booking);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const handleDownload = async () => {
    if (!receiptRef.current || !booking) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(receiptRef.current, {
        scale: 3,
        backgroundColor: '#050505',
        logging: false,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `kwitansi-${booking.bookingId}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Failed to download receipt:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <p className="text-red-500 mb-4">{error || 'Booking not found'}</p>
        <Link href="/" className="text-neon-green hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      {/* Action Buttons */}
      <div className="max-w-lg mx-auto mb-6 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </Link>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-neon-green text-black font-bold rounded-lg hover:shadow-[0_0_30px_rgba(57,255,20,0.5)] transition-all"
        >
          <Download className="w-5 h-5" />
          <span>Download</span>
        </button>
      </div>

      {/* Receipt Card */}
      <div
        ref={receiptRef}
        className="max-w-lg mx-auto bg-[#050505] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl"
      >
        {/* Grid Background */}
        <div className="relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(57, 255, 20, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(57, 255, 20, 0.05) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-green/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-green/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative p-8">
            {/* Header */}
            <div className="text-center mb-8 pb-6 border-b border-zinc-800">
              <h1 className="text-3xl font-black text-white tracking-wider mb-1">
                BATAS KOTA
              </h1>
              <p className="text-neon-green text-sm font-semibold tracking-[0.3em] uppercase">
                The Town Space
              </p>
              <div className="mt-4 inline-block px-4 py-1 bg-neon-green/10 border border-neon-green/30 rounded-full">
                <span className="text-neon-green text-xs font-bold tracking-widest">
                  KWITANSI PEMBAYARAN
                </span>
              </div>
            </div>

            {/* Status Badge */}
            {booking.status === 'confirmed' && (
              <div className="flex justify-center mb-8">
                <div className="flex items-center gap-2 px-6 py-3 bg-green-500/10 border-2 border-green-500 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-green-500 font-black text-lg tracking-widest uppercase">
                    LUNAS
                  </span>
                </div>
              </div>
            )}

            {/* Booking ID */}
            <div className="bg-zinc-900/50 rounded-xl p-4 mb-6 border border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <Hash className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Booking ID</span>
                </div>
                <span className="font-mono text-neon-green font-bold text-lg">
                  {booking.bookingId}
                </span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                <div className="w-10 h-10 bg-neon-green/10 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-neon-green" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Nama Tim</p>
                  <p className="text-white font-bold text-lg">{booking.teamName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                <div className="w-10 h-10 bg-neon-green/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5 text-neon-green" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">No. WhatsApp</p>
                  <p className="text-white font-bold text-lg">{booking.phone}</p>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="bg-zinc-900 rounded-xl p-6 mb-8 border border-neon-green/20 relative overflow-hidden">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-green" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-green" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-green" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-green" />

              <h3 className="text-white font-bold mb-4 text-center uppercase tracking-wider text-sm">
                Detail Pemesanan
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Tanggal</span>
                  </div>
                  <span className="text-white font-medium">{booking.bookingDate}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-zinc-800">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Waktu</span>
                  </div>
                  <span className="text-neon-green font-bold">{booking.timeSlot}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 text-sm">Layanan</span>
                  <span className="text-white font-medium">Sewa Lapangan Mini Soccer</span>
                </div>
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-gradient-to-r from-neon-green/10 to-transparent rounded-xl p-6 border border-neon-green/30 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 uppercase tracking-wider text-sm">Total Pembayaran</span>
                <span className="text-3xl font-black text-neon-green drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">
                  {formatPrice(booking.price)}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-6 border-t border-zinc-800">
              <p className="text-gray-500 text-sm mb-2">
                Terima kasih atas kepercayaan Anda!
              </p>
              <p className="text-gray-600 text-xs font-mono">
                bataskotapoint.com
              </p>
              {booking.approvedAt && (
                <p className="text-gray-600 text-xs mt-4">
                  Dikonfirmasi pada: {formatDate(booking.approvedAt)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
