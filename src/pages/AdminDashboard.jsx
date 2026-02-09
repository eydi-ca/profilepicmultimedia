import { useState } from 'react';
import { BarChart3, Users, Image as ImageIcon, Settings, Receipt, UserPlus, Tag } from 'lucide-react';
import LogoutButton from '../components/LogoutButton';
import AdminUpload from './AdminUpload';
import AdminUsers from './AdminUsers';
import AdminAddAccount from './AdminAddAccount';
import AdminSettings from './AdminSettings';
import AdminTransactions from './AdminTransactions';
import AdminAnalytics from './AdminAnalytics';
import AdminPackages from './AdminPackages';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');

  const menuItems = [
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={20} /> },
    { id: 'packages', label: 'Packages', icon: <Tag size={20} /> },
    { id: 'transactions', label: 'Transactions', icon: <Receipt size={20} /> },
    { id: 'add-account', label: 'Add Account', icon: <UserPlus size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  return (
    <div className="flex min-h-screen bg-bg-body">
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col shadow-soft">
        <div className="p-8">
          <img src="/logo_76bd55.png" alt="ProfilePic" className="h-10 w-auto" />
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-m transition-all font-medium ${
                activeTab === item.id 
                ? 'bg-primary text-white shadow-soft' 
                : 'text-text-secondary hover:bg-gray-50'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-8 border-t border-gray-50"><LogoutButton /></div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <p className="text-text-secondary text-sm font-medium">Dashboard / {activeTab}</p>
            <h1 className="text-3xl font-bold text-text-main capitalize">Welcome Back</h1>
          </div>
        </header>

        <div className="transition-all duration-300">
          {activeTab === 'analytics' && <AdminAnalytics />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'gallery' && <AdminUpload />}
          {activeTab === 'packages' && <AdminPackages />}
          {activeTab === 'transactions' && <AdminTransactions />}
          {activeTab === 'add-account' && <AdminAddAccount />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  );
}