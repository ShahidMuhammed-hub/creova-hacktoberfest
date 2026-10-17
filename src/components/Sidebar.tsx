import React from 'react';
import { ViewMode } from '../types';
import { 
  LayoutDashboard, 
  Compass, 
  Lightbulb, 
  FileText, 
  Clapperboard, 
  Languages, 
  Palette, 
  Calendar, 
  Share2, 
  BarChart3, 
  CheckSquare, 
  FolderKanban, 
  Shield, 
  Plug, 
  Settings 
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView }) => {
  const navItems = [
    { id: 'dashboard' as ViewMode, label: 'Overview', icon: LayoutDashboard },
    { id: 'discover' as ViewMode, label: 'Discover', icon: Compass },
    { id: 'ideas' as ViewMode, label: 'Idea Studio', icon: Lightbulb },
    { id: 'scripts' as ViewMode, label: 'Script Studio', icon: FileText },
    { id: 'production' as ViewMode, label: 'Production', icon: Clapperboard },
    { id: 'localization' as ViewMode, label: 'Localization', icon: Languages },
    { id: 'design' as ViewMode, label: 'Design Studio', icon: Palette },
    { id: 'calendar' as ViewMode, label: 'Content Calendar', icon: Calendar },
    { id: 'publishing' as ViewMode, label: 'Publishing', icon: Share2 },
    { id: 'analytics' as ViewMode, label: 'Analytics', icon: BarChart3 },
    { id: 'tasks' as ViewMode, label: 'Tasks', icon: CheckSquare },
  ];

  const secondaryNavItems = [
    { id: 'projects' as ViewMode, label: 'Projects & Assets', icon: FolderKanban },
    { id: 'brandkit' as ViewMode, label: 'Brand Kit', icon: Shield },
    { id: 'integrations' as ViewMode, label: 'Integrations', icon: Plug },
    { id: 'settings' as ViewMode, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-20 lg:w-64 bg-[#050505] text-[#A3A3A3] flex flex-col h-screen sticky top-0 border-r border-[#1F1F1F] z-30 select-none transition-all duration-200">
      {/* Brand logo & symbol */}
      <div className="p-5 flex items-center gap-3 border-b border-[#1F1F1F]">
        <div className="w-9 h-9 rounded-full border-2 border-[#C8F34A] flex items-center justify-center bg-black shadow-[0_0_12px_rgba(200,243,74,0.3)]">
          <div className="w-3.5 h-3.5 rounded-full bg-[#C8F34A] animate-pulse" />
        </div>
        <div className="hidden lg:block">
          <span className="font-bold text-white tracking-wider text-lg">CREOVA</span>
          <span className="block text-[10px] text-[#888888] font-medium tracking-widest uppercase">Creator OS</span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        <div className="hidden lg:block px-3 pb-2 text-[11px] font-semibold text-[#666666] uppercase tracking-wider">
          Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              title={item.label}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive 
                  ? 'bg-[#161616] text-[#C8F34A] shadow-sm border border-[#262626]' 
                  : 'hover:bg-[#111111] text-[#A3A3A3] hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-[#C8F34A]' : 'text-[#888888] group-hover:text-white'}`} />
              <span className="hidden lg:block truncate">{item.label}</span>
              {isActive && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#C8F34A] rounded-l-full hidden lg:block" />
              )}
            </button>
          );
        })}

        <div className="pt-6 hidden lg:block px-3 pb-2 text-[11px] font-semibold text-[#666666] uppercase tracking-wider">
          System
        </div>
        <div className="space-y-1">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                title={item.label}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive 
                    ? 'bg-[#161616] text-[#C8F34A] border border-[#262626]' 
                    : 'hover:bg-[#111111] text-[#A3A3A3] hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#C8F34A]' : 'text-[#888888] group-hover:text-white'}`} />
                <span className="hidden lg:block truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Creator Badge */}
      <div className="p-4 border-t border-[#1F1F1F] bg-[#030303] flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#1C1C1C] border border-[#333333] flex items-center justify-center text-white text-xs font-bold shrink-0">
          AM
        </div>
        <div className="hidden lg:block overflow-hidden">
          <p className="text-xs font-semibold text-white truncate">Alex Morgan</p>
          <p className="text-[10px] text-[#737373] truncate">Pro Creator Plan</p>
        </div>
      </div>
    </aside>
  );
};
