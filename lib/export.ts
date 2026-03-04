import * as XLSX from 'xlsx';

interface Booking {
  id: number;
  bookingId: string;
  teamName: string;
  phone: string;
  bookingDate: string;
  timeSlot: string;
  price: number;
  status: string;
  createdAt: Date;
  approvedAt?: Date | null;
  approvedBy?: string | null;
}

interface ExportOptions {
  filename?: string;
  includeHeaders?: boolean;
}

/**
 * Convert bookings data to CSV format
 */
function bookingsToCSV(bookings: Booking[]): string {
  const headers = [
    'Booking ID',
    'Team Name',
    'Phone',
    'Booking Date',
    'Time Slot',
    'Price',
    'Status',
    'Created At',
    'Approved At',
    'Approved By'
  ];

  const rows = bookings.map(booking => [
    booking.bookingId,
    booking.teamName,
    booking.phone,
    booking.bookingDate,
    booking.timeSlot,
    booking.price,
    booking.status,
    new Date(booking.createdAt).toLocaleString('id-ID'),
    booking.approvedAt ? new Date(booking.approvedAt).toLocaleString('id-ID') : '-',
    booking.approvedBy || '-'
  ]);

  // Escape values and create CSV content
  const escapeValue = (value: string | number): string => {
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(escapeValue).join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Export bookings to CSV file
 */
export function exportToCSV(bookings: Booking[], options: ExportOptions = {}): void {
  const { filename = `bookings-${new Date().toISOString().split('T')[0]}.csv` } = options;

  const csvContent = bookingsToCSV(bookings);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Export bookings to Excel file
 */
export function exportToExcel(bookings: Booking[], options: ExportOptions = {}): void {
  const { filename = `bookings-${new Date().toISOString().split('T')[0]}.xlsx` } = options;

  const data = bookings.map(booking => ({
    'Booking ID': booking.bookingId,
    'Team Name': booking.teamName,
    'Phone': booking.phone,
    'Booking Date': booking.bookingDate,
    'Time Slot': booking.timeSlot,
    'Price (IDR)': booking.price,
    'Status': booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
    'Created At': new Date(booking.createdAt).toLocaleString('id-ID'),
    'Approved At': booking.approvedAt ? new Date(booking.approvedAt).toLocaleString('id-ID') : '-',
    'Approved By': booking.approvedBy || '-'
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();

  // Set column widths
  const colWidths = [
    { wch: 20 }, // Booking ID
    { wch: 25 }, // Team Name
    { wch: 15 }, // Phone
    { wch: 20 }, // Booking Date
    { wch: 15 }, // Time Slot
    { wch: 15 }, // Price
    { wch: 12 }, // Status
    { wch: 20 }, // Created At
    { wch: 20 }, // Approved At
    { wch: 15 }  // Approved By
  ];
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
  XLSX.writeFile(wb, filename);
}

/**
 * Generate a summary report for bookings
 */
export function generateSummaryReport(bookings: Booking[]): {
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
} {
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + Number(b.price), 0);
  const averageBookingValue = confirmedBookings > 0 ? totalRevenue / confirmedBookings : 0;

  return {
    totalBookings,
    confirmedBookings,
    pendingBookings,
    cancelledBookings,
    totalRevenue,
    averageBookingValue
  };
}

/**
 * Export summary report to Excel with multiple sheets
 */
export function exportFullReport(bookings: Booking[], options: ExportOptions = {}): void {
  const { filename = `booking-report-${new Date().toISOString().split('T')[0]}.xlsx` } = options;

  // Main bookings sheet
  const bookingsData = bookings.map(booking => ({
    'Booking ID': booking.bookingId,
    'Team Name': booking.teamName,
    'Phone': booking.phone,
    'Booking Date': booking.bookingDate,
    'Time Slot': booking.timeSlot,
    'Price (IDR)': booking.price,
    'Status': booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
    'Created At': new Date(booking.createdAt).toLocaleString('id-ID'),
    'Approved At': booking.approvedAt ? new Date(booking.approvedAt).toLocaleString('id-ID') : '-',
    'Approved By': booking.approvedBy || '-'
  }));

  // Summary sheet
  const summary = generateSummaryReport(bookings);
  const summaryData = [
    { 'Metric': 'Total Bookings', 'Value': summary.totalBookings },
    { 'Metric': 'Confirmed Bookings', 'Value': summary.confirmedBookings },
    { 'Metric': 'Pending Bookings', 'Value': summary.pendingBookings },
    { 'Metric': 'Cancelled Bookings', 'Value': summary.cancelledBookings },
    { 'Metric': 'Total Revenue (IDR)', 'Value': summary.totalRevenue },
    { 'Metric': 'Average Booking Value (IDR)', 'Value': Math.round(summary.averageBookingValue) },
    { 'Metric': 'Conversion Rate (%)', 'Value': summary.totalBookings > 0 ? Math.round((summary.confirmedBookings / summary.totalBookings) * 100) : 0 }
  ];

  // Revenue by date
  const revenueByDate = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((acc, booking) => {
      acc[booking.bookingDate] = (acc[booking.bookingDate] || 0) + Number(booking.price);
      return acc;
    }, {} as Record<string, number>);

  const revenueData = Object.entries(revenueByDate)
    .map(([date, revenue]) => ({ 'Date': date, 'Revenue (IDR)': revenue }))
    .sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Add summary sheet
  const summaryWs = XLSX.utils.json_to_sheet(summaryData);
  summaryWs['!cols'] = [{ wch: 30 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

  // Add bookings sheet
  const bookingsWs = XLSX.utils.json_to_sheet(bookingsData);
  bookingsWs['!cols'] = [
    { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 20 },
    { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 20 },
    { wch: 20 }, { wch: 15 }
  ];
  XLSX.utils.book_append_sheet(wb, bookingsWs, 'Bookings');

  // Add revenue sheet
  const revenueWs = XLSX.utils.json_to_sheet(revenueData);
  revenueWs['!cols'] = [{ wch: 20 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, revenueWs, 'Revenue by Date');

  XLSX.writeFile(wb, filename);
}
