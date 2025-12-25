import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  PieChart as PieChartIcon,
  BarChart3
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const portfolioData = [
  { name: 'Bitcoin', value: 22634, symbol: 'BTC', amount: '0.5234', change: '+5.2%', isUp: true, color: '#F7931A' },
  { name: 'Ethereum', value: 20876, symbol: 'ETH', amount: '8.5000', change: '+3.8%', isUp: true, color: '#627EEA' },
  { name: 'Solana', value: 4746, symbol: 'SOL', amount: '48.2500', change: '-1.2%', isUp: false, color: '#9945FF' },
  { name: 'Polygon', value: 2345, symbol: 'MATIC', amount: '2635.50', change: '+2.1%', isUp: true, color: '#8247E5' },
  { name: 'Polkadot', value: 1890, symbol: 'DOT', amount: '261.40', change: '+0.8%', isUp: true, color: '#E6007A' },
  { name: 'USDT', value: 5000, symbol: 'USDT', amount: '5000.00', change: '0.0%', isUp: true, color: '#26A17B' },
];

const totalValue = portfolioData.reduce((sum, asset) => sum + asset.value, 0);

function Portfolio() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
          <p className="text-gray-400">Track and manage your crypto holdings.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 w-fit">
          <Wallet className="w-4 h-4" />
          Add Asset
        </button>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Value Card */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Portfolio Value</p>
              <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <ArrowUpRight className="w-4 h-4" />
            <span className="font-medium">+$3,245.80 (5.72%)</span>
            <span className="text-gray-500 text-sm">24h</span>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Best Performer</p>
              <p className="text-xl font-bold">Bitcoin (BTC)</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="font-medium">+5.2% today</span>
          </div>
        </div>

        {/* Allocation Stats */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Assets Held</p>
              <p className="text-xl font-bold">{portfolioData.length} Assets</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Diversified across multiple tokens</span>
          </div>
        </div>
      </div>

      {/* Allocation Chart & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="glass rounded-2xl p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-cyan-400" />
            Allocation
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
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
                  borderRadius: '12px',
                  color: '#fff'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {portfolioData.map((asset, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }} />
                <span className="text-xs text-gray-400">{asset.symbol}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Assets List */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h3 className="font-bold mb-4">Your Assets</h3>
          <div className="space-y-3">
            {portfolioData.map((asset, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: asset.color }}
                  >
                    {asset.symbol}
                  </div>
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-sm text-gray-400">{asset.amount} {asset.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${asset.value.toLocaleString()}</p>
                  <div className={`flex items-center justify-end gap-1 ${asset.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {asset.isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span className="text-sm">{asset.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Allocation Breakdown Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="font-bold">Allocation Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Asset</th>
                <th>Holdings</th>
                <th>Value</th>
                <th>Allocation</th>
                <th>24h Change</th>
              </tr>
            </thead>
            <tbody>
              {portfolioData.map((asset, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: asset.color }}
                      >
                        {asset.symbol}
                      </div>
                      <span className="font-medium">{asset.name}</span>
                    </div>
                  </td>
                  <td className="font-mono">{asset.amount} {asset.symbol}</td>
                  <td className="font-mono">${asset.value.toLocaleString()}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(asset.value / totalValue) * 100}%`,
                            backgroundColor: asset.color
                          }}
                        />
                      </div>
                      <span className="text-gray-400 text-sm">
                        {((asset.value / totalValue) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className={asset.isUp ? 'text-emerald-400' : 'text-rose-400'}>
                    {asset.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
