import {
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

// ============================================
// DATA
// ============================================
const portfolioData = [
  { name: 'Bitcoin', value: 22634, symbol: 'BTC', amount: '0.5234', change: '+5.2%', isUp: true, color: '#F7931A' },
  { name: 'Ethereum', value: 20876, symbol: 'ETH', amount: '8.5000', change: '+3.8%', isUp: true, color: '#627EEA' },
  { name: 'Solana', value: 4746, symbol: 'SOL', amount: '48.2500', change: '-1.2%', isUp: false, color: '#9945FF' },
  { name: 'Polygon', value: 2345, symbol: 'MATIC', amount: '2635.50', change: '+2.1%', isUp: true, color: '#8247E5' },
  { name: 'USDT', value: 5000, symbol: 'USDT', amount: '5000.00', change: '0.0%', isUp: true, color: '#26A17B' },
];

const totalValue = portfolioData.reduce((sum, asset) => sum + asset.value, 0);

// ============================================
// PORTFOLIO PAGE
// ============================================
function Portfolio() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Portfolio</h1>
        <p className="text-gray-400 text-sm">Track your crypto holdings</p>
      </div>

      {/* Total Value */}
      <div className="glass rounded-2xl p-5">
        <p className="text-gray-400 text-sm">Total Portfolio Value</p>
        <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
        <p className="text-emerald-400 text-sm mt-1">+$3,245.80 (5.72%) today</p>
      </div>

      {/* Chart & Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="glass rounded-2xl p-5">
          <h3 className="font-bold mb-4">Allocation</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 17, 24, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-3">
            {portfolioData.map((asset, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }} />
                <span className="text-xs text-gray-400">{asset.symbol}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Assets List */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <h3 className="font-bold mb-4">Your Assets</h3>
          <div className="space-y-3">
            {portfolioData.map((asset, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: asset.color }}
                  >
                    {asset.symbol}
                  </div>
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-xs text-gray-400">{asset.amount} {asset.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${asset.value.toLocaleString()}</p>
                  <div className={`flex items-center justify-end gap-1 text-sm ${asset.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {asset.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {asset.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
