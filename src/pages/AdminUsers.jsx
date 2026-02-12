import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  Search, Filter, Mail, Calendar, Shield, 
  User, Loader2, RefreshCw, X, Save, AlertCircle,
  MoreVertical, Trash2, Edit2, Coins, Power
} from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Menu State for the 3-dot dropdown
  const [activeMenu, setActiveMenu] = useState(null); 

  // Modal & Edit States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setUsers(data);
      setLoading(false);
    }
    fetchUsers();
  }, [refreshKey]);

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
    setFormError("");
    setActiveMenu(null);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure? This will permanently remove the user profile.")) {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (!error) setUsers(users.filter(u => u.id !== id));
      setActiveMenu(null);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsSaving(true);

    if (!editingUser.full_name?.trim()) {
      setFormError("Full name is required.");
      setIsSaving(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ 
        full_name: editingUser.full_name.trim(),
        role: editingUser.role,
        credits: editingUser.credits, // Manual credit adjustment
        is_active: editingUser.is_active // Account status toggle
      })
      .eq('id', editingUser.id);

    if (error) {
      setFormError(error.message);
    } else {
      setUsers(users.map(u => u.id === editingUser.id ? { ...editingUser } : u));
      setIsModalOpen(false);
    }
    setIsSaving(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="relative space-y-6 animate-in fade-in duration-500">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-l shadow-soft border border-gray-50">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input 
            type="text" placeholder="Search by name or email..." 
            className="w-full pl-12 pr-4 py-3 bg-bg-body rounded-m outline-none focus:ring-2 focus:ring-accent font-medium"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            className="px-6 py-3 bg-bg-body rounded-m outline-none font-bold text-xs uppercase tracking-wider text-text-main cursor-pointer"
            value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="customer">Clients</option>
            <option value="staff">Staff</option>
          </select>
          <button onClick={() => setRefreshKey(prev => prev + 1)} className="p-3 bg-bg-body hover:bg-gray-100 rounded-m transition-all">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-l shadow-soft border border-gray-50 overflow-hidden">
        {loading ? (
          <div className="flex justify-center p-24 text-primary"><Loader2 className="animate-spin" size={40} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase tracking-widest text-text-secondary font-black">
                <tr>
                  <th className="px-8 py-5">Profile</th>
                  <th className="px-8 py-5">Full Name</th>
                  <th className="px-8 py-5">Credits</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5">Joined</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/30 transition-colors">
                    {/* NEW: STATUS PULSE */}
                    <td className="px-8 py-5 text-center">
                      <div className="w-10 h-10 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold text-sm mx-auto">
                        {user.full_name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="font-bold text-text-main text-sm">{user.full_name}</p>
                      <p className="text-xs text-text-secondary italic opacity-80">{user.email}</p>
                    </td>

                    {/* NEW: CREDIT DISPLAY */}
                    <td className="px-8 py-5 font-bold text-sm text-primary flex items-center gap-2 mt-4">
                      <Coins size={14} className="opacity-50" /> {user.credits ?? 0}
                    </td>

                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs font-semibold text-text-secondary">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>

                    {/* REFINED: 3-DOT ACTION MENU */}
                    <td className="px-8 py-5 text-right relative">
                      <button 
                        onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                        className="p-2 text-gray-400 hover:text-text-main transition-colors hover:bg-gray-100 rounded-m"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeMenu === user.id && (
                        <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-white border border-gray-100 shadow-xl rounded-m py-2 z-10 min-w-[120px] animate-in fade-in zoom-in-95 duration-100">
                          <button onClick={() => handleEditClick(user)} className="w-full px-4 py-2 text-left text-xs font-bold text-text-main hover:bg-gray-50 flex items-center gap-2">
                            <Edit2 size={14} className="text-primary" /> Edit Profile
                          </button>
                          <button onClick={() => handleDeleteUser(user.id)} className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2">
                            <Trash2 size={14} /> Delete User
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-main/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-l shadow-2xl border border-gray-100 p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-text-main">Adjust Account</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary hover:text-red-500 transition-colors"><X size={20}/></button>
            </div>

            {formError && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-m flex items-center gap-2 text-xs font-bold">
                <AlertCircle size={16} /> {formError}
              </div>
            )}

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Full Name*</label>
                <input 
                  type="text" className="w-full px-4 py-3 bg-bg-body rounded-m outline-none font-medium"
                  value={editingUser.full_name}
                  onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
                />
              </div>

              {/* NEW: CREDIT ADJUSTMENT */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase">Manual Credit Adjustment</label>
                <div className="relative">
                  <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-primary opacity-50" size={16} />
                  <input 
                    type="number" className="w-full pl-10 pr-4 py-3 bg-bg-body rounded-m outline-none font-bold text-primary"
                    value={editingUser.credits ?? 0}
                    onChange={(e) => setEditingUser({...editingUser, credits: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              {/* NEW: STATUS TOGGLE */}
              <div className="p-4 bg-gray-50 rounded-m flex items-center justify-between border border-gray-100">
                <div>
                  <p className="text-xs font-bold text-text-main">Account Access</p>
                  <p className="text-[10px] font-bold text-text-secondary uppercase">
                    {editingUser.is_active !== false ? "Active (Can Login)" : "Disabled (No Access)"}
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => setEditingUser({...editingUser, is_active: !editingUser.is_active})}
                  className={`p-2 rounded-full transition-all ${editingUser.is_active !== false ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}
                >
                  <Power size={20} />
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text-secondary uppercase">User Role</label>
                <select 
                  className="w-full px-4 py-3 bg-bg-body rounded-m outline-none font-medium"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                >
                  <option value="customer">Client</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="submit" disabled={isSaving} className="flex-1 bg-primary text-white font-bold py-3 rounded-m shadow-soft hover:bg-primary-light flex items-center justify-center gap-2 transition-all">
                  {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                  {isSaving ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}