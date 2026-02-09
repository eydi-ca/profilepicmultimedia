import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { UserPlus, Mail, Lock, Coins, ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminAddAccount() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'customer',
    credits: 0
  });

  const handleAddAccount = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // FIX: We rename 'data' to 'newUserData' right here.
      // This stops the redline because 'data' is no longer being declared.
      const { data: newUserData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { 
            full_name: formData.fullName,
            role: formData.role,
            credits: formData.credits
          }
        }
      });

      if (authError) throw authError;
      
      console.log("Success! New User ID:", newUserData?.user?.id);
      alert(`Account created successfully for ${formData.fullName}!`);
      
      setFormData({ email: '', password: '', fullName: '', role: 'customer', credits: 0 });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-bg-card rounded-xl shadow-soft p-10 border border-gray-50">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/5 rounded-m text-primary">
            <UserPlus size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-main">Create New Account</h2>
            <p className="text-text-secondary text-sm">Register a new client or staff member manually.</p>
          </div>
        </div>

        <form onSubmit={handleAddAccount} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main px-1">Full Name</label>
              <div className="relative">
                <input 
                  required
                  type="text"
                  placeholder="Juan Dela Cruz"
                  className="w-full pl-4 pr-4 py-3 bg-bg-body border-none rounded-m text-sm focus:ring-2 focus:ring-accent outline-none transition-all"
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  value={formData.fullName}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main px-1">Email Address</label>
              <input 
                required
                type="email"
                placeholder="client@email.com"
                className="w-full px-4 py-3 bg-bg-body border-none rounded-m text-sm focus:ring-2 focus:ring-accent outline-none transition-all"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                value={formData.email}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Initial Credits */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main px-1 flex items-center gap-2">
                <Coins size={14} className="text-accent" /> Initial Credits
              </label>
              <input 
                type="number"
                placeholder="0"
                className="w-full px-4 py-3 bg-bg-body border-none rounded-m text-sm focus:ring-2 focus:ring-accent outline-none transition-all"
                onChange={(e) => setFormData({...formData, credits: parseInt(e.target.value)})}
                value={formData.credits}
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main px-1 flex items-center gap-2">
                <ShieldCheck size={14} className="text-primary" /> Account Role
              </label>
              <select 
                className="w-full px-4 py-3 bg-bg-body border-none rounded-m text-sm focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                value={formData.role}
              >
                <option value="customer">Customer</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-main px-1">Temporary Password</label>
            <input 
              required
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-bg-body border-none rounded-m text-sm focus:ring-2 focus:ring-accent outline-none transition-all"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              value={formData.password}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 rounded-m shadow-soft transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : <UserPlus size={20} />}
            {loading ? "Creating Account..." : "Confirm & Register User"}
          </button>
        </form>
      </div>
    </div>
  );
}