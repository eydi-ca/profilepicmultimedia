import { useState } from 'react';
import { authService } from '../lib/authService';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Passwords do not match");

    const { error } = await authService.signUp(formData.email, formData.password, formData.fullName);
    
    if (error) {
      alert(error.message);
    } else {
      // Redirect to verify page and pass the email in the state
      navigate('/verify', { state: { email: formData.email } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSignup} className="p-8 bg-white shadow-md rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Create Account</h2>
        <input 
          type="text" placeholder="Full Name" required 
          className="w-full p-2 mb-3 border rounded"
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
        />
        <input 
          type="email" placeholder="Email Address" required 
          className="w-full p-2 mb-3 border rounded"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="password" placeholder="Password" required 
          className="w-full p-2 mb-3 border rounded"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <input 
          type="password" placeholder="Confirm Password" required 
          className="w-full p-2 mb-3 border rounded"
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
        />
        <label className="flex items-center mb-4 text-sm">
          <input type="checkbox" required className="mr-2" />
          I agree to Terms & Conditions
        </label>
        <button className="w-full bg-indigo-600 text-white py-2 rounded">Sign Up</button>
        <p className="mt-4 text-sm">
          Already have an account? <Link to="/login" className="text-indigo-600">Login</Link>
        </p>
      </form>
    </div>
  );
}