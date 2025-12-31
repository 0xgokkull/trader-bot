import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// ============================================
// DATA
// ============================================
const priceData = [
  { time: '00:00', price: 43100 },
  { time: '04:00', price: 43450 },
  { time: '08:00', price: 43200 },
  { time: '12:00', price: 43800 },
  { time: '16:00', price: 43600 },
  { time: '20:00', price: 44100 },
  { time: '24:00', price: 43900 },
];

const marketPairs = [
  { pair: 'BTC/USDT', price: '$43,256.00', change: '+2.45%', isUp: true },
  { pair: 'ETH/USDT', price: '$2,456.80', change: '+1.82%', isUp: true },
  { pair: 'SOL/USDT', price: '$98.45', change: '-0.65%', isUp: false },
  { pair: 'MATIC/USDT', price: '$0.89', change: '+3.21%', isUp: true },
];

// ============================================
// TRADING PAGE
// ============================================
function Trading() {
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('43256.00');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Trading</h1>
        <p className="text-gray-400 text-sm">Execute trades and monitor markets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Markets List */}
        <div className="glass rounded-2xl p-4">
          <h3 className="font-bold mb-3">Markets</h3>
          <div className="space-y-2">
            {marketPairs.map((market, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl cursor-pointer transition-colors ${
                  idx === 0 ? 'bg-cyan-500/20 border border-cyan-500/30' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{market.pair}</span>
                  <span className={market.isUp ? 'text-emerald-400' : 'text-rose-400'}>
                    {market.change}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{market.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-bold">BTC/USDT</span>
              <span className="text-xl font-bold ml-3">$43,256.00</span>
              <span className="text-emerald-400 text-sm ml-2">
                <ArrowUpRight className="w-3 h-3 inline" /> +2.45%
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={priceData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} domain={['dataMin - 500', 'dataMax + 500']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 17, 24, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Area type="monotone" dataKey="price" stroke="#00d4ff" strokeWidth={2} fill="url(#priceGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Form */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold mb-4">Place Order</h3>
          
          {/* Order Type */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setOrderType('limit')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                orderType === 'limit' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              Limit
            </button>
            <button
              onClick={() => setOrderType('market')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                orderType === 'market' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              Market
            </button>
          </div>

          {/* Buy/Sell */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSide('buy')}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                side === 'buy' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-gray-400'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-1" /> Buy
            </button>
            <button
              onClick={() => setSide('sell')}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                side === 'sell' ? 'bg-rose-500 text-white' : 'bg-white/5 text-gray-400'
              }`}
            >
              <TrendingDown className="w-4 h-4 inline mr-1" /> Sell
            </button>
          </div>

          {/* Inputs */}
          {orderType === 'limit' && (
            <div className="mb-3">
              <label className="text-xs text-gray-400 mb-1 block">Price (USDT)</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          )}

          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-1 block">Amount (BTC)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Submit */}
          <button className={`w-full py-3 rounded-xl font-bold ${
            side === 'buy' 
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' 
              : 'bg-gradient-to-r from-rose-500 to-rose-600'
          }`}>
            {side === 'buy' ? 'Buy BTC' : 'Sell BTC'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Trading;
