'use client'

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Calendar, Clock, CreditCard, AlertTriangle, ArrowLeft, Copy } from 'lucide-react';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const teamName = searchParams.get('team') || '-';
  const date = searchParams.get('date') || '-';
  const time = searchParams.get('time') || '-';
  const price = searchParams.get('price') || '-';
  const phone = searchParams.get('phone') || '-';

  const bankAccount = "1610016475977";
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bankAccount);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neon-green/10 border-2 border-neon-green mb-6 animate-pulse">
            <CheckCircle2 className="w-10 h-10 text-neon-green" />
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl uppercase mb-4">
            Pemesanan <span className="text-neon-green">Berhasil!</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Terima kasih telah memesan lapangan di Batas Kota
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green to-transparent" />
          
          <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-2 text-white">
            <Calendar className="text-neon-green w-5 h-5" /> Detail Pemesanan
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-gray-400">Nama Tim</span>
              <span className="text-white font-medium">{teamName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-gray-400">Tanggal</span>
              <span className="text-white font-medium">{date}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-gray-400">Waktu</span>
              <span className="text-white font-medium">{time}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-gray-400">Nomor WhatsApp</span>
              <span className="text-white font-medium">{phone}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-400 text-lg">Total Pembayaran</span>
              <span className="text-neon-green font-display font-bold text-2xl">{price}</span>
            </div>
          </div>
        </div>

        {/* Payment Instructions Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-green to-transparent" />
          
          <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-2 text-white">
            <CreditCard className="text-neon-green w-5 h-5" /> Instruksi Pembayaran
          </h2>

          <div className="space-y-6">
            <div>
              <p className="text-gray-400 text-sm mb-4">Silakan transfer ke rekening berikut:</p>
              
              <div className="bg-black/50 rounded-lg p-5 border border-zinc-700">
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Nama Penerima</p>
                    <p className="text-white font-bold text-lg">CV BATAS KOTA POINT</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Bank</p>
                    <p className="text-white font-bold text-lg">BANK MANDIRI</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Nomor Rekening</p>
                    <div className="flex items-center gap-3">
                      <p className="text-neon-green font-mono font-bold text-2xl">{bankAccount}</p>
                      <button
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group"
                        title="Salin nomor rekening"
                      >
                        {copied ? (
                          <CheckCircle2 className="w-5 h-5 text-neon-green" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-400 group-hover:text-neon-green" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-500 text-sm flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Penting:</strong> Setelah melakukan pembayaran, harap konfirmasi melalui WhatsApp ke <strong>{phone}</strong> dengan melampirkan bukti transfer.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Booking Rules Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="font-display font-bold text-xl mb-6 text-white">
            Peraturan Booking
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon-green/10 border border-neon-green flex items-center justify-center">
                <span className="text-neon-green font-bold">1</span>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Maksimal Telat 10 Menit</p>
                <p className="text-gray-400 text-sm">Tidak bisa refund jika terlambat</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon-green/10 border border-neon-green flex items-center justify-center">
                <span className="text-neon-green font-bold">2</span>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Sesi Hangus Jika Tidak Hadir</p>
                <p className="text-gray-400 text-sm">Pembayaran tidak dapat dikembalikan</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon-green/10 border border-neon-green flex items-center justify-center">
                <span className="text-neon-green font-bold">3</span>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Reschedule Harus H-1</p>
                <p className="text-gray-400 text-sm">Perubahan jadwal harus dilakukan sehari sebelumnya</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neon-green/10 border border-neon-green flex items-center justify-center">
                <span className="text-neon-green font-bold">4</span>
              </div>
              <div>
                <p className="text-white font-medium mb-1">Sesi Tidak Bisa Dipindah</p>
                <p className="text-gray-400 text-sm">Tidak dapat dipindah ke orang lain (kecuali antar anggota tim)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/#booking"
            className="flex-1 text-center px-6 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-display font-bold uppercase transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
          <a
            href={`https://wa.me/${phone.replace(/^0/, '62').replace(/\D/g, '')}?text=Halo, saya ingin konfirmasi pembayaran untuk booking lapangan atas nama ${teamName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-6 py-4 bg-neon-green hover:bg-neon-green/90 text-black rounded-xl font-display font-bold uppercase transition-colors"
          >
            Konfirmasi via WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-neon-green text-2xl font-display animate-pulse">
          Loading...
        </div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
}
