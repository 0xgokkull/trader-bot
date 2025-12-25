import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const performanceData = [
  { name: 'Jan', value: 24000, profit: 2400 },
  { name: 'Feb', value: 28000, profit: 4000 },
  { name: 'Mar', value: 25000, profit: -3000 },
  { name: 'Apr', value: 32000, profit: 7000 },
  { name: 'May', value: 38000, profit: 6000 },
  { name: 'Jun', value: 42000, profit: 4000 },
  { name: 'Jul', value: 48000, profit: 6000 },
];

const recentTrades = [
  { id: 1, pair: 'BTC/USDT', type: 'buy', amount: '0.0234', price: '$43,256.00', profit: '+$142.50', time: '2 min ago' },
  { id: 2, pair: 'ETH/USDT', type: 'sell', amount: '1.5000', price: '$2,456.00', profit: '+$89.20', time: '15 min ago' },
  { id: 3, pair: 'SOL/USDT', type: 'buy', amount: '25.000', price: '$98.45', profit: '-$12.30', time: '32 min ago' },
  { id: 4, pair: 'MATIC/USDT', type: 'sell', amount: '500.00', price: '$0.89', profit: '+$45.00', time: '1 hr ago' },
  { id: 5, pair: 'DOT/USDT', type: 'buy', amount: '45.000', price: '$7.23', profit: '+$67.80', time: '2 hr ago' },
];

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  gradient: string;
}

function MetricCard({ title, value, change, isPositive, icon: Icon, gradient }: MetricCardProps) {
  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-medium ${
          isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
        }`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {change}
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your trading overview.</p>
        </div>
        <button className="btn-primary flex items-center gap-2 w-fit">
          <Zap className="w-4 h-4" />
          Quick Trade
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Balance"
          value="$48,256.80"
          change="+12.5%"
          isPositive={true}
          icon={DollarSign}
          gradient="bg-gradient-to-br from-cyan-400 to-cyan-600"
        />
        <MetricCard
          title="Total Profit/Loss"
          value="+$8,432.50"
          change="+8.2%"
          isPositive={true}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-emerald-400 to-emerald-600"
        />
        <MetricCard
          title="Active Bots"
          value="5 Running"
          change="2 new"
          isPositive={true}
          icon={Activity}
          gradient="bg-gradient-to-br from-purple-400 to-purple-600"
        />
        <MetricCard
          title="Win Rate"
          value="73.5%"
          change="+2.1%"
          isPositive={true}
          icon={Target}
          gradient="bg-gradient-to-br from-amber-400 to-orange-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Performance Chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Portfolio Performance</h2>
              <p className="text-gray-400 text-sm">Last 7 months</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm font-medium">7M</button>
              <button className="px-4 py-2 rounded-lg text-gray-400 hover:bg-white/5 text-sm font-medium transition-colors">1Y</button>
              <button className="px-4 py-2 rounded-lg text-gray-400 hover:bg-white/5 text-sm font-medium transition-colors">All</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 17, 24, 0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#00d4ff"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-6">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold">
                  BTC
                </div>
                <div>
                  <p className="font-medium">Bitcoin</p>
                  <p className="text-sm text-gray-400">0.5234 BTC</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$22,634</p>
                <p className="text-sm text-emerald-400">+5.2%</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm font-bold">
                  ETH
                </div>
                <div>
                  <p className="font-medium">Ethereum</p>
                  <p className="text-sm text-gray-400">8.5000 ETH</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$20,876</p>
                <p className="text-sm text-emerald-400">+3.8%</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-sm font-bold">
                  SOL
                </div>
                <div>
                  <p className="font-medium">Solana</p>
                  <p className="text-sm text-gray-400">48.2500 SOL</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$4,746</p>
                <p className="text-sm text-rose-400">-1.2%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trades Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Trades</h2>
            <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
              View All →
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pair</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Price</th>
                <th>Profit/Loss</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentTrades.map((trade) => (
                <tr key={trade.id} className="group">
                  <td>
                    <span className="font-medium">{trade.pair}</span>
                  </td>
                  <td>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      trade.type === 'buy' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {trade.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="font-mono">{trade.amount}</td>
                  <td className="font-mono">{trade.price}</td>
                  <td className={trade.profit.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}>
                    {trade.profit}
                  </td>
                  <td className="text-gray-400">{trade.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
