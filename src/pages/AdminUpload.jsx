import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Upload, FileImage, X } from 'lucide-react';

export default function AdminUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const startUpload = async () => {
    if (!file) return;
    setLoading(true);
    
    // 1. Logic to upload to 'client-galleries' bucket
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('client-galleries')
      .upload(`raw/${fileName}`, file);

    if (error) {
      alert(error.message);
    } else {
      // 2. Logic to save reference to 'gallery_files' table
      await supabase.from('gallery_files').insert({
        storage_path: data.path,
        filename: file.name
      });
      alert("Photo added to gallery successfully!");
      setFile(null);
    }
    setLoading(false);
  };

  return (
    <div className="bg-bg-card rounded-l shadow-soft p-10 max-w-2xl border border-gray-50">
      <h2 className="text-xl font-bold text-text-main mb-6">Upload New Media</h2>
      
      <div className="border-2 border-dashed border-text-secondary rounded-m p-12 flex flex-col items-center justify-center bg-gray-50/50">
        {file ? (
          <div className="flex flex-col items-center gap-4">
            <FileImage size={48} className="text-accent" />
            <p className="font-medium text-text-main">{file.name}</p>
            <button onClick={() => setFile(null)} className="text-red-500 text-sm">Remove</button>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center">
            <Upload size={40} className="text-text-secondary mb-4" />
            <span className="text-text-main font-medium">Click to select or drag and drop</span>
            <span className="text-text-secondary text-sm mt-1">PNG, JPG up to 10MB</span>
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
        )}
      </div>

      <button
        onClick={startUpload}
        disabled={!file || loading}
        className="mt-8 w-full bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded-m shadow-soft transition-all disabled:opacity-50"
      >
        {loading ? "Processing Upload..." : "Upload to Gallery"}
      </button>
    </div>
  );
}