// src/components/LogoutButton.jsx
import { LogOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function LogoutButton({ collapsed }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login'; 
  };

  return (
    <button 
      onClick={handleLogout}
      className={`flex items-center text-red-500 hover:bg-red-50 rounded-m transition-all font-bold text-sm group ${
        collapsed ? 'justify-center w-10 h-10 p-0' : 'w-full px-4 py-3 gap-4'
      }`}
    >
      <LogOut size={20} />
      {!collapsed && <span>Logout</span>}
    </button>
  );
}