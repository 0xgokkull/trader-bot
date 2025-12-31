import {
  User,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Award,
  Check
} from 'lucide-react';

// ============================================
// DATA
// ============================================
const userStats = [
  { label: 'Total Trades', value: '1,247' },
  { label: 'Win Rate', value: '73.5%' },
  { label: 'Total Profit', value: '$48,256' },
  { label: 'Active Since', value: '14 months' },
];

const achievements = [
  { name: 'First Trade', earned: true, description: 'Complete your first trade' },
  { name: 'Consistent Trader', earned: true, description: 'Trade for 30 consecutive days' },
  { name: 'Profit Master', earned: true, description: 'Reach $10,000 in profits' },
  { name: 'Bot Builder', earned: false, description: 'Create 10 trading bots' },
];

const recentActivity = [
  { date: 'Dec 30', pair: 'BTC/USDT', type: 'buy', amount: '+$1,245.00' },
  { date: 'Dec 29', pair: 'ETH/USDT', type: 'sell', amount: '+$892.50' },
  { date: 'Dec 28', pair: 'SOL/USDT', type: 'buy', amount: '-$156.20' },
];

// ============================================
// PROFILE PAGE
// ============================================
function Profile() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Profile</h1>
        <p className="text-gray-400 text-sm">Your account information</p>
      </div>

      {/* Profile Card */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Alex Trader</h2>
            <p className="text-gray-400">Pro Account</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-sm">alex@tradebot.io</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm">New York, USA</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm">Joined Oct 2023</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {userStats.map((stat, idx) => (
          <div key={idx} className="glass rounded-2xl p-4">
            <p className="text-gray-400 text-xs">{stat.label}</p>
            <p className="text-xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Achievements & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Achievements
          </h3>
          <div className="space-y-2">
            {achievements.map((a, idx) => (
              <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl ${a.earned ? 'bg-white/5' : 'bg-white/[0.02] opacity-50'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.earned ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-600/50 text-gray-500'}`}>
                  {a.earned ? <Check className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Recent Activity
          </h3>
          <div className="space-y-2">
            {recentActivity.map((trade, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${trade.type === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {trade.type.toUpperCase()}
                  </span>
                  <span className="text-sm">{trade.pair}</span>
                </div>
                <span className={`text-sm ${trade.amount.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {trade.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
