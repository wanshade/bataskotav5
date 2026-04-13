import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { bookings } from '../lib/schema';

const connectionString = process.env.DATABASE_URL!;
const sql = postgres(connectionString);
const db = drizzle(sql);

async function checkBookings() {
  console.log('=== Checking All Bookings ===\n');
  
  const allBookings = await db.select().from(bookings);
  
  console.log(`Total bookings: ${allBookings.length}\n`);
  
  if (allBookings.length === 0) {
    console.log('No bookings found in database.');
    await sql.end();
    return;
  }
  
  // Find bookings with potential 2-hour slots
  const twoHourBookings = allBookings.filter(b => {
    const slots = b.timeSlot.split(', ');
    // Check if any slot is longer than 1 hour (e.g., "06.00 - 08.00")
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
  
  if (twoHourBookings.length > 0) {
    console.log('=== Bookings with 2-hour+ slots ===\n');
    twoHourBookings.forEach(b => {
      console.log(`ID: ${b.bookingId}`);
      console.log(`Team: ${b.teamName}`);
      console.log(`Date: ${b.bookingDate}`);
      console.log(`Time Slot: ${b.timeSlot}`);
      console.log(`Price: Rp ${b.price?.toLocaleString('id-ID')}`);
      console.log(`Status: ${b.status}`);
      console.log('---');
    });
    
    console.log(`\n⚠️ Found ${twoHourBookings.length} bookings with 2-hour+ slots.`);
    console.log('Run: npm run db:migrate-slots to convert to 1-hour slots.');
  } else {
    console.log('✓ All bookings already use 1-hour slot format.');
    console.log('No migration needed.\n');
  }
  
  // Show sample bookings
  console.log('\n=== Recent Bookings ===\n');
  allBookings.slice(-10).reverse().forEach(b => {
    console.log(`${b.bookingId}: "${b.timeSlot}" - ${b.status} - Rp${b.price?.toLocaleString('id-ID')}`);
  });
  
  await sql.end();
}

checkBookings().then(() => process.exit(0)).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});