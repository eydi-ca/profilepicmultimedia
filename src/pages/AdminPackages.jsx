import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  Edit3, Save, X, Plus, Trash2, 
  Package as PackageIcon, ChevronLeft, ChevronDown, AlertCircle, Loader2 
} from 'lucide-react';

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' or 'edit'
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ 
    id: '', 
    name: '', 
    price: '', 
    credit_amount: '5', 
    description: '' 
  });

  // Pattern: Logic inside useEffect to avoid 'useCallback' and linting redlines
  useEffect(() => {
    async function fetchPackages() {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('packages')
        .select('*')
        .order('price', { ascending: true });

      if (fetchError) {
        setError("Could not load packages from database.");
      } else {
        setPackages(data);
      }
      setLoading(false);
    }

    fetchPackages();
  }, [view]); // Re-fetch when switching back to 'list' view

  const handleEdit = (pkg) => {
    setError("");
    setFormData({ 
      ...pkg, 
      price: pkg.price.toString(), 
      credit_amount: pkg.credit_amount === null ? 'null' : pkg.credit_amount.toString() 
    });
    setView('edit');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    // Restriction: No zero or negative prices
    const numericPrice = parseFloat(formData.price);
    if (numericPrice <= 0) {
      setError("Price must be a positive value greater than zero.");
      return;
    }

    // Restriction: Required fields
    if (!formData.name.trim() || !formData.description.trim()) {
      setError("Package name and description are strictly required.");
      return;
    }

    const packageToSave = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: numericPrice,
      // Map 'null' string from dropdown back to actual database NULL
      credit_amount: formData.credit_amount === 'null' ? null : parseInt(formData.credit_amount)
    };

    if (formData.id) packageToSave.id = formData.id;

    const { error: saveError } = await supabase.from('packages').upsert(packageToSave);

    if (saveError) {
      setError(saveError.message);
    } else {
      // Re-fetch everything to ensure the UI is perfectly synced with the DB
      const { data } = await supabase.from('packages').select('*').order('price', { ascending: true });
      if (data) setPackages(data);
      setView('list');
    }
  };

  const handleDelete = async (id) => {
  if (window.confirm("Are you sure? This package will be removed from the database.")) {
    // 1. Send the delete request to Supabase
    const { error: delError } = await supabase
      .from('packages')
      .delete()
      .eq('id', id);

    if (delError) {
      alert("Error deleting: " + delError.message);
    } else {
      // 2. FIXED: Immediately remove the item from the local state list
      // This removes the need for a manual page refresh.
      setPackages(prevPackages => prevPackages.filter(pkg => pkg.id !== id));
    }
  }
};

  if (view === 'edit') {
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button onClick={() => setView('list')} className="flex items-center gap-2 text-text-secondary hover:text-primary mb-6 transition-colors">
          <ChevronLeft size={20} /> Cancel and Return
        </button>

        <div className="bg-white rounded-l shadow-soft p-10 border border-gray-100">
          <h2 className="text-2xl font-bold text-text-main mb-8">
            {formData.id ? 'Edit Package Details' : 'Configure New Package'}
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-m flex items-center gap-3 text-sm font-medium">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main uppercase tracking-wider">Package Name*</label>
              <input required type="text" className="w-full px-4 py-3 bg-bg-body rounded-m focus:ring-2 focus:ring-accent outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main uppercase tracking-wider">Price (₱)*</label>
                <input required type="number" step="0.01" min="0.01" className="w-full px-4 py-3 bg-bg-body rounded-m focus:ring-2 focus:ring-accent outline-none font-bold text-primary" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-main uppercase tracking-wider">Credit Inclusion</label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 bg-bg-body rounded-m focus:ring-2 focus:ring-accent outline-none appearance-none cursor-pointer"
                    value={formData.credit_amount}
                    onChange={(e) => setFormData({...formData, credit_amount: e.target.value})}
                  >
                    <option value="5">5 Credits</option>
                    <option value="10">10 Credits</option>
                    <option value="50">50 Credits</option>
                    <option value="100">100 Credits</option>
                    <option value="null">Full Gallery Unlock</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-main uppercase tracking-wider">Description*</label>
              <textarea required rows="3" className="w-full px-4 py-3 bg-bg-body rounded-m focus:ring-2 focus:ring-accent outline-none" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="What's included in this pack?" />
            </div>

            <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-m shadow-soft hover:bg-primary-light transition-all flex items-center justify-center gap-2">
              <Save size={20} /> {formData.id ? 'Update Package' : 'Create Package'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center px-4">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Package Management</h2>
          <p className="text-text-secondary text-sm font-medium">Manage your product offerings and pricing tiers.</p>
        </div>
        <button onClick={() => { setFormData({ id: '', name: '', price: '', credit_amount: '5', description: '' }); setView('edit'); }} className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-m font-bold flex items-center gap-2 shadow-soft transition-all">
          <Plus size={18} /> New Package
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20 text-primary"><Loader2 className="animate-spin" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 px-4">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white p-6 rounded-l shadow-soft border border-gray-100 flex items-center justify-between group hover:border-accent transition-all">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-orange-50 text-accent rounded-m"><PackageIcon size={24} /></div>
                <div>
                  <h4 className="text-lg font-bold text-text-main">{pkg.name}</h4>
                  <p className="text-sm text-text-secondary max-w-md">{pkg.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-right min-w-[100px]">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Price</p>
                  <p className="text-xl font-bold text-primary">₱{pkg.price.toLocaleString()}</p>
                </div>
                <div className="text-right min-w-[120px]">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Inclusion</p>
                  <p className="text-sm font-bold text-text-main">{pkg.credit_amount === null ? "Full Unlock" : `${pkg.credit_amount} Credits`}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(pkg)} className="p-2 text-text-secondary hover:text-primary opacity-0 group-hover:opacity-100 transition-all"><Edit3 size={18}/></button>
                  <button onClick={() => handleDelete(pkg.id)} className="p-2 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}