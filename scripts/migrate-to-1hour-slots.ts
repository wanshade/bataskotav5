import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { bookings } from '../lib/schema';
import { eq } from 'drizzle-orm';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql);

/**
 * Convert 2-hour slots to 1-hour slots
 * Example: "06.00 - 08.00" -> "06.00 - 07.00, 07.00 - 08.00"
 */
function expandSlot(slot: string): string {
  const match = slot.match(/(\d{2})\.00 - (\d{2})\.00/);
  if (!match) return slot;
  
  const start = parseInt(match[1]);
  const end = parseInt(match[2]);
  const duration = end - start;
  
  // If duration > 1 hour, expand into 1-hour slots
  if (duration > 1) {
    const expandedSlots: string[] = [];
    for (let i = start; i < end; i++) {
      expandedSlots.push(`${i.toString().padStart(2, '0')}.00 - ${(i + 1).toString().padStart(2, '0')}.00`);
    }
    return expandedSlots.join(', ');
  }
  
  return slot;
}

async function migrateBookings() {
  console.log('=== Migrating Bookings from 2-hour to 1-hour slots ===\n');
  
  const allBookings = await db.select().from(bookings);
  
  console.log(`Total bookings: ${allBookings.length}\n`);
  
  const bookingsToMigrate = allBookings.filter(b => {
    const slots = b.timeSlot.split(', ');
    return slots.some(slot => {
      const match = slot.match(/(\d{2})\.00 - (\d{2})\.00/);
      if (match) {
        const start = parseInt(match[1]);
        const end = parseInt(match[2]);
        return (end - start) > 1;
      }
      return false;
    });
  });
  
  if (bookingsToMigrate.length === 0) {
    console.log('✓ No bookings need migration. All slots are already 1-hour format.');
    await sql.end();
    return;
  }
  
  console.log(`Found ${bookingsToMigrate.length} bookings to migrate:\n`);
  
  for (const booking of bookingsToMigrate) {
    const originalSlots = booking.timeSlot;
    const expandedSlots = booking.timeSlot
      .split(', ')
      .map(slot => expandSlot(slot))
      .join(', ');
    
    console.log(`Migrating: ${booking.bookingId}`);
    console.log(`  From: "${originalSlots}"`);
    console.log(`  To:   "${expandedSlots}"`);
    
    // Calculate new price based on number of 1-hour slots
    // If original was 450000 for 2 hours, new should be 450000 per hour
    const originalSlotCount = originalSlots.split(', ').length;
    const newSlotCount = expandedSlots.split(', ').length;
    
    // Only update timeSlot - keep price as is (total price remains same)
    await db.update(bookings)
      .set({ timeSlot: expandedSlots })
      .where(eq(bookings.id, booking.id));
    
    console.log('  ✓ Updated\n');
  }
  
  console.log('=== Migration Complete ===');
  console.log(`Successfully migrated ${bookingsToMigrate.length} bookings.`);
  
  await sql.end();
}

migrateBookings().then(() => process.exit(0)).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});