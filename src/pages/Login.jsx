import { useState, useEffect } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../lib/authService';
import { supabase } from '../lib/supabaseClient';
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false); 
  const [otp, setOtp] = useState(''); 

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailFromUrl = params.get('email');
    if (emailFromUrl) {
      setEmail(decodeURIComponent(emailFromUrl));
    }
  }, []);

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email: email,
      token: otp,
      type: 'signup' 
    });

    if (error) {
      alert("Invalid or expired code: " + error.message);
    } else {
      alert("Email confirmed! You can now log in.");
      setIsVerifying(false); 
      setOtp(''); 
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setLoading(true);

    try {
      const { data, error } = await authService.signIn(email, password);

      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setIsVerifying(true); // Switch to OTP UI
          setLoading(false);
          return;
        }
        alert(error.message);
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        alert("Profile not found.");
      } else {
        if (profile.role === 'admin' || profile.role === 'staff') {
          navigate('/admin');
        } else {
          navigate('/gallery'); 
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-orange p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        
        {/* Toggle Title based on state */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {isVerifying ? "Verify Email" : "Welcome Back"}
          </h2>
          <p className="text-gray-500 mt-2">
            {isVerifying ? "Enter the 6-digit code sent to your Gmail" : "Please enter your details to sign in"}
          </p>
        </div>

        {!isVerifying ? (
          /* STANDARD LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="email" required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="name@business.com"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input 
                  type="password" required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2" />
                Remember me
              </label>
              <a href="#" className="text-sm font-medium text-accent hover:text-accent-hover">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center cursor-pointer" 
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
            </button>
          </form>
        ) : (
          /* NEW: OTP VERIFICATION FORM */
          <form onSubmit={handleVerifyOTP} className="space-y-5 animate-in fade-in zoom-in-95">
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="text" required maxLength="6"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-center text-xl font-bold tracking-[0.5em]"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center" 
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Confirm Verification Code"}
            </button>

            <button 
              type="button" 
              onClick={() => setIsVerifying(false)}
              className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Back to Login
            </button>
          </form>
        )}

        <p className="text-center text-gray-600 mt-8 text-sm">
          Don't have an account? {' '}
          <Link to="/signup" className="font-semibold text-accent hover:text-accent-hover">Register now</Link>
        </p>
      </div>
    </div>
  );
}