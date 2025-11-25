'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { Booking } from '@/lib/schema';
import Sidebar from '@/components/admin/Sidebar';
import BookingTable from '@/components/admin/BookingTable';
import ScheduleGrid from '@/components/admin/ScheduleGrid';

interface AdminBooking extends Booking {
  id: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'schedule'>('bookings');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/login');
      return;
    }

    fetchBookings();
  }, [session, status, router]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTestBooking = async () => {
    setLoading(true);
    try {
      const testBooking = {
        teamName: 'Test Team Admin',
        phone: '08123456789',
        bookingDate: new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        timeSlot: '14.00 - 16.00',
        price: '150000'
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testBooking),
      });

      if (response.ok) {
        await fetchBookings();
      }
    } catch (error) {
      console.error('Failed to create test booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, action: 'approve' | 'reject') => {
    setActionLoading(bookingId);
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/${action}`, {
        method: 'POST'
      });
      
      if (response.ok) {
        await fetchBookings();
      }
    } catch (error) {
      console.error(`Failed to ${action} booking:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={() => signOut()}
      />

      <main 
        className={`transition-all duration-300 min-h-screen ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Top Bar */}
        <header className="bg-white h-16 border-b border-slate-200 sticky top-0 z-10 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800 capitalize">
            {activeTab === 'bookings' ? 'Booking Management' : 'Arena Schedule'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500">
              Signed in as <span className="font-bold text-slate-800">{session.user?.name}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {session.user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {activeTab === 'bookings' ? (
            <BookingTable 
              bookings={bookings}
              loading={loading}
              actionLoading={actionLoading}
              onApprove={(id) => updateBookingStatus(id, 'approve')}
              onReject={(id) => updateBookingStatus(id, 'reject')}
              onCreateTest={createTestBooking}
            />
          ) : (
            <ScheduleGrid 
              bookings={bookings}
              loading={loading}
            />
          )}
        </div>
      </main>
    </div>
  );
}
