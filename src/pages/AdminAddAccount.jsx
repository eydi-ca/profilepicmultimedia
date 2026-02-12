import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  UserPlus, Mail, Lock, Package, 
  Loader2, CheckCircle, AlertCircle, User, QrCode, Printer 
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function AdminAddAccount() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [registeredDetails, setRegisteredDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    package_id: ''
  });

  // Helper: Generates a semi-dynamic password based on email
  const generateTempPassword = (email) => {
    if (!email || !email.includes('@')) return "Welcome2026!";
    
    // Get the part before the '@'
    const prefix = email.split('@')[0].toLowerCase();
    
    // If the prefix is too short, we'll use more of it or pad it
    const safePrefix = prefix.length >= 4 ? prefix.substring(0, 4) : prefix.padEnd(4, 'x');
    const year = new Date().getFullYear();
    
    return `${safePrefix}${year}!`; // e.g., "mail2026!" is 9 characters
  };

  useEffect(() => {
    async function loadPackages() {
      const result = await supabase
        .from('packages')
        .select('id, name, price')
        .order('price', { ascending: true });
      
      if (result.error) {
        setError("Failed to load packages: " + result.error.message);
        return;
      }

      if (result.data) {
        setPackages(result.data);
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

    const finalPassword = generateTempPassword(formData.email);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: finalPassword,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        full_name: formData.full_name.trim(),
        credits: formData.package_id ? parseInt(formData.package_id) : 0 
      })
      .eq('id', authData.user.id);

    if (profileError) {
      setError(profileError.message);
    } else {
      const loginLink = `${window.location.origin}/login?email=${encodeURIComponent(formData.email)}`;
      
      // Store details here so they stay on the Success Card
      setRegisteredDetails({
        email: formData.email,
        password: finalPassword,
        link: loginLink
      });
      
      setQrValue(loginLink);
      setSuccess(true);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setSuccess(false);
    setFormData({ email: '', password: '', full_name: '', package_id: '' });
  };

 return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="bg-white rounded-l shadow-soft p-10 border border-gray-50 animate-in fade-in duration-500">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-50 text-primary rounded-m"><UserPlus size={24} /></div>
          <div>
            <h2 className="text-2xl font-bold text-text-main tracking-tight">Register New Client</h2>
            <p className="text-sm text-text-secondary font-medium">Onboard a client to Profilepic Multimedia.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-m flex items-center gap-2 text-xs font-bold animate-shake">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {!success ? (
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* FIXED: Input type changed to text for Full Name */}
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

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                  <Mail size={14} /> Email Address*
                </label>
                <input 
                  required type="email" 
                  className="w-full px-4 py-3 bg-bg-body rounded-m focus:ring-2 focus:ring-accent outline-none font-medium border border-transparent focus:border-accent transition-all" 
                  value={formData.email} 
                  onChange={(e) => {
                    const newEmail = e.target.value;
                    setFormData({
                      ...formData, 
                      email: newEmail,
                      password: generateTempPassword(newEmail) 
                    });
                  }} 
                  placeholder="client@gmail.com" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                <Package size={14} /> Assign Starting Package
              </label>
              <select 
                className="w-full px-4 py-3 bg-bg-body rounded-m focus:ring-2 focus:ring-accent outline-none font-bold text-sm cursor-pointer border border-transparent focus:border-accent transition-all"
                value={formData.package_id}
                onChange={(e) => setFormData({...formData, package_id: e.target.value})}
              >
                <option value="0">No Credits (0)</option>
                {packages.map(pkg => (
                  <option key={pkg.id} value={pkg.price > 4000 ? 50 : 25}> 
                    {pkg.name} — {pkg.price > 4000 ? '50 Credits' : '25 Credits'}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
                <Lock size={14} /> Generated Temporary Password
              </label>
              <input 
                readOnly type="text" 
                className="w-full px-4 py-3 bg-gray-50 rounded-m font-mono text-sm border border-gray-100 text-primary font-bold" 
                value={formData.password} 
              />
              <p className="text-[9px] font-medium text-text-secondary">Password formula: First 4 of email + {new Date().getFullYear()} + !</p>
            </div>

            <button 
              disabled={loading} 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 rounded-m shadow-soft flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
              {loading ? "Registering..." : "Generate Client Access"}
            </button>
          </form>
        ) : (
          <div className="animate-in zoom-in-95 duration-300 text-center space-y-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-text-main">Registration Successful</h3>
              <p className="text-sm text-text-secondary">Client can now log in using the details below.</p>
            </div>

            {/* THE QR ACCESS CARD */}
            <div className="bg-bg-body p-8 rounded-l border-2 border-dashed border-gray-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                <div className="flex flex-col items-center space-y-4">
                   <div className="p-3 bg-white rounded-m shadow-sm border border-gray-100">
                     <QRCodeSVG value={qrValue} size={150} />
                   </div>
                   <div>
                     <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">Magic Login Link</p>
                     <p className="text-xs font-bold text-text-main break-all max-w-xs">{qrValue}</p>
                   </div>
                   {/* FIXED: Grid now correctly reads from registeredDetails */}
                   <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-gray-200/50">
                     <div className="text-left">
                       <p className="text-[9px] font-bold text-text-secondary uppercase">Email</p>
                       <p className="text-xs font-bold text-text-main">{registeredDetails?.email}</p>
                     </div>
                     <div className="text-left">
                       <p className="text-[9px] font-bold text-text-secondary uppercase">Temp Password</p>
                       <p className="text-xs font-bold text-primary font-mono">{registeredDetails?.password}</p>
                     </div>
                   </div>
                </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => window.print()} 
                className="flex-1 px-6 py-3 bg-white border border-gray-200 rounded-m font-bold text-text-secondary hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Printer size={18} /> Print Card
              </button>
              <button 
                onClick={resetForm}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-m font-bold shadow-soft hover:bg-primary-light"
              >
                Add Another Client
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}