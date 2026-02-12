import { useState, useEffect } from 'react'; // Added useEffect
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../lib/authService';
import { supabase } from '../lib/supabaseClient';
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- ONLY ADDED THIS BLOCK: CAPTURE EMAIL FROM URL ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailFromUrl = params.get('email');

    if (emailFromUrl) {
      setEmail(decodeURIComponent(emailFromUrl));
    }
  }, []);
  // -----------------------------------------------------

  const handleLogin = async (e) => {
    e.preventDefault(); 
    console.log("Login attempt started..."); 
    setLoading(true);

    try {
      const { data, error } = await authService.signIn(email, password);

      if (error) {
        console.error("Auth Error:", error.message);
        alert(error.message);
        return;
      }

      console.log("Auth successful, fetching profile for ID:", data.user.id);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error("Profile Fetch Error:", profileError.message);
        alert("Profile not found. Did you verify your email?");
      } else {
        console.log("Role found:", profile.role);
        if (profile.role === 'admin' || profile.role === 'staff') {
          navigate('/admin');
        } else {
          navigate('/home'); 
        }
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-orange p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 mt-2">Please enter your details to sign in</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="email" required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="name@business.com"
                // UPDATED: Added value={email} to allow the auto-fill to show up
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
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

        <p className="text-center text-gray-600 mt-8 text-sm">
          Don't have an account? {' '}
          <Link to="/signup" className="font-semibold text-accent hover:text-accent-hover">Register now</Link>
        </p>
      </div>
    </div>
  );
}