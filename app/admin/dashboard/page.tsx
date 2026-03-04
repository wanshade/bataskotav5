'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { Booking } from '@/lib/schema';
import Sidebar from '@/components/admin/Sidebar';
import DashboardOverview from '@/components/admin/DashboardOverview';
import BookingTable from '@/components/admin/BookingTable';
import ScheduleGrid from '@/components/admin/ScheduleGrid';
import AddBookingForm from '@/components/admin/AddBookingForm';

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
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'schedule' | 'add-booking'>('overview');

  const userRole = session?.user?.role || 'admin';
  const isAdminOrSuperadmin = userRole === 'admin' || userRole === 'superadmin';

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || !isAdminOrSuperadmin) {
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

  const updateBookingStatus = async (bookingId: string, action: 'approve' | 'reject'): Promise<boolean> => {
    setActionLoading(bookingId);
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/${action}`, {
        method: 'POST'
      });

      if (response.ok) {
        await fetchBookings();
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Failed to ${action} booking:`, error);
      return false;
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddBookingSuccess = () => {
    fetchBookings();
    // Switch to bookings tab after successful creation
    setTimeout(() => setActiveTab('bookings'), 1500);
  };

  const updatePaymentStatus = async (bookingId: string, paymentStatus: 'pending' | 'dp' | 'paid', dpAmount?: number) => {
    setActionLoading(bookingId);
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus, dpAmount }),
      });

      if (response.ok) {
        await fetchBookings();
      } else {
        console.error('Failed to update payment status');
      }
    } catch (error) {
      console.error('Failed to update payment status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteBooking = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/delete`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchBookings();
      } else {
        const data = await response.json();
        console.error('Failed to delete booking:', data.error);
      }
    } catch (error) {
      console.error('Failed to delete booking:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Dashboard Overview';
      case 'bookings': return 'Booking Management';
      case 'schedule': return 'Arena Schedule';
      case 'add-booking': return 'Tambah Booking Baru';
      default: return 'Dashboard';
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#147c60]"></div>
      </div>
    );
  }

  if (!session || !isAdminOrSuperadmin) return null;

  return (
    <div className="admin-layout min-h-screen bg-gray-50 font-sans text-slate-800">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={() => signOut()}
        userRole={userRole}
      />

      <main
        className={`transition-all duration-300 min-h-screen ${isSidebarOpen ? 'ml-64' : 'ml-20'
          }`}
      >
        {/* Top Bar */}
        <header className="bg-white h-16 border-b border-emerald-100 sticky top-0 z-10 flex items-center justify-between px-8 shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">
            {getPageTitle()}
          </h1>
          <div className="flex items-center gap-4">
            {userRole === 'superadmin' && (
              <span className="px-2.5 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-bold rounded-full shadow-sm">
                SUPER ADMIN
              </span>
            )}
            <div className="text-sm text-slate-500">
              Signed in as <span className="font-semibold text-[#147c60]">{session.user?.name}</span>
            </div>
            <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold ${userRole === 'superadmin'
              ? 'bg-purple-100 text-purple-600'
              : 'bg-emerald-100 text-[#147c60]'
              }`}>
              {session.user?.name?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <DashboardOverview
              bookings={bookings}
              loading={loading}
              onViewAllBookings={() => setActiveTab('bookings')}
            />
          )}

          {activeTab === 'bookings' && (
            <BookingTable
              bookings={bookings}
              loading={loading}
              actionLoading={actionLoading}
              onApprove={(id) => updateBookingStatus(id, 'approve')}
              onReject={(id) => updateBookingStatus(id, 'reject')}
              onCreateTest={() => { }}
              onUpdatePayment={updatePaymentStatus}
              userRole={userRole}
              onDelete={deleteBooking}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleGrid
              bookings={bookings}
              loading={loading}
            />
          )}

          {activeTab === 'add-booking' && (
            <AddBookingForm
              onSuccess={handleAddBookingSuccess}
              onCancel={() => setActiveTab('bookings')}
              existingBookings={bookings}
            />
          )}
        </div>
      </main>
    </div>
  );
}
