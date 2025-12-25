import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  CandlestickChart,
  Layers,
  RefreshCw
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

const priceData = [
  { time: '00:00', price: 43100 },
  { time: '04:00', price: 43450 },
  { time: '08:00', price: 43200 },
  { time: '12:00', price: 43800 },
  { time: '16:00', price: 43600 },
  { time: '20:00', price: 44100 },
  { time: '24:00', price: 43900 },
];

const orderBook = {
  bids: [
    { price: 43256.00, amount: 0.5234, total: 22634.12 },
    { price: 43255.50, amount: 1.2500, total: 54069.37 },
    { price: 43255.00, amount: 0.8900, total: 38497.00 },
    { price: 43254.50, amount: 2.1000, total: 90834.45 },
    { price: 43254.00, amount: 0.3400, total: 14706.36 },
  ],
  asks: [
    { price: 43257.00, amount: 0.4500, total: 19465.65 },
    { price: 43257.50, amount: 0.9800, total: 42392.35 },
    { price: 43258.00, amount: 1.5600, total: 67482.48 },
    { price: 43258.50, amount: 0.7200, total: 31146.12 },
    { price: 43259.00, amount: 1.8900, total: 81759.51 },
  ],
};

const marketPairs = [
  { pair: 'BTC/USDT', price: '$43,256.00', change: '+2.45%', isUp: true },
  { pair: 'ETH/USDT', price: '$2,456.80', change: '+1.82%', isUp: true },
  { pair: 'SOL/USDT', price: '$98.45', change: '-0.65%', isUp: false },
  { pair: 'MATIC/USDT', price: '$0.89', change: '+3.21%', isUp: true },
  { pair: 'DOT/USDT', price: '$7.23', change: '-1.12%', isUp: false },
];

function Trading() {
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('43256.00');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Trading</h1>
          <p className="text-gray-400">Execute trades and monitor markets in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Market Pairs Sidebar */}
        <div className="glass rounded-2xl p-4">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Markets
          </h3>
          <div className="space-y-2">
            {marketPairs.map((market, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  idx === 0 ? 'bg-cyan-500/20 border border-cyan-500/30' : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{market.pair}</span>
                  <span className={market.isUp ? 'text-emerald-400' : 'text-rose-400'}>
                    {market.change}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{market.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CandlestickChart className="w-5 h-5 text-cyan-400" />
                <span className="font-bold text-lg">BTC/USDT</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">$43,256.00</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <ArrowUpRight className="w-4 h-4" />
                  +2.45%
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm">1D</button>
              <button className="px-3 py-1.5 rounded-lg text-gray-400 hover:bg-white/5 text-sm">1W</button>
              <button className="px-3 py-1.5 rounded-lg text-gray-400 hover:bg-white/5 text-sm">1M</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={priceData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={['dataMin - 500', 'dataMax + 500']} tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 17, 24, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#00d4ff"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order Form */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Place Order</h3>
          
          {/* Order Type Toggle */}
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

          {/* Buy/Sell Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSide('buy')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                side === 'buy' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Buy
            </button>
            <button
              onClick={() => setSide('sell')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                side === 'sell' 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <TrendingDown className="w-4 h-4 inline mr-2" />
              Sell
            </button>
          </div>

          {/* Price Input */}
          {orderType === 'limit' && (
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-2 block">Price (USDT)</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50 font-mono"
              />
            </div>
          )}

          {/* Amount Input */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">Amount (BTC)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500/50 font-mono"
            />
            <div className="flex gap-2 mt-2">
              {['25%', '50%', '75%', '100%'].map((pct) => (
                <button
                  key={pct}
                  className="flex-1 py-1.5 text-xs rounded-lg border border-white/10 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
                >
                  {pct}
                </button>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="p-4 rounded-xl bg-white/5 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total</span>
              <span className="font-mono">0.00 USDT</span>
            </div>
          </div>

          {/* Submit Button */}
          <button className={`w-full py-4 rounded-xl font-bold transition-all ${
            side === 'buy' 
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500' 
              : 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500'
          }`}>
            {side === 'buy' ? 'Buy BTC' : 'Sell BTC'}
          </button>
        </div>
      </div>

      {/* Order Book */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4 text-emerald-400">Bids (Buy Orders)</h3>
          <div className="space-y-2">
            {orderBook.bids.map((bid, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-emerald-500/10">
                <span className="font-mono text-emerald-400">${bid.price.toFixed(2)}</span>
                <span className="font-mono text-gray-400">{bid.amount.toFixed(4)}</span>
                <span className="font-mono text-gray-500">${bid.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4 text-rose-400">Asks (Sell Orders)</h3>
          <div className="space-y-2">
            {orderBook.asks.map((ask, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-rose-500/10">
                <span className="font-mono text-rose-400">${ask.price.toFixed(2)}</span>
                <span className="font-mono text-gray-400">{ask.amount.toFixed(4)}</span>
                <span className="font-mono text-gray-500">${ask.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trading;
