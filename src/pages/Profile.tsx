import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Award,
  TrendingUp,
  Edit3,
  Camera,
  Check,
  X,
  Copy,
  ExternalLink
} from 'lucide-react';

interface UserStats {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

const userStats: UserStats[] = [
  { label: 'Total Trades', value: '1,247', change: '+156 this month', isPositive: true },
  { label: 'Win Rate', value: '73.5%', change: '+2.1%', isPositive: true },
  { label: 'Total Profit', value: '$48,256', change: '+$8,432', isPositive: true },
  { label: 'Active Since', value: '14 months' },
];

const achievements = [
  { name: 'First Trade', icon: TrendingUp, earned: true, description: 'Complete your first trade' },
  { name: 'Consistent Trader', icon: Calendar, earned: true, description: 'Trade for 30 consecutive days' },
  { name: 'Profit Master', icon: Award, earned: true, description: 'Reach $10,000 in profits' },
  { name: 'Bot Builder', icon: Shield, earned: false, description: 'Create 10 trading bots' },
];

const tradingHistory = [
  { date: 'Dec 30, 2024', pair: 'BTC/USDT', type: 'buy', amount: '+$1,245.00' },
  { date: 'Dec 29, 2024', pair: 'ETH/USDT', type: 'sell', amount: '+$892.50' },
  { date: 'Dec 28, 2024', pair: 'SOL/USDT', type: 'buy', amount: '-$156.20' },
  { date: 'Dec 27, 2024', pair: 'MATIC/USDT', type: 'sell', amount: '+$445.80' },
  { date: 'Dec 26, 2024', pair: 'DOT/USDT', type: 'buy', amount: '+$234.00' },
];

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Trader',
    email: 'alex@tradebot.io',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    bio: 'Passionate crypto trader with 5+ years of experience. Focused on algorithmic trading and bot development.',
    joinDate: 'October 2023',
  });

  const handleCopyReferral = () => {
    navigator.clipboard.writeText('ALEX2024');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-gray-400">Manage your personal information and view your trading stats.</p>
      </div>

      {/* Main Profile Card */}
      <div className="glass rounded-2xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <User className="w-16 h-16 text-white" />
              </div>
              <button className="absolute bottom-2 right-2 p-2 rounded-lg bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 text-sm font-medium border border-cyan-500/30">
                Pro Trader
              </span>
              <span className="status-dot status-success" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">{profileData.name}</h2>
                <p className="text-gray-400">Member since {profileData.joinDate}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  isEditing
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                }`}
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{profileData.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium">{profileData.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium">{profileData.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Member Since</p>
                  <p className="font-medium">{profileData.joinDate}</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="p-4 rounded-xl bg-white/5">
              <p className="text-sm text-gray-500 mb-1">Bio</p>
              <p className="text-gray-300">{profileData.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {userStats.map((stat, idx) => (
          <div key={idx} className="glass rounded-2xl p-5 hover:scale-[1.02] transition-transform">
            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
            {stat.change && (
              <p className={`text-sm mt-1 ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.change}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Achievements
          </h3>
          <div className="space-y-3">
            {achievements.map((achievement, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-4 p-4 rounded-xl ${
                  achievement.earned ? 'bg-white/5' : 'bg-white/[0.02] opacity-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  achievement.earned
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                    : 'bg-gray-600/50'
                }`}>
                  <achievement.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{achievement.name}</p>
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                </div>
                {achievement.earned && (
                  <Check className="w-5 h-5 text-emerald-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {tradingHistory.map((trade, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    trade.type === 'buy'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {trade.type.toUpperCase()}
                  </span>
                  <div>
                    <p className="font-medium">{trade.pair}</p>
                    <p className="text-xs text-gray-500">{trade.date}</p>
                  </div>
                </div>
                <span className={trade.amount.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}>
                  {trade.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Referral Section */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-1">Invite Friends & Earn</h3>
            <p className="text-gray-400 text-sm">Share your referral code and earn $25 for each friend who joins</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <span className="font-mono font-bold text-cyan-400">ALEX2024</span>
              <button onClick={handleCopyReferral} className="p-1 hover:bg-white/10 rounded transition-colors">
                <Copy className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <button className="btn-primary flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
