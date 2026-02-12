import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Upload, User, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function AdminUpload() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadProgress, setUploadProgress] = useState(0);

  // 1. Load customers to populate the dropdown
  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'customer')
        .order('full_name');

      if (error) console.error("Error fetching users:", error);
      else setUsers(data || []);
    }
    fetchUsers();
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!selectedUser || files.length === 0) {
      setMessage({ type: 'error', text: 'Please select a client and at least one image.' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });
    let completed = 0;

    for (const file of files) {
      // Create a unique file path: folder_name/filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${selectedUser}/${fileName}`; // Folder is the User ID

      // 2. Upload to the 'client-galleries' bucket
      const { error: uploadError } = await supabase.storage
        .from('client-galleries')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setMessage({ type: 'error', text: `Failed to upload ${file.name}` });
      } else {
        completed++;
        setUploadProgress(Math.round((completed / files.length) * 100));
      }
    }

    if (completed === files.length) {
      setMessage({ type: 'success', text: `Successfully uploaded ${completed} images!` });
      setFiles([]);
      setUploadProgress(0);
    }
    setUploading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Upload size={24} /></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Gallery Upload</h2>
            <p className="text-sm text-gray-500 font-medium">Add new photos to a client's private gallery.</p>
          </div>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 text-sm font-bold ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
          }`}>
            {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Client Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> Select Client Gallery
            </label>
            <select 
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-transparent focus:border-indigo-500 outline-none font-bold text-sm"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Choose a client...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.full_name} ({user.email})</option>
              ))}
            </select>
          </div>

          {/* File Picker */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon size={14} /> Upload Photos
            </label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
              <input 
                type="file" multiple accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <Upload className="text-gray-300 mb-2" size={48} />
              <p className="text-sm font-bold text-gray-500">Click or drag images here</p>
              <p className="text-[10px] text-gray-400 mt-1">High-resolution JPEGs or PNGs supported</p>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {files.map((file, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-square bg-white p-1">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="preview" 
                    className="w-full h-full object-cover rounded" 
                  />
                  <button 
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Progress Bar */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase text-indigo-600">
                <span>Uploading Gallery...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}

          <button 
            disabled={uploading || files.length === 0 || !selectedUser}
            onClick={handleUpload}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
            {uploading ? `Uploading ${files.length} Images...` : "Start Upload to Gallery"}
          </button>
        </div>
      </div>
    </div>
  );
}