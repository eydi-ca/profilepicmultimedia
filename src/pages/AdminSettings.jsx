import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Mail, Save, Loader2, CheckCircle } from 'lucide-react';

export default function AdminSettings() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState({ full_name: '', email: '' });

  // FIXED: Logic moved inside useEffect to prevent infinite render loops
  useEffect(() => {
    async function getAdminProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single();
        if (data) setProfile(data);
      }
    }
    getAdminProfile();
  }, []); // Empty array ensures this only runs once on mount

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: profile.full_name })
      .eq('id', user.id);

    if (error) {
      alert(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-l shadow-soft p-10 border border-gray-50">
      <div className="flex items-center gap-3 mb-8">
        <User className="text-primary" />
        <h2 className="text-2xl font-bold text-text-main">Admin Settings</h2>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-main">Full Name</label>
          <input 
            type="text"
            className="w-full px-4 py-3 bg-bg-body rounded-m focus:ring-2 focus:ring-accent outline-none"
            value={profile.full_name}
            onChange={(e) => setProfile({...profile, full_name: e.target.value})}
          />
        </div>

        <div className="space-y-2 opacity-60">
          <label className="text-sm font-semibold text-text-main flex items-center gap-2">
            <Mail size={14} /> Email (Verified)
          </label>
          <input 
            type="email" disabled className="w-full px-4 py-3 bg-gray-100 rounded-m cursor-not-allowed"
            value={profile.email} 
          />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 rounded-m shadow-soft flex items-center justify-center gap-2 transition-all">
          {loading ? <Loader2 className="animate-spin" /> : success ? <CheckCircle /> : <Save size={20} />}
          {loading ? "Saving..." : success ? "Saved Successfully" : "Update Profile"}
        </button>
      </form>
    </div>
  );
}