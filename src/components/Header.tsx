import React, { useState } from 'react';
import { ViewMode } from '../types';
import { Search, Bell, Plus, ChevronDown, Sparkles, X, LogOut, Menu } from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onOpenMobileMenu?: () => void;
  onOpenCreateModal: () => void;
  onOpenAIAgent: () => void;
  currentUser?: { name: string; email: string; avatar: string };
  onLogout?: () => void;
  onNavigate?: (view: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentView, 
  onOpenMobileMenu,
  onOpenCreateModal, 
  onOpenAIAgent, 
  currentUser, 
  onLogout,
  onNavigate 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getViewTitle = (mode: ViewMode) => {
    switch (mode) {
      case 'dashboard': return 'Overview';
      case 'discover': return 'Discover & Trends';
      case 'ideas': return 'Idea Studio';
      case 'scripts': return 'Script Studio';
      case 'production': return 'Video Production Planner';
      case 'localization': return 'Multilingual & Localization Studio';
      case 'design': return 'Design & Thumbnail Studio';
      case 'calendar': return 'Content Calendar';
      case 'publishing': return 'Publishing Center';
      case 'analytics': return 'Analytics & Insights';
      case 'tasks': return 'Tasks & Productivity';
      case 'projects': return 'Projects & Assets';
      case 'brandkit': return 'Brand Kit';
      case 'integrations': return 'Integrations & APIs';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const notificationsList = [
    { id: 1, title: 'AI Script Generated Successfully', time: '10 mins ago', unread: true },
    { id: 2, title: 'YouTube Scheduled Post Ready', time: '1 hour ago', unread: true },
    { id: 3, title: 'Arabic Subtitle Render Completed', time: '3 hours ago', unread: false },
  ];

  return (
    <header className="h-16 md:h-18 bg-[#EDEEE5]/90 backdrop-blur-md border-b border-[#DEDFD8] px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sticky top-0 z-20 min-w-0">
      {/* Left: View title */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
        <button type="button" className="md:hidden shrink-0 w-10 h-10 rounded-xl bg-white border border-[#DEDFD8] flex items-center justify-center" onClick={onOpenMobileMenu} aria-label="Open navigation"><Menu size={20}/></button>
        <h1 className="text-sm sm:text-base lg:text-xl font-bold text-[#111111] tracking-tight truncate">{getViewTitle(currentView)}</h1>
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-white border border-[#DEDFD8] rounded-full text-xs font-medium text-[#555555]">
          <span>Workspace:</span>
          <span className="font-semibold text-[#111111]">CREOVA Global HQ</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#888888]" />
        </div>
      </div>

      {/* Right: Search, AI Agent, Create, Notifications, Profile Avatar Dropdown */}
      <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 shrink-0">
        {/* Global Search */}
        <div className="hidden xl:flex items-center gap-2 bg-white border border-[#DEDFD8] rounded-xl px-3 py-1.5 w-56 lg:w-72 focus-within:ring-2 focus-within:ring-[#C8F34A] focus-within:border-[#111111] transition-all">
          <Search className="w-4 h-4 text-[#888888]" />
          <input
            type="text"
            placeholder="Search ideas, scripts, projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-[#111111] placeholder-[#888888] outline-none w-full"
          />
        </div>

        {/* AI Agent Button */}
        <button
          onClick={onOpenAIAgent}
          aria-label="Open AI Agent"
          className="flex items-center justify-center gap-2 bg-[#C8F34A] hover:bg-[#B8E63A] text-[#050505] px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden lg:inline">AI Agent</span>
        </button>

        {/* Create Content Button */}
        <button
          onClick={onOpenCreateModal}
          aria-label="Create content"
          className="hidden sm:flex items-center gap-2 bg-[#050505] hover:bg-[#222222] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C8F34A]" />
          <span className="hidden sm:inline">Create Content</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-white border border-[#DEDFD8] flex items-center justify-center text-[#111111] hover:border-[#111111] transition-all relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C8F34A] border border-white animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[min(85vw,320px)] bg-white border border-[#DEDFD8] rounded-2xl shadow-xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEA]">
                <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-[#888888] hover:text-[#111111]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="divide-y divide-[#EEEEEA] mt-2 max-h-64 overflow-y-auto">
                {notificationsList.map((n) => (
                  <div key={n.id} className="py-2.5 flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.unread ? 'bg-[#C8F34A]' : 'bg-[#DEDFD8]'}`} />
                    <div>
                      <p className="text-xs font-medium text-[#111111]">{n.title}</p>
                      <p className="text-[10px] text-[#888888] mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with Logout Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-white border border-[#DEDFD8] flex items-center justify-center overflow-hidden cursor-pointer shadow-sm hover:border-[#111111] transition-all"
            title={currentUser?.name || "Profile Menu"}
          >
            <img 
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"} 
              alt={currentUser?.name || "Alex Morgan"}
              className="w-full h-full object-cover" 
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#DEDFD8] rounded-2xl shadow-xl p-4 z-50 space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-[#EEEEEA]">
                <img 
                  src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"} 
                  alt={currentUser?.name || "Alex"}
                  className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl object-cover" 
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-[#111111] truncate">{currentUser?.name || 'Alex Morgan'}</p>
                  <p className="text-[10px] text-[#737373] truncate">{currentUser?.email || 'alex@creova.ai'}</p>
                </div>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => { setShowProfileMenu(false); onNavigate?.('settings'); }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-[#111111] hover:bg-[#F8F8F4] rounded-xl transition-all cursor-pointer"
                >
                  Workspace Settings
                </button>
                <button
                  onClick={() => { setShowProfileMenu(false); onLogout?.(); }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
