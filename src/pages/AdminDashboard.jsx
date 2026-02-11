import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  BarChart3, Users, Image as ImageIcon, Settings, 
  Receipt, UserPlus, Tag, ShieldCheck, ChevronRight,
  ChevronLeft, Menu 
} from 'lucide-react';

import LogoutButton from '../components/LogoutButton';
import AdminAnalytics from './AdminAnalytics';
import AdminUsers from './AdminUsers';
import AdminUpload from './AdminUpload';
import AdminPackages from './AdminPackages';
import AdminTransactions from './AdminTransactions';
import AdminAddAccount from './AdminAddAccount';
import AdminSettings from './AdminSettings';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [isCollapsed, setIsCollapsed] = useState(false); // NEW: Collapse State
  const [adminProfile, setAdminProfile] = useState({ full_name: 'Admin User', role: 'Staff' });

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single();
        if (data) setAdminProfile(data);
      }
    }
    getProfile();
  }, []);

  const menuItems = [
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={20} /> },
    { id: 'packages', label: 'Packages', icon: <Tag size={20} /> },
    { id: 'transactions', label: 'Transactions', icon: <Receipt size={20} /> },
    { id: 'add-account', label: 'Add Account', icon: <UserPlus size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-bg-body overflow-hidden">
      
      {/* --- DYNAMIC SIDEBAR --- */}
      <aside 
        className={`bg-white border-r border-gray-100 flex flex-col shadow-soft h-full z-20 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* 1. Header with Toggle Button */}
        <div className={`p-6 shrink-0 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3 animate-in fade-in duration-300">
              <div className="w-8 h-8 bg-primary rounded-m flex items-center justify-center text-white font-bold shadow-sm">P</div>
              <span className="text-lg font-bold text-text-main tracking-tight uppercase">ProfilePic</span>
            </div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-m text-text-secondary transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* 2. Navigation Area */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar py-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : ""}
              className={`w-full flex items-center rounded-m transition-all font-bold text-sm group ${
                isCollapsed ? 'justify-center py-3' : 'px-4 py-3 gap-4 justify-between'
              } ${
                activeTab === item.id 
                ? 'bg-primary text-white shadow-soft' 
                : 'text-text-secondary hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`${activeTab === item.id ? 'text-white' : 'text-primary opacity-70 group-hover:opacity-100'}`}>
                  {item.icon}
                </span>
                {!isCollapsed && <span className="animate-in fade-in slide-in-from-left-2">{item.label}</span>}
              </div>
              {!isCollapsed && activeTab === item.id && <ChevronRight size={14} className="opacity-60" />}
            </button>
          ))}
        </nav>

        {/* 3. Identity Section */}
        <div className="shrink-0">
          <div className={`px-4 py-4 border-t border-gray-50 bg-gray-50/30 ${isCollapsed ? 'flex justify-center' : ''}`}>
            <div className={`flex items-center gap-3 bg-white p-2 rounded-m border border-gray-100 shadow-sm ${isCollapsed ? 'w-12 h-12 justify-center p-0' : 'w-full'}`}>
              <div className="w-8 h-8 rounded-full bg-text-main text-white flex items-center justify-center font-bold text-sm shrink-0">
                {adminProfile.full_name?.charAt(0) || 'A'}
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden animate-in fade-in duration-300">
                  <p className="text-xs font-bold text-text-main truncate leading-tight">{adminProfile.full_name}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-primary opacity-80">{adminProfile.role || 'Staff'}</p>
                </div>
              )}
            </div>
          </div>

          <div className={`px-4 pb-6 bg-gray-50/30 ${isCollapsed ? 'flex justify-center' : ''}`}>
             <LogoutButton collapsed={isCollapsed} />
          </div>
        </div>
      </aside>

      {/* --- RESPONSIVE PANEL --- */}
      <main className="flex-1 overflow-y-auto p-10 bg-bg-body">
        <header className="mb-10 flex justify-between items-start">
          <div className="animate-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-2 text-text-secondary text-xs font-bold uppercase tracking-widest mb-1 opacity-60">
              Admin <ChevronRight size={12} /> {activeTab.replace('-', ' ')}
            </div>
            <h1 className="text-4xl font-bold text-text-main capitalize tracking-tight">
              {activeTab.replace('-', ' ')}
            </h1>
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