import { useState } from 'react';
import {
  Bot,
  Play,
  Pause,
  Settings,
  TrendingUp,
  Plus,
  MoreVertical,
  Zap,
  Shield,
  Target,
  Clock,
  X
} from 'lucide-react';

interface BotData {
  id: number;
  name: string;
  pair: string;
  strategy: string;
  status: 'running' | 'stopped' | 'paused';
  profit: string;
  isProfit: boolean;
  trades: number;
  winRate: string;
  runtime: string;
}

const bots: BotData[] = [
  {
    id: 1,
    name: 'Grid Master',
    pair: 'BTC/USDT',
    strategy: 'Grid Trading',
    status: 'running',
    profit: '+$2,456.80',
    isProfit: true,
    trades: 156,
    winRate: '78%',
    runtime: '14d 6h'
  },
  {
    id: 2,
    name: 'DCA Pro',
    pair: 'ETH/USDT',
    strategy: 'Dollar Cost Average',
    status: 'running',
    profit: '+$1,234.50',
    isProfit: true,
    trades: 89,
    winRate: '82%',
    runtime: '7d 12h'
  },
  {
    id: 3,
    name: 'Momentum Alpha',
    pair: 'SOL/USDT',
    strategy: 'Momentum',
    status: 'paused',
    profit: '-$156.20',
    isProfit: false,
    trades: 45,
    winRate: '45%',
    runtime: '3d 8h'
  },
  {
    id: 4,
    name: 'Scalper X',
    pair: 'MATIC/USDT',
    strategy: 'Scalping',
    status: 'running',
    profit: '+$567.30',
    isProfit: true,
    trades: 342,
    winRate: '71%',
    runtime: '5d 2h'
  },
  {
    id: 5,
    name: 'Swing Trader',
    pair: 'DOT/USDT',
    strategy: 'Swing Trading',
    status: 'stopped',
    profit: '+$89.00',
    isProfit: true,
    trades: 12,
    winRate: '67%',
    runtime: '1d 4h'
  },
];

const strategies = [
  { name: 'Grid Trading', description: 'Buy low, sell high within price range', icon: Target },
  { name: 'DCA', description: 'Regular interval purchases', icon: Clock },
  { name: 'Momentum', description: 'Follow market trends', icon: TrendingUp },
  { name: 'Scalping', description: 'Quick small profits', icon: Zap },
];

function BotCard({ bot }: { bot: BotData }) {
  const statusColors = {
    running: 'bg-emerald-500',
    paused: 'bg-amber-500',
    stopped: 'bg-gray-500',
  };

  const statusGlow = {
    running: 'shadow-emerald-500/30',
    paused: 'shadow-amber-500/30',
    stopped: '',
  };

  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.01] transition-all duration-300 hover:border-cyan-500/20 border border-transparent">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{bot.name}</h3>
            <p className="text-sm text-gray-400">{bot.pair}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 ${statusGlow[bot.status]} shadow-lg`}>
          <span className={`w-2 h-2 rounded-full ${statusColors[bot.status]} animate-pulse`} />
          <span className="text-sm text-gray-300 capitalize font-medium">{bot.status}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5">
          <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Profit/Loss</p>
          <p className={`font-bold text-lg ${bot.isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
            {bot.profit}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5">
          <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Win Rate</p>
          <p className="font-bold text-lg">{bot.winRate}</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5">
          <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Total Trades</p>
          <p className="font-bold text-lg">{bot.trades}</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/5">
          <p className="text-xs text-gray-500 mb-1.5 uppercase tracking-wider">Runtime</p>
          <p className="font-bold text-lg">{bot.runtime}</p>
        </div>
      </div>

      {/* Strategy Tag */}
      <div className="flex items-center gap-2 mb-5">
        <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 text-sm font-medium border border-purple-500/20">
          {bot.strategy}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {bot.status === 'running' ? (
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 hover:from-amber-500/30 hover:to-orange-500/30 transition-all font-medium border border-amber-500/20">
            <Pause className="w-4 h-4" />
            Pause
          </button>
        ) : (
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-400 hover:from-emerald-500/30 hover:to-cyan-500/30 transition-all font-medium border border-emerald-500/20">
            <Play className="w-4 h-4" />
            Start
          </button>
        )}
        <button className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-white/20">
          <Settings className="w-4 h-4" />
        </button>
        <button className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-white/20">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function BotConfig() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const runningBots = bots.filter(b => b.status === 'running').length;
  const totalProfit = '$4,191.40';

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Trading Bots
          </h1>
          <p className="text-gray-400 text-lg">Manage and configure your automated trading strategies.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2 w-fit shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-5 h-5" />
          Create Bot
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass rounded-2xl p-6 hover:border-emerald-500/20 border border-transparent transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Active Bots</p>
              <p className="text-3xl font-bold">{runningBots} <span className="text-gray-500 text-lg font-normal">/ {bots.length}</span></p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-6 hover:border-cyan-500/20 border border-transparent transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Bot Profit</p>
              <p className="text-3xl font-bold text-emerald-400">{totalProfit}</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-6 hover:border-purple-500/20 border border-transparent transition-all">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Avg Win Rate</p>
              <p className="text-3xl font-bold">68.6%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Strategies */}
      <div className="glass rounded-2xl p-6 lg:p-8">
        <h2 className="font-bold text-xl mb-6">Available Strategies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {strategies.map((strategy, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] hover:from-white/10 hover:to-white/5 transition-all cursor-pointer border border-white/5 hover:border-cyan-500/30 group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <strategy.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="font-semibold text-lg mb-2">{strategy.name}</p>
              <p className="text-sm text-gray-400 leading-relaxed">{strategy.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bots Grid */}
      <div>
        <h2 className="font-bold text-xl mb-6">Your Bots</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <BotCard key={bot.id} bot={bot} />
          ))}
        </div>
      </div>

      {/* Create Bot Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative glass-strong rounded-3xl p-8 w-full max-w-lg animate-fade-in shadow-2xl shadow-purple-500/10 border border-white/10">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Create New Bot</h2>
                <p className="text-gray-400 text-sm mt-1">Configure your automated trading strategy</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-medium">Bot Name</label>
                <input
                  type="text"
                  placeholder="e.g., My Grid Bot"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyan-500/50 transition-all focus:bg-white/[0.07] placeholder-gray-600"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-medium">Trading Pair</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyan-500/50 transition-all appearance-none cursor-pointer">
                  <option value="BTC/USDT">BTC/USDT</option>
                  <option value="ETH/USDT">ETH/USDT</option>
                  <option value="SOL/USDT">SOL/USDT</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-medium">Strategy</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyan-500/50 transition-all appearance-none cursor-pointer">
                  <option value="grid">Grid Trading</option>
                  <option value="dca">Dollar Cost Average</option>
                  <option value="momentum">Momentum</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block font-medium">Investment Amount (USDT)</label>
                <input
                  type="number"
                  placeholder="1000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyan-500/50 transition-all focus:bg-white/[0.07] placeholder-gray-600"
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-medium"
              >
                Cancel
              </button>
              <button className="flex-1 btn-primary shadow-lg shadow-cyan-500/20">
                Create Bot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BotConfig;
