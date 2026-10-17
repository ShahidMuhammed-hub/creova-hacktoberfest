import React, { useState } from 'react';
import { BrandProfile } from '../types';
import { Shield, Sparkles, Check } from 'lucide-react';
import { initialBrandProfile } from '../mockData';

export const BrandKitView: React.FC = () => {
  const [profile, setProfile] = useState<BrandProfile>(initialBrandProfile);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#111111]">Brand Kit</h2>
          <p className="text-xs text-[#737373]">Define your brand voice, colors, typography, and target audience guidelines.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-[#050505] hover:bg-[#222222] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          {saved ? <Check className="w-4 h-4 text-[#C8F34A]" /> : <Sparkles className="w-4 h-4 text-[#C8F34A]" />}
          {saved ? 'Saved Successfully' : 'Save Brand Profile'}
        </button>
      </div>

      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#737373] uppercase mb-1">Brand Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-4 py-2.5 text-xs text-[#111111] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#737373] uppercase mb-1">Tagline</label>
            <input
              type="text"
              value={profile.tagline}
              onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-4 py-2.5 text-xs text-[#111111] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#737373] uppercase mb-1">Content Niche</label>
            <input
              type="text"
              value={profile.niche}
              onChange={(e) => setProfile({ ...profile, niche: e.target.value })}
              className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-4 py-2.5 text-xs text-[#111111] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#737373] uppercase mb-1">Brand Tone</label>
            <input
              type="text"
              value={profile.tone}
              onChange={(e) => setProfile({ ...profile, tone: e.target.value })}
              className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-4 py-2.5 text-xs text-[#111111] outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
