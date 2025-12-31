import { useState } from 'react';
import {
  Bot,
  Play,
  Pause,
  Settings,
  TrendingUp,
  Plus,
  X
} from 'lucide-react';

// ============================================
// DATA
// ============================================
interface BotData {
  id: number;
  name: string;
  pair: string;
  strategy: string;
  status: 'running' | 'stopped' | 'paused';
  profit: string;
  isProfit: boolean;
  winRate: string;
}

const bots: BotData[] = [
  { id: 1, name: 'Grid Master', pair: 'BTC/USDT', strategy: 'Grid Trading', status: 'running', profit: '+$2,456.80', isProfit: true, winRate: '78%' },
  { id: 2, name: 'DCA Pro', pair: 'ETH/USDT', strategy: 'DCA', status: 'running', profit: '+$1,234.50', isProfit: true, winRate: '82%' },
  { id: 3, name: 'Momentum Alpha', pair: 'SOL/USDT', strategy: 'Momentum', status: 'paused', profit: '-$156.20', isProfit: false, winRate: '45%' },
  { id: 4, name: 'Scalper X', pair: 'MATIC/USDT', strategy: 'Scalping', status: 'running', profit: '+$567.30', isProfit: true, winRate: '71%' },
];

// ============================================
// COMPONENTS
// ============================================
function BotCard({ bot }: { bot: BotData }) {
  const statusColors = {
    running: 'bg-emerald-500',
    paused: 'bg-amber-500',
    stopped: 'bg-gray-500',
  };

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold">{bot.name}</h3>
            <p className="text-xs text-gray-400">{bot.pair}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${statusColors[bot.status]}`} />
          <span className="text-xs text-gray-400 capitalize">{bot.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-white/5">
          <p className="text-xs text-gray-500">Profit</p>
          <p className={`font-bold ${bot.isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>{bot.profit}</p>
        </div>
        <div className="p-3 rounded-xl bg-white/5">
          <p className="text-xs text-gray-500">Win Rate</p>
          <p className="font-bold">{bot.winRate}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 px-2 py-1 rounded-lg bg-white/5">{bot.strategy}</span>
        <div className="flex gap-2">
          {bot.status === 'running' ? (
            <button className="p-2 rounded-lg bg-amber-500/20 text-amber-400 hover:bg-amber-500/30">
              <Pause className="w-4 h-4" />
            </button>
          ) : (
            <button className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
              <Play className="w-4 h-4" />
            </button>
          )}
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// BOT CONFIG PAGE
// ============================================
function BotConfig() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const runningBots = bots.filter(b => b.status === 'running').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Trading Bots</h1>
          <p className="text-gray-400 text-sm">Manage your automated strategies</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Bot
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Bots</p>
              <p className="text-2xl font-bold">{runningBots} / {bots.length}</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Profit</p>
              <p className="text-2xl font-bold text-emerald-400">+$4,102.40</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bots.map((bot) => (
          <BotCard key={bot.id} bot={bot} />
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowCreateModal(false)} />
          <div className="relative glass-strong rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Create New Bot</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Bot Name</label>
                <input type="text" placeholder="My Bot" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Trading Pair</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <option>BTC/USDT</option>
                  <option>ETH/USDT</option>
                  <option>SOL/USDT</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Strategy</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <option>Grid Trading</option>
                  <option>DCA</option>
                  <option>Momentum</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5">
                Cancel
              </button>
              <button className="flex-1 btn-primary">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BotConfig;
