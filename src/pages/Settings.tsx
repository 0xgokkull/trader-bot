import { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  Key,
  Palette,
  Globe,
  Smartphone,
  Mail,
  AlertTriangle,
  Check,
  ChevronRight,
  Moon,
  Sun,
  Zap
} from 'lucide-react';

interface SettingSection {
  title: string;
  description: string;
  icon: React.ElementType;
  items: {
    label: string;
    description?: string;
    type: 'toggle' | 'select' | 'text' | 'link';
    value?: boolean | string;
  }[];
}

const settingSections: SettingSection[] = [
  {
    title: 'Profile',
    description: 'Manage your account information',
    icon: User,
    items: [
      { label: 'Display Name', type: 'text', value: 'Alex Trader' },
      { label: 'Email', type: 'text', value: 'alex@tradebot.io' },
      { label: 'Time Zone', type: 'select', value: 'UTC-5 (Eastern)' },
    ],
  },
  {
    title: 'Notifications',
    description: 'Configure how you receive alerts',
    icon: Bell,
    items: [
      { label: 'Push Notifications', description: 'Receive push notifications on trades', type: 'toggle', value: true },
      { label: 'Email Alerts', description: 'Get email updates for important events', type: 'toggle', value: true },
      { label: 'SMS Alerts', description: 'Receive SMS for critical alerts', type: 'toggle', value: false },
      { label: 'Trade Confirmations', description: 'Notify on every executed trade', type: 'toggle', value: true },
    ],
  },
  {
    title: 'Security',
    description: 'Protect your account',
    icon: Shield,
    items: [
      { label: 'Two-Factor Authentication', description: 'Add extra security to your account', type: 'toggle', value: true },
      { label: 'Session Timeout', type: 'select', value: '30 minutes' },
      { label: 'API Access', description: 'Manage API keys and permissions', type: 'link' },
    ],
  },
  {
    title: 'API Connections',
    description: 'Connect your exchange accounts',
    icon: Key,
    items: [
      { label: 'Binance', description: 'Connected', type: 'link' },
      { label: 'Coinbase Pro', description: 'Not connected', type: 'link' },
      { label: 'Kraken', description: 'Not connected', type: 'link' },
    ],
  },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        enabled ? 'bg-cyan-500' : 'bg-gray-600'
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    sms: false,
    trade: true,
  });
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences and configurations.</p>
      </div>

      {/* Quick Settings */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-bold mb-4">Quick Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-4 rounded-xl border transition-all ${
              darkMode 
                ? 'border-cyan-500/50 bg-cyan-500/10' 
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-5 h-5 text-cyan-400" /> : <Sun className="w-5 h-5" />}
              <span className="font-medium">Dark Mode</span>
            </div>
          </button>
          <button className="p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="font-medium">Quick Trade</span>
              <span className="text-xs text-gray-400 ml-auto">Enabled</span>
            </div>
          </button>
          <button className="p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-purple-400" />
              <span className="font-medium">Language</span>
              <span className="text-xs text-gray-400 ml-auto">English</span>
            </div>
          </button>
        </div>
      </div>

      {/* Profile Section */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Alex Trader</h2>
            <p className="text-gray-400">alex@tradebot.io</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs mt-1">
              <Check className="w-3 h-3" />
              Pro Account
            </span>
          </div>
          <button className="ml-auto btn-secondary">Edit Profile</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Display Name</label>
            <input
              type="text"
              defaultValue="Alex Trader"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Email Address</label>
            <input
              type="email"
              defaultValue="alex@tradebot.io"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold">Notifications</h2>
            <p className="text-sm text-gray-400">Configure your alert preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-gray-400">Receive push notifications on trades</p>
            </div>
            <Toggle enabled={notifications.push} onChange={() => setNotifications({...notifications, push: !notifications.push})} />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="font-medium">Email Alerts</p>
              <p className="text-sm text-gray-400">Get email updates for important events</p>
            </div>
            <Toggle enabled={notifications.email} onChange={() => setNotifications({...notifications, email: !notifications.email})} />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="font-medium">SMS Alerts</p>
              <p className="text-sm text-gray-400">Receive SMS for critical alerts</p>
            </div>
            <Toggle enabled={notifications.sms} onChange={() => setNotifications({...notifications, sms: !notifications.sms})} />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="font-medium">Trade Confirmations</p>
              <p className="text-sm text-gray-400">Notify on every executed trade</p>
            </div>
            <Toggle enabled={notifications.trade} onChange={() => setNotifications({...notifications, trade: !notifications.trade})} />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold">Security</h2>
            <p className="text-sm text-gray-400">Protect your account</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-400">Add extra security to your account</p>
              </div>
            </div>
            <Toggle enabled={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-gray-400">Update your account password</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium">Active Sessions</p>
                <p className="text-sm text-gray-400">Manage your active sessions</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* API Connections */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold">API Connections</h2>
            <p className="text-sm text-gray-400">Connect your exchange accounts</p>
          </div>
          <button className="ml-auto text-cyan-400 hover:text-cyan-300 text-sm font-medium">
            + Add Exchange
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center font-bold text-amber-400">
                B
              </div>
              <div>
                <p className="font-medium">Binance</p>
                <p className="text-sm text-emerald-400">Connected</p>
              </div>
            </div>
            <button className="btn-secondary text-sm py-2">Manage</button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center font-bold text-blue-400">
                C
              </div>
              <div>
                <p className="font-medium">Coinbase Pro</p>
                <p className="text-sm text-gray-400">Not connected</p>
              </div>
            </div>
            <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">Connect</button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center font-bold text-purple-400">
                K
              </div>
              <div>
                <p className="font-medium">Kraken</p>
                <p className="text-sm text-gray-400">Not connected</p>
              </div>
            </div>
            <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">Connect</button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass rounded-2xl p-6 border border-rose-500/30">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <h2 className="font-bold text-rose-400">Danger Zone</h2>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          These actions are irreversible. Please proceed with caution.
        </p>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl border border-rose-500/50 text-rose-400 hover:bg-rose-500/10 transition-colors">
            Delete All Bots
          </button>
          <button className="px-4 py-2 rounded-xl border border-rose-500/50 text-rose-400 hover:bg-rose-500/10 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
