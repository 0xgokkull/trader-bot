import { Bell, Search, User, Menu, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="glass-strong sticky top-0 z-30 px-6 py-4 flex items-center justify-between border-b border-white/10">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 w-48 text-sm focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-gray-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2.5 glass rounded-xl hover:bg-white/10 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full" />
        </button>
        
        {/* Settings */}
        <Link to="/settings">
          <button className="p-2.5 glass rounded-xl hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </Link>
        
        {/* Profile */}
        <Link to="/profile">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
            <User className="w-5 h-5 text-white" />
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Header;
