'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { Booking } from '@/lib/schema';

interface AdminBooking extends Booking {
  id: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/login');
      return;
    }

    fetchBookings();
  }, [session, status, router]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      const data = await response.json();
      console.log('Admin Dashboard - Fetched data:', data);
      console.log('Bookings array:', data.bookings);
     console.log('Using database:', data.usingDatabase);
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
        bookingDate: '2024-12-25',
        timeSlot: '14:00-15:00',
        price: '150000'
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testBooking),
      });

      const data = await response.json();
      console.log('Test booking created:', data);
      
      if (response.ok) {
        // Refresh bookings after creating test booking
        await fetchBookings();
      } else {
        console.error('Failed to create test booking:', data);
      }
    } catch (error) {
      console.error('Failed to create test booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveBooking = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/approve`, {
        method: 'POST'
      });
      
      if (response.ok) {
        await fetchBookings(); // Refresh bookings
      } else {
        console.error('Failed to approve booking');
      }
    } catch (error) {
      console.error('Failed to approve booking:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const rejectBooking = async (bookingId: string) => {
    setActionLoading(bookingId);
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/reject`, {
        method: 'POST'
      });
      
      if (response.ok) {
        await fetchBookings(); // Refresh bookings
      } else {
        console.error('Failed to reject booking');
      }
    } catch (error) {
      console.error('Failed to reject booking:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
              <a
                href="/"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Home
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Bookings Management
              </h2>

              {/* Debug Info */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Debug Info:</strong> Check browser console (F12) for detailed booking fetch information
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      If no bookings appear, the system may be using temporary storage which clears on server restart
                    </p>
                  </div>
                </div>
              </div>
              
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new booking through the main site.
                  </p>
                  <div className="mt-6 flex justify-center space-x-4">
                    <a
                      href="/"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Go to Booking Page
                    </a>
                    <button
                      onClick={createTestBooking}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Create Test Booking'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Booking ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Team Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time Slot
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {booking.bookingId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.teamName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.bookingDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.timeSlot}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            Rp {(booking.price / 1000).toFixed(0)}k
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              booking.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {booking.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => approveBooking(booking.bookingId)}
                                  disabled={actionLoading === booking.bookingId}
                                  className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1 rounded text-xs"
                                >
                                  {actionLoading === booking.bookingId ? 'Loading...' : 'Approve'}
                                </button>
                                <button
                                  onClick={() => rejectBooking(booking.bookingId)}
                                  disabled={actionLoading === booking.bookingId}
                                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-1 rounded text-xs"
                                >
                                  {actionLoading === booking.bookingId ? 'Loading...' : 'Reject'}
                                </button>
                              </div>
                            )}
                            {booking.status === 'confirmed' && (
                              <span className="text-green-600 text-xs">✓ Approved</span>
                            )}
                            {booking.status === 'cancelled' && (
                              <span className="text-red-600 text-xs">✗ Rejected</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
