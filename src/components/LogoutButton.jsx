import { useNavigate } from 'react-router-dom';
import { authService } from '../lib/authService';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await authService.signOut();
    if (error) {
      alert("Error logging out: " + error.message);
    } else {
      // Clear any local state and send the user back to the login page
      navigate('/login');
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    >
      <LogOut size={18} />
      <span>Logout</span>
    </button>
  );
}