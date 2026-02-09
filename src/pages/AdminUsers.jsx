import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ChevronLeft, ChevronRight, Edit2, Trash2, Search } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 5;
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchUsers() {
      setIsLoadingUsers(true);
      
      const { data: profileData, count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .range(page * pageSize, (page + 1) * pageSize - 1)
        .order('created_at', { ascending: false });

      if (!error) {
        setUsers(profileData || []);
        setTotalCount(count || 0);
      }
      setIsLoadingUsers(false);
    }

    fetchUsers();
  }, [page]); // This effect now safely only triggers when the page number changes

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="bg-bg-card rounded-l shadow-soft overflow-hidden border border-gray-100">
      {/* Header & Search */}
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-white">
        <h2 className="text-xl font-bold text-text-main">User List ({totalCount})</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-text-secondary" size={18} />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="pl-10 pr-4 py-2 bg-bg-body border-none rounded-m text-sm focus:ring-2 focus:ring-primary outline-none w-64"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-text-secondary text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-8 py-4">ID</th>
              <th className="px-8 py-4">Name</th>
              <th className="px-8 py-4">Email</th>
              <th className="px-8 py-4">Role</th>
              <th className="px-8 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoadingUsers ? (
              <tr>
                <td colSpan="5" className="px-8 py-10 text-center text-text-secondary italic">
                  Loading users...
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-4 text-text-secondary font-mono text-xs">#{index + 1 + (page * pageSize)}</td>
                  <td className="px-8 py-4 font-bold text-text-main">{user.full_name}</td>
                  <td className="px-8 py-4 text-text-secondary">{user.email}</td>
                  <td className="px-8 py-4 uppercase text-[10px] font-bold">{user.role}</td>
                  <td className="px-8 py-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-2 text-text-secondary hover:text-primary"><Edit2 size={16} /></button>
                      <button className="p-2 text-text-secondary hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="p-6 bg-white border-t border-gray-50 flex justify-between items-center">
        <p className="text-sm text-text-secondary font-medium">
          Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, totalCount)} of {totalCount}
        </p>
        <div className="flex gap-2">
          <button 
            disabled={page === 0}
            onClick={() => setPage(prev => prev - 1)}
            className="p-2 rounded-m border border-gray-100 hover:bg-gray-50 disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            disabled={page >= totalPages - 1}
            onClick={() => setPage(prev => prev + 1)}
            className="p-2 rounded-m border border-gray-100 hover:bg-gray-50 disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}