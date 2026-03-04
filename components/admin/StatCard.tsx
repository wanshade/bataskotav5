import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  color: 'emerald' | 'amber' | 'green' | 'blue' | 'purple' | 'rose';
}

const colorStyles = {
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    border: 'border-emerald-100',
    trend: 'text-emerald-600',
    value: 'text-emerald-700'
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    border: 'border-amber-100',
    trend: 'text-amber-600',
    value: 'text-amber-700'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    border: 'border-green-100',
    trend: 'text-green-600',
    value: 'text-green-700'
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    border: 'border-blue-100',
    trend: 'text-blue-600',
    value: 'text-blue-700'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    border: 'border-purple-100',
    trend: 'text-purple-600',
    value: 'text-purple-700'
  },
  rose: {
    bg: 'bg-rose-50',
    icon: 'text-rose-600',
    border: 'border-rose-100',
    trend: 'text-rose-600',
    value: 'text-rose-700'
  }
};

export default function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <div className={`bg-white p-5 rounded-2xl border ${styles.border} shadow-sm hover:shadow-md transition-all duration-300 group`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 ${styles.bg} rounded-xl transition-transform duration-300 group-hover:scale-110`}>
            <Icon className={`w-5 h-5 ${styles.icon}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className={`text-2xl font-bold ${styles.value} mt-0.5`}>{value}</p>
          </div>
        </div>
        {trend && (
          <div className={`flex flex-col items-end ${styles.trend}`}>
            <div className="flex items-center gap-1">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">{trend.value}%</span>
            </div>
            <span className="text-xs text-slate-400">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
