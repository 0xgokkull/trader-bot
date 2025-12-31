import {
  TrendingUp,
  DollarSign,
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// ============================================
// DATA
// ============================================
const performanceData = [
  { name: 'Jan', value: 24000 },
  { name: 'Feb', value: 28000 },
  { name: 'Mar', value: 25000 },
  { name: 'Apr', value: 32000 },
  { name: 'May', value: 38000 },
  { name: 'Jun', value: 42000 },
  { name: 'Jul', value: 48000 },
];

const recentTrades = [
  { id: 1, pair: 'BTC/USDT', type: 'buy', price: '$43,256.00', profit: '+$142.50', time: '2 min ago' },
  { id: 2, pair: 'ETH/USDT', type: 'sell', price: '$2,456.00', profit: '+$89.20', time: '15 min ago' },
  { id: 3, pair: 'SOL/USDT', type: 'buy', price: '$98.45', profit: '-$12.30', time: '32 min ago' },
  { id: 4, pair: 'MATIC/USDT', type: 'sell', price: '$0.89', profit: '+$45.00', time: '1 hr ago' },
];

// ============================================
// COMPONENTS
// ============================================
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
    <div className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${gradient} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
          isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
        }`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

// ============================================
// DASHBOARD PAGE
// ============================================
function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-400 text-sm">Your trading overview</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Balance"
          value="$48,256.80"
          change="+12.5%"
          isPositive={true}
          icon={DollarSign}
          gradient="bg-gradient-to-br from-cyan-400 to-cyan-600"
        />
        <MetricCard
          title="Profit/Loss"
          value="+$8,432.50"
          change="+8.2%"
          isPositive={true}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-emerald-400 to-emerald-600"
        />
        <MetricCard
          title="Active Bots"
          value="5"
          change="+2"
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

      {/* Chart */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-bold mb-4">Portfolio Performance</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 17, 24, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Area type="monotone" dataKey="value" stroke="#00d4ff" strokeWidth={2} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Trades */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-bold mb-4">Recent Trades</h2>
        <div className="space-y-2">
          {recentTrades.map((trade) => (
            <div key={trade.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  trade.type === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {trade.type.toUpperCase()}
                </span>
                <span className="font-medium">{trade.pair}</span>
              </div>
              <div className="text-right">
                <span className={trade.profit.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}>
                  {trade.profit}
                </span>
                <span className="text-gray-500 text-xs ml-2">{trade.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
