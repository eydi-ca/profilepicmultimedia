import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../lib/authService.js';

export default function Verify() {
  const [otp, setOtp] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email; // Get email from the Signup navigation

  const handleVerify = async (e) => {
    e.preventDefault();
    const { error } = await authService.verifyOTP(email, otp);
    
    if (error) {
      alert(error.message);
    } else {
      alert("Verification successful! Please log in.");
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleVerify} className="p-8 bg-white shadow-md rounded-lg w-96 text-center">
        <h2 className="text-2xl font-bold mb-2">Check your email</h2>
        <p className="text-sm text-gray-500 mb-6">We sent a code to {email}</p>
        <input 
          type="text" placeholder="Enter 6-digit code" required 
          className="w-full p-3 mb-4 border rounded text-center text-2xl tracking-widest"
          onChange={(e) => setOtp(e.target.value)}
        />
        <button className="w-full bg-green-600 text-white py-2 rounded">Verify Account</button>
      </form>
    </div>
  );
}