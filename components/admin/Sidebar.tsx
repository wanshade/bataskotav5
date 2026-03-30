import {
  LayoutDashboard,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LogOut,
  PlusCircle,
  Home,
  Shield
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  activeTab: 'overview' | 'bookings' | 'schedule' | 'add-booking';
  setActiveTab: (tab: 'overview' | 'bookings' | 'schedule' | 'add-booking') => void;
  onLogout: () => void;
  userRole?: string;
}

export default function Sidebar({ isOpen, toggleSidebar, activeTab, setActiveTab, onLogout, userRole = 'admin' }: SidebarProps) {
  return (
    <aside
      className={`bg-white h-screen fixed left-0 top-0 transition-all duration-300 z-20 flex flex-col border-r border-emerald-100 shadow-sm ${isOpen ? 'w-64' : 'w-20'
        }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-emerald-100">
        <div className={`font-bold text-xl tracking-wider transition-opacity duration-200 text-[#147c60] ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
          }`}>
          BATAS KOTA
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-700"
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* Role Badge */}
      <div className={`px-4 py-3 border-b border-emerald-100 transition-all duration-200 ${isOpen ? '' : 'flex justify-center'
        }`}>
        {isOpen ? (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${userRole === 'superadmin'
              ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 border border-purple-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
            <Shield className="w-4 h-4" />
            {userRole === 'superadmin' ? 'Super Admin' : 'Admin'}
          </div>
        ) : (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${userRole === 'superadmin'
              ? 'bg-purple-100 text-purple-600'
              : 'bg-emerald-100 text-emerald-600'
            }`}>
            <Shield className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'overview'
              ? 'bg-[#147c60] text-white shadow-lg shadow-emerald-200'
              : 'text-slate-600 hover:bg-emerald-50 hover:text-[#147c60]'
            }`}
        >
          <Home className="w-5 h-5 min-w-[20px]" />
          <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
            }`}>
            Overview
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'bookings'
              ? 'bg-[#147c60] text-white shadow-lg shadow-emerald-200'
              : 'text-slate-600 hover:bg-emerald-50 hover:text-[#147c60]'
            }`}
        >
          <LayoutDashboard className="w-5 h-5 min-w-[20px]" />
          <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
            }`}>
            Bookings
          </span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'schedule'
              ? 'bg-[#147c60] text-white shadow-lg shadow-emerald-200'
              : 'text-slate-600 hover:bg-emerald-50 hover:text-[#147c60]'
            }`}
        >
          <CalendarDays className="w-5 h-5 min-w-[20px]" />
          <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
            }`}>
            Schedule
          </span>
        </button>

        {/* Add Booking Menu */}
        <button
          onClick={() => setActiveTab('add-booking')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'add-booking'
              ? 'bg-[#147c60] text-white shadow-lg shadow-emerald-200'
              : 'text-slate-600 hover:bg-emerald-50 hover:text-[#147c60]'
            }`}
        >
          <PlusCircle className="w-5 h-5 min-w-[20px]" />
          <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
            }`}>
            Tambah Booking
          </span>
        </button>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-emerald-100">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="w-5 h-5 min-w-[20px]" />
          <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
            }`}>
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
