import { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  Key,
  Moon,
  Sun
} from 'lucide-react';

// ============================================
// COMPONENTS
// ============================================
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-cyan-500' : 'bg-gray-600'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

// ============================================
// SETTINGS PAGE
// ============================================
function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({ push: true, email: true, trade: true });
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-gray-400 text-sm">Manage your preferences</p>
      </div>

      {/* Theme */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-bold mb-4">Appearance</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`flex items-center gap-3 p-4 rounded-xl w-full transition-colors ${
            darkMode ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-white/5'
          }`}
        >
          {darkMode ? <Moon className="w-5 h-5 text-cyan-400" /> : <Sun className="w-5 h-5" />}
          <span className="font-medium">Dark Mode</span>
          <span className="ml-auto text-sm text-gray-400">{darkMode ? 'On' : 'Off'}</span>
        </button>
      </div>

      {/* Profile */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="font-bold">Alex Trader</h2>
            <p className="text-gray-400 text-sm">alex@tradebot.io</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Display Name</label>
            <input type="text" defaultValue="Alex Trader" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Email</label>
            <input type="email" defaultValue="alex@tradebot.io" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm" />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-purple-400" />
          <h2 className="font-bold">Notifications</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <span>Push Notifications</span>
            <Toggle enabled={notifications.push} onChange={() => setNotifications({...notifications, push: !notifications.push})} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <span>Email Alerts</span>
            <Toggle enabled={notifications.email} onChange={() => setNotifications({...notifications, email: !notifications.email})} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <span>Trade Confirmations</span>
            <Toggle enabled={notifications.trade} onChange={() => setNotifications({...notifications, trade: !notifications.trade})} />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h2 className="font-bold">Security</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <Key className="w-4 h-4 text-gray-400" />
              <span>Two-Factor Authentication</span>
            </div>
            <Toggle enabled={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
