import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

// Function to generate random booking ID (e.g., BK-20231124-A1B2)
function generateBookingId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BK-${date}-${random}`;
}

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  bookingId: text('booking_id').notNull().unique(), // Unique booking ID like BK-20231124-A1B2
  teamName: text('team_name').notNull(),
  phone: text('phone').notNull(),
  bookingDate: text('booking_date').notNull(), // Store as formatted string
  timeSlot: text('time_slot').notNull(),
  price: integer('price').notNull(), // Store in cents/smallest unit
  createdAt: timestamp('created_at').defaultNow().notNull(),
  status: text('status').default('pending').notNull(), // pending, confirmed, cancelled
  approvedAt: timestamp('approved_at'), // When admin approved the booking
  approvedBy: text('approved_by'), // Admin who approved it
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;

export { generateBookingId };
