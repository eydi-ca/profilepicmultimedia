import { useState, useEffect } from 'react'; // Added useState and useEffect
import { Image, User, LayoutDashboard } from 'lucide-react';
import { supabase } from './lib/supabaseClient'; // Ensure this path is correct
import LogoutButton from "./components/LogoutButton";

function App() {
  // 1. Initialize state (profile starts as null)
  const [profile, setProfile] = useState(null);

  // 2. Fetch the logged-in user's profile data
  useEffect(() => {
    // We create an internal async function because 
    // useEffect itself cannot be async
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // This is where your { data, error } lives
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error loading profile:", error.message);
        } else if (data) {
          setProfile(data);
        }
      }
    }

    getProfile();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Simple Navigation Bar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <Image size={28} />
          <span>BizGallery</span>
        </div>
        
        <div className="flex gap-6 items-center text-gray-600">
          <button className="flex items-center gap-1 hover:text-indigo-600">
            <LayoutDashboard size={20} />
            <span>Admin</span>
          </button>
          <button className="flex items-center gap-1 hover:text-indigo-600">
            <User size={20} />
            <span>Profile</span>
          </button>
          <LogoutButton />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to the Gallery</h1>
          <p className="text-gray-500 mb-4">Manage your business assets efficiently.</p>
          
          <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border w-fit">
            {/* profile?.full_name handles the 'undefined' state safely */}
            <span className="text-sm font-medium text-gray-700">
               Logged in as: <span className="text-indigo-600">{profile?.full_name || 'Loading...'}</span>
            </span>
            <div className="h-4 w-[1px] bg-gray-300"></div>
            
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
            <p className="text-gray-400">No images yet</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;