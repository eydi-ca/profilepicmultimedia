import { useState } from 'react';
import { dummyPackages } from '../data/dummyMarketing';
import { Tag, Edit3, Save, X, Plus, Package } from 'lucide-react';

export default function AdminPackages() {
  const [packages, setPackages] = useState(dummyPackages);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // FIXED: Now uses both 'id' and 'setPackages' to update the local state
  const handleSave = (id) => {
    const updatedPackages = packages.map(pkg => 
      pkg.id === id ? { ...pkg, name: editValue } : pkg
    );
    
    setPackages(updatedPackages); // Redline fix: setPackages is now used
    setEditingId(null);
  };

  const startEditing = (pkg) => {
    setEditingId(pkg.id);
    setEditValue(pkg.name);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Package Management</h2>
          <p className="text-text-secondary text-sm">Update prices and credit amounts for your digital products.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-m font-bold flex items-center gap-2 hover:bg-primary-light transition-all shadow-soft">
          <Plus size={18} /> Create New Package
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white p-6 rounded-l shadow-soft border border-gray-100 flex items-center justify-between group hover:border-accent transition-all">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-orange-50 text-accent rounded-m">
                <Tag size={24} />
              </div>
              <div>
                {editingId === pkg.id ? (
                  <input 
                    type="text"
                    className="text-lg font-bold text-text-main bg-bg-body border-none rounded px-2 py-1 outline-none focus:ring-1 focus:ring-accent"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                ) : (
                  <h4 className="text-lg font-bold text-text-main">{pkg.name}</h4>
                )}
                <p className="text-sm text-text-secondary">{pkg.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-right">
                <p className="text-xs font-bold text-text-secondary uppercase">Price</p>
                <p className="text-xl font-bold text-primary">₱{pkg.price.toLocaleString()}</p>
              </div>
              
              <div className="text-right min-w-[120px]">
                <p className="text-xs font-bold text-text-secondary uppercase">Credits</p>
                <p className="text-sm font-bold text-text-main">
                   {pkg.credits === null ? "Full Unlock" : `${pkg.credits} Credits`}
                </p>
              </div>

              <div className="flex gap-2">
                {editingId === pkg.id ? (
                  <>
                    <button onClick={() => handleSave(pkg.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-m transition-colors">
                      <Save size={20}/>
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-2 text-red-600 hover:bg-red-50 rounded-m transition-colors">
                      <X size={20}/>
                    </button>
                  </>
                ) : (
                  <button onClick={() => startEditing(pkg)} className="p-2 text-text-secondary hover:bg-gray-50 rounded-m opacity-0 group-hover:opacity-100 transition-all">
                    <Edit3 size={20}/>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}