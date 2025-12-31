import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Bot,
  Settings,
  User,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Navigation items configuration
export const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/trading', icon: TrendingUp, label: 'Trading' },
  { path: '/portfolio', icon: Wallet, label: 'Portfolio' },
  { path: '/bots', icon: Bot, label: 'Bots' },
  { path: '/profile', icon: User, label: 'Profile' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen sidebar-bg z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Header */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} p-4 border-b border-white/10`}>
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && <span className="text-xl font-bold gradient-text">TradeBot</span>}
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className={`p-3 space-y-2 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                  isCollapsed ? 'justify-center' : ''
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-cyan-400' : ''}`} />
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Collapse Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-white" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-white" />
          )}
        </button>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className={`glass rounded-xl p-3 ${isCollapsed ? 'flex justify-center' : ''}`}>
            <div className={`flex items-center gap-3 ${isCollapsed ? '' : 'mb-2'}`}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              {!isCollapsed && (
                <div>
                  <p className="font-medium text-sm">Alex Trader</p>
                  <p className="text-xs text-gray-500">Pro Account</p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <span className="status-dot status-success" />
                <span className="text-xs text-gray-400">All systems operational</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
