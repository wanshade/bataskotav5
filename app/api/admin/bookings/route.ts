import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { teamName, phone, bookingDate, timeSlot, price } = body;

    // Validate required fields
    if (!teamName || !phone || !bookingDate || !timeSlot || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Parse price
    const priceValue = typeof price === 'string' 
      ? parseInt(price.replace(/\D/g, '')) 
      : parseInt(price);

    // Check if DATABASE_URL is configured
    const hasDatabaseConfigured = !!process.env.DATABASE_URL;

    if (hasDatabaseConfigured) {
      try {
        const { db } = await import('@/lib/db');
        const { bookings, generateBookingId } = await import('@/lib/schema');

        // Generate unique booking ID
        const bookingId = generateBookingId();

        // Insert booking with confirmed status (admin-created bookings are auto-confirmed)
        const [newBooking] = await db
          .insert(bookings)
          .values({
            bookingId,
            teamName,
            phone,
            bookingDate,
            timeSlot,
            price: priceValue,
            status: 'confirmed', // Admin bookings are auto-confirmed
            approvedAt: new Date(),
            approvedBy: session.user?.name || 'Admin',
          })
          .returning();

        return NextResponse.json(
          { 
            success: true, 
            booking: newBooking,
            message: 'Booking created successfully by admin'
          },
          { status: 201 }
        );
      } catch (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Database operation failed');
      }
    }

    // Fallback to temporary storage
    const generateTempBookingId = () => {
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      return `BK-${date}-${random}`;
    };

    const tempBooking = {
      id: Date.now(),
      bookingId: generateTempBookingId(),
      teamName,
      phone,
      bookingDate,
      timeSlot,
      price: priceValue,
      status: 'confirmed',
      approvedAt: new Date().toISOString(),
      approvedBy: session.user?.name || 'Admin',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { 
        success: true, 
        booking: tempBooking,
        message: 'Booking created (temporary storage)',
        warning: 'Database not configured'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin booking creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create booking', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
