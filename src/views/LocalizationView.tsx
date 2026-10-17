import React, { useState } from 'react';
import { Languages, Sparkles, Download, Upload, Check } from 'lucide-react';

export const LocalizationView: React.FC = () => {
  const [targetLang, setTargetLang] = useState('Malayalam');
  const [translating, setTranslating] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleTranslate = () => {
    setTranslating(true);
    setTimeout(() => {
      setTranslating(false);
      setCompleted(true);
    }, 1500);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#111111]">Multilingual & Localization Studio</h2>
          <p className="text-xs text-[#737373]">Translate video transcripts and generate subtitles in Malayalam, Arabic, Urdu, and English.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#111111]">Source Transcript (English)</h3>
          <div className="p-4 bg-[#F8F8F4] border border-[#EEEEEA] rounded-2xl text-xs text-[#111111] leading-relaxed font-mono h-48 overflow-y-auto">
            [0:00] Welcome back to the channel. Today we are exploring autonomous AI agents.<br/>
            [0:15] Notice how CREOVA helps creators manage their entire content pipeline.<br/>
            [0:30] Let's dive straight into the script translation workflow.
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#737373] uppercase mb-1.5">Select Target Language</label>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-4 py-2.5 text-xs text-[#111111] outline-none"
            >
              <option value="Malayalam">Malayalam (മലയാളം)</option>
              <option value="Arabic">Arabic (العربية)</option>
              <option value="Urdu">Urdu (اردو)</option>
              <option value="Spanish">Spanish (Español)</option>
            </select>
          </div>
          <button
            onClick={handleTranslate}
            disabled={translating}
            className="w-full py-3 bg-[#050505] hover:bg-[#222222] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#C8F34A]" />
            {translating ? 'Translating & Shaping...' : `Translate to ${targetLang}`}
          </button>
        </div>

        <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#111111]">Localized Output ({targetLang})</h3>
              {completed && <span className="px-2 py-0.5 bg-[#3B8D50]/10 text-[#3B8D50] rounded-full text-[10px] font-bold">Ready</span>}
            </div>
            <div className="p-4 bg-[#F8F8F4] border border-[#EEEEEA] rounded-2xl text-xs text-[#111111] leading-relaxed font-mono h-48 overflow-y-auto">
              {completed ? (
                <>
                  [0:00] ചാനലിലേക്ക് സ്വാഗതം. ഇന്ന് നമ്മൾ ഓട്ടോണമസ് AI ഏജന്റുകൾ പരിശോധിക്കുന്നു.<br/>
                  [0:15] CREOVA സ്രഷ്ടാക്കൾക്ക് അവരുടെ മുഴുവൻ ഉള്ളടക്ക പൈപ്പ്‌ലൈനും കൈകാര്യം ചെയ്യാൻ എങ്ങനെ സഹായിക്കുന്നു എന്ന് ശ്രദ്ധിക്കുക.<br/>
                  [0:30] നമുക്ക് സ്ക്രിപ്റ്റ് വിവർത്തന വർക്ക്ഫ്ലോയിലേക്ക് കടക്കാം.
                </>
              ) : (
                <span className="text-[#888888]">Click translate to generate localized transcript and subtitles...</span>
              )}
            </div>
          </div>
          <div className="pt-4 border-t border-[#EEEEEA] flex gap-3">
            <button disabled={!completed} className="flex-1 py-2.5 bg-[#C8F34A] disabled:opacity-50 text-[#050505] rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm">
              <Download className="w-4 h-4" />
              Download SRT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
