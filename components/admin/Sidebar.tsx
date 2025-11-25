import { 
  LayoutDashboard, 
  CalendarDays, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  User
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  activeTab: 'bookings' | 'schedule';
  setActiveTab: (tab: 'bookings' | 'schedule') => void;
  onLogout: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar, activeTab, setActiveTab, onLogout }: SidebarProps) {
  return (
    <aside 
      className={`bg-slate-900 text-white h-screen fixed left-0 top-0 transition-all duration-300 z-20 flex flex-col ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <div className={`font-bold text-xl tracking-wider transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
        }`}>
          BATAS KOTA
        </div>
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-6 px-3 space-y-2">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'bookings' 
              ? 'bg-indigo-600 text-white' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 min-w-[20px]" />
          <span className={`whitespace-nowrap transition-opacity duration-200 ${
            isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
          }`}>
            Bookings
          </span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === 'schedule' 
              ? 'bg-indigo-600 text-white' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <CalendarDays className="w-5 h-5 min-w-[20px]" />
          <span className={`whitespace-nowrap transition-opacity duration-200 ${
            isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
          }`}>
            Schedule
          </span>
        </button>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-5 h-5 min-w-[20px]" />
          <span className={`whitespace-nowrap transition-opacity duration-200 ${
            isOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
          }`}>
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
