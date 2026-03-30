import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  DollarSign,
  Download,
  FileSpreadsheet,
  FileText,
  ChevronRight
} from 'lucide-react';
import { Booking } from '@/lib/schema';
import StatCard from './StatCard';
import RecentBookings from './RecentBookings';
import { exportToCSV, exportToExcel, exportFullReport } from '@/lib/export';

interface AdminBooking extends Booking {
  id: number;
}

interface DashboardOverviewProps {
  bookings: AdminBooking[];
  loading: boolean;
  onViewAllBookings: () => void;
}

const COLORS = {
  confirmed: '#22c55e',
  pending: '#f59e0b',
  cancelled: '#ef4444',
  available: '#94a3b8'
};

export default function DashboardOverview({ bookings, loading, onViewAllBookings }: DashboardOverviewProps) {
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const revenue = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((acc, curr) => acc + Number(curr.price), 0);

    return { total, pending, confirmed, cancelled, revenue };
  }, [bookings]);

  // Revenue by date chart data
  const revenueByDate = useMemo(() => {
    const revenueMap = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((acc, booking) => {
        const date = booking.bookingDate;
        acc[date] = (acc[date] || 0) + Number(booking.price);
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(revenueMap)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days with bookings
  }, [bookings]);

  // Status distribution for pie chart
  const statusDistribution = useMemo(() => [
    { name: 'Confirmed', value: stats.confirmed, color: COLORS.confirmed },
    { name: 'Pending', value: stats.pending, color: COLORS.pending },
    { name: 'Cancelled', value: stats.cancelled, color: COLORS.cancelled }
  ].filter(item => item.value > 0), [stats]);

  // Weekly bookings trend
  const weeklyTrend = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' });
    });

    const bookingCounts = last7Days.map(dayLabel => {
      const count = bookings.filter(b => {
        const bookingDate = new Date(b.bookingDate);
        const labelDate = new Date();
        labelDate.setDate(labelDate.getDate() - (6 - last7Days.indexOf(dayLabel)));
        return bookingDate.toDateString() === labelDate.toDateString();
      }).length;
      return { day: dayLabel, bookings: count };
    });

    return bookingCounts;
  }, [bookings]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-pulse">
              <div className="h-10 w-10 bg-slate-200 rounded-xl mb-3"></div>
              <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
              <div className="h-8 w-16 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
          <p className="text-slate-500 mt-1">Welcome back! Here&apos;s what&apos;s happening with your arena.</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
          {exportMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setExportMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-slate-200 shadow-lg z-20 overflow-hidden">
                <button
                  onClick={() => { exportToCSV(bookings); setExportMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-500" />
                  Export as CSV
                </button>
                <button
                  onClick={() => { exportToExcel(bookings); setExportMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-green-600" />
                  Export as Excel
                </button>
                <button
                  onClick={() => { exportFullReport(bookings); setExportMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                >
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Full Report
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={stats.total}
          icon={Calendar}
          color="emerald"
          trend={{ value: 12, label: 'vs last week', isPositive: true }}
        />
        <StatCard
          title="Pending Approval"
          value={stats.pending}
          icon={Clock}
          color="amber"
          trend={{ value: 5, label: 'needs action', isPositive: false }}
        />
        <StatCard
          title="Confirmed"
          value={stats.confirmed}
          icon={CheckCircle2}
          color="green"
          trend={{ value: 8, label: 'vs last week', isPositive: true }}
        />
        <StatCard
          title="Total Revenue"
          value={formatPrice(stats.revenue)}
          icon={DollarSign}
          color="blue"
          trend={{ value: 15, label: 'vs last week', isPositive: true }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Revenue Trend</h3>
                <p className="text-sm text-slate-500">Daily confirmed booking revenue</p>
              </div>
            </div>
          </div>
          <div className="h-64">
            {revenueByDate.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByDate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `Rp ${(value / 1000000).toFixed(1)}M`}
                  />
                  <Tooltip
                    formatter={(value) => [formatPrice(Number(value)), 'Revenue']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#147c60"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-slate-400">No revenue data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Booking Status</h3>
              <p className="text-sm text-slate-500">Distribution overview</p>
            </div>
          </div>
          <div className="h-48">
            {statusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-slate-400">No data available</p>
              </div>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {statusDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-slate-600">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Trend & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Booking Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Weekly Trend</h3>
                <p className="text-sm text-slate-500">Bookings over the last 7 days</p>
              </div>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="day"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#147c60"
                  strokeWidth={3}
                  dot={{ fill: '#147c60', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#147c60', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings */}
        <RecentBookings bookings={bookings} onViewAll={onViewAllBookings} />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={onViewAllBookings}
          className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-slate-800">Manage Bookings</h4>
              <p className="text-sm text-slate-500">View and approve bookings</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
        </button>

        <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 rounded-xl">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Pending Actions</h4>
              <p className="text-sm text-slate-500">{stats.pending} bookings need approval</p>
            </div>
          </div>
          {stats.pending > 0 && (
            <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
              {stats.pending}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 rounded-xl">
              <XCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800">Cancelled</h4>
              <p className="text-sm text-slate-500">{stats.cancelled} cancelled bookings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
