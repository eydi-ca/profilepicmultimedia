import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  UserPlus, Mail, Lock, Package, 
  Loader2, CheckCircle, AlertCircle, User 
} from 'lucide-react';

export default function AdminAddAccount() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    email: '',
    password: 'TemporaryPassword123!', // Fixed starting password for staff/clients
    full_name: '',
    package_id: ''
  });

  // Pattern: Function defined inside useEffect to avoid linting issues
  useEffect(() => {
    async function loadPackages() {
      // 1. We capture the whole 'result' object to avoid naming conflicts with 'error'
      const result = await supabase
        .from('packages')
        .select('id, name, price')
        .order('price', { ascending: true });
      
      // 2. Check for errors using the result object
      if (result.error) {
        setError("Failed to load packages: " + result.error.message);
        return; // Stop execution if there is an error
      }

      // 3. If data exists, update the state
      if (result.data) {
        setPackages(result.data);
        
        // 4. Force "No Package" as the default starting state
        setFormData(prev => ({ ...prev, package_id: "" }));
      }
    }
    
    loadPackages();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // 1. Create the Auth User in Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // 2. Link the Profile to the chosen Package
    // Note: This assumes your 'profiles' table has a 'package_id' column
    const { error: profileError } = await supabase
    .from('profiles')
    .update({ 
      full_name: formData.full_name.trim(),
      // If empty string, send null to the database
      package_id: formData.package_id === "" ? null : formData.package_id 
    })
    .eq('id', authData.user.id);

    if (profileError) {
      setError(profileError.message);
    } else {
      setSuccess(true);
      // Clear form except for default package
      setFormData({ 
        email: '', 
        password: 'TemporaryPassword123!', 
        full_name: '', 
        package_id: packages[0]?.id || '' 
      });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-l shadow-soft p-10 border border-gray-50 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-50 text-primary rounded-m"><UserPlus size={24} /></div>
        <div>
          <h2 className="text-2xl font-bold text-text-main tracking-tight">Register New Client</h2>
          <p className="text-sm text-text-secondary font-medium">Create an account for the Profilepic Multimedia platform.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-m flex items-center gap-2 text-xs font-bold animate-shake">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-m flex items-center gap-2 text-xs font-bold">
          <CheckCircle size={16} /> Client registered successfully!
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> Full Name*
            </label>
            <input 
              required type="text" 
              className="w-full px-4 py-3 bg-bg-body rounded-m focus:ring-2 focus:ring-accent outline-none font-medium border border-transparent focus:border-accent transition-all" 
              value={formData.full_name} 
              onChange={(e) => setFormData({...formData, full_name: e.target.value})} 
              placeholder="Juan Dela Cruz" 
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
              <Mail size={14} /> Email Address*
            </label>
            <input 
              required type="email" 
              className="w-full px-4 py-3 bg-bg-body rounded-m focus:ring-2 focus:ring-accent outline-none font-medium border border-transparent focus:border-accent transition-all" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
              placeholder="client@example.com" 
            />
          </div>
        </div>

        {/* Package Dropdown */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
            <Package size={14} /> Assign Starting Package
          </label>
          <select 
            className="w-full px-4 py-3 bg-bg-body rounded-m focus:ring-2 focus:ring-accent outline-none font-bold text-sm cursor-pointer border border-transparent focus:border-accent transition-all"
            value={formData.package_id}
            onChange={(e) => setFormData({...formData, package_id: e.target.value})}
          >
            <option value="">No Package Assigned</option>
            {packages.map(pkg => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.name} — ₱{pkg.price.toLocaleString()}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-text-secondary italic">This will set the initial credit amount or gallery unlock status for the user.</p>
        </div>

        {/* Temporary Password */}
        <div className="space-y-2 opacity-70">
          <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
            <Lock size={14} /> Default Password
          </label>
          <div className="relative">
            <input 
              disabled type="text" 
              className="w-full px-4 py-3 bg-gray-100 rounded-m cursor-not-allowed font-mono text-sm border border-gray-200" 
              value={formData.password} 
            />
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
          <p className="text-[10px] font-medium text-text-secondary">Inform the client to change this password after their first successful login.</p>
        </div>

        <button 
          disabled={loading} 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 rounded-m shadow-soft flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
          {loading ? "Registering Client..." : "Create Client Account"}
        </button>
      </form>
    </div>
  );
}