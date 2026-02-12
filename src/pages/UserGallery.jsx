import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ImageIcon, Loader2, Download, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUserGallery() {
      // 1. Get the authenticated user's session
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login'); // Protection: kick out if not logged in
        return;
      }

      // 2. Fetch the user's name from their profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      
      setFullName(profile?.full_name || 'Client');

      // 3. List photos in the folder named after the user's ID
      const { data, error } = await supabase.storage
        .from('client-galleries')
        .list(user.id);

      if (!error && data) {
        // 4. Map the filenames to public URLs
        const urls = data.map(file => ({
          name: file.name,
          url: supabase.storage
            .from('client-galleries')
            .getPublicUrl(`${user.id}/${file.name}`).data.publicUrl
        }));
        setImages(urls);
      }
      setLoading(false);
    }

    loadUserGallery();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-primary" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Client Header */}
      <header className="bg-white border-b border-gray-100 p-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hello, {fullName}!</h1>
            <p className="text-sm text-gray-500">Your professional gallery from Profilepic Multimedia</p>
          </div>
          <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
            <LogOut size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {images.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <ImageIcon className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">No photos found in your gallery yet.</p>
          </div>
        ) : (
          /* The Responsive Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((img, index) => (
              <div key={index} className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <img src={img.url} alt={img.name} className="w-full aspect-[3/4] object-cover" loading="lazy" />
                
                {/* Overlay with Download */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <a href={img.url} download className="w-full bg-white text-gray-800 py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                    <Download size={18} /> Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}