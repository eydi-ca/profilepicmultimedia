import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Search, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { dummyTransactions } from '../data/dummyTransactions';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      // Fetching transactions and joining with profiles
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles (full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        console.log("Using dummy data for testing...");
        setTransactions(dummyTransactions);
      } else {
        setTransactions(data);
      }
      setLoading(false);
    }
    fetchTransactions();
  }, []);

  return (
    <div className="bg-bg-card rounded-l shadow-soft overflow-hidden border border-gray-100">
      {/* Table Header */}
      <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-xl font-bold text-text-main">Transactions Overview</h2>
          <p className="text-text-secondary text-sm">Monitor revenue and payment statuses.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-m text-sm font-bold text-text-main hover:bg-gray-50 transition-all">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-text-secondary text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-8 py-4">Reference</th>
              <th className="px-8 py-4">Customer</th>
              <th className="px-8 py-4">Package</th>
              <th className="px-8 py-4">Amount</th>
              <th className="px-8 py-4 text-center">Status</th>
              <th className="px-8 py-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50/50 transition-all">
                <td className="px-8 py-5 font-mono text-xs text-text-secondary">{tx.reference_no}</td>
                <td className="px-8 py-5">
                  <p className="font-bold text-text-main">{tx.profiles?.full_name || 'Deleted User'}</p>
                  <p className="text-xs text-text-secondary">{tx.customer_email || tx.profiles?.email}</p>
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm font-medium text-text-main capitalize">{tx.purchase_type.replace('_', ' ')}</span>
                </td>
                <td className="px-8 py-5 font-bold text-text-main">₱{tx.amount.toLocaleString()}</td>
                <td className="px-8 py-5">
                  <div className="flex justify-center">
                    <StatusBadge status={tx.status} />
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-text-secondary">
                  {new Date(tx.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper component for styled status badges
function StatusBadge({ status }) {
  const styles = {
    completed: "bg-green-50 text-green-600 border-green-100",
    pending: "bg-orange-50 text-orange-600 border-orange-100",
    failed: "bg-red-50 text-red-600 border-red-100"
  };
  
  const icons = {
    completed: <CheckCircle size={12} />,
    pending: <Clock size={12} />,
    failed: <AlertCircle size={12} />
  };

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${styles[status]}`}>
      {icons[status]} {status}
    </span>
  );
}