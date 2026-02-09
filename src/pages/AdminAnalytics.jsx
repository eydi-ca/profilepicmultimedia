import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MousePointer2, ShoppingBag, Zap, Activity } from 'lucide-react';
// FIXED: Using consolidated dummy files
import { statsData, businessTrends } from '../data/dummyAnalytics';
import { dummyTransactions } from '../data/dummyTransactions';

export default function AdminAnalytics() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Top Row: Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat) => (
          <div key={stat.id} className="bg-white p-6 rounded-l shadow-soft border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-m">
              {stat.icon === 'dollar' ? <ShoppingBag size={20}/> : <MousePointer2 size={20}/>}
            </div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">{stat.title}</p>
              <h4 className="text-2xl font-bold text-text-main">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Middle Row: Main Trend Chart */}
      <div className="bg-white p-10 rounded-l shadow-soft border border-gray-100">
        <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
          <Zap size={18} className="text-accent" /> Business Trends
        </h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={businessTrends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A3AED0', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#A3AED0', fontSize: 12}} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Legend iconType="circle" />
              <Line type="monotone" name="Revenue" dataKey="revenue" stroke="#0A142D" strokeWidth={3} dot={{ r: 6 }} />
              <Line type="monotone" name="Visits" dataKey="visits" stroke="#CE6826" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Bottom Row: Activity Feed */}
      <div className="bg-white p-8 rounded-l shadow-soft border border-gray-100">
        <h3 className="text-lg font-bold text-text-main mb-6 flex items-center gap-2">
          <Activity size={18} className="text-primary" /> Recent Transactions
        </h3>
        <div className="space-y-4">
          {dummyTransactions.slice(0, 3).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 bg-bg-body rounded-m border border-transparent hover:border-gray-100 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <p className="text-sm font-medium text-text-main">
                  <span className="font-bold">{tx.profiles?.full_name || 'Customer'}</span> purchased {tx.purchase_type.replace('_', ' ')}
                </p>
              </div>
              <span className="text-xs font-mono text-text-secondary">₱{tx.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}