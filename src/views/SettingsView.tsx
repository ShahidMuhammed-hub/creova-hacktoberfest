import React, { useState } from 'react';
import { Settings, Check, LogOut } from 'lucide-react';

interface SettingsViewProps {
  onLogout: () => void;
  currentUser?: { name: string; email: string; avatar: string };
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onLogout, currentUser }) => {
  const [workspaceName, setWorkspaceName] = useState('CREOVA Global HQ');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#111111]">General Settings</h2>
          <p className="text-xs text-[#737373]">Configure workspace preferences, timezone, and security settings.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#050505] hover:bg-[#222222] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          {saved ? <Check className="w-4 h-4 text-[#C8F34A]" /> : null}
          {saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#737373] uppercase mb-1">Workspace Name</label>
          <input
            type="text"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-4 py-2.5 text-xs text-[#111111] outline-none"
          />
        </div>
      </div>

      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-[#111111]">Account & Session</h3>
        <p className="text-xs text-[#737373]">Currently signed in as <span className="font-semibold text-[#111111]">{currentUser?.email || 'alex@creova.ai'}</span></p>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Creator Studio</span>
        </button>
      </div>
    </div>
  );
};
