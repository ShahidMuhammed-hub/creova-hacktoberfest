import React, { useState } from 'react';
import { ScriptItem } from '../types';
import { FileText, Sparkles, Copy, Download, Check, RefreshCw } from 'lucide-react';

interface ScriptStudioViewProps {
  script: ScriptItem;
  onUpdateScript: (script: ScriptItem) => void;
}

export const ScriptStudioView: React.FC<ScriptStudioViewProps> = ({ script, onUpdateScript }) => {
  const [currentScript, setCurrentScript] = useState<ScriptItem>(script);
  const [copied, setCopied] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleTextChange = (field: keyof typeof currentScript.content, value: string) => {
    const updated = {
      ...currentScript,
      content: {
        ...currentScript.content,
        [field]: value
      }
    };
    setCurrentScript(updated);
    onUpdateScript(updated);
  };

  const handleAIEnhance = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Enhance and polish this script hook and intro for maximum viewer retention:\nHook: ${currentScript.content.hook}\nIntro: ${currentScript.content.introduction}`
        })
      });
      const data = await res.json();
      if (data.success) {
        handleTextChange('hook', data.text.slice(0, 150));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleCopy = () => {
    const fullText = `Title: ${currentScript.title}\n\nHook:\n${currentScript.content.hook}\n\nIntroduction:\n${currentScript.content.introduction}\n\nBody:\n${currentScript.content.body}\n\nCall To Action:\n${currentScript.content.callToAction}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#111111]">Script Studio</h2>
          <p className="text-xs text-[#737373]">Write, edit, and polish retention-optimized scripts with AI assistance.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAIEnhance}
            disabled={loadingAI}
            className="px-4 py-2 bg-[#C8F34A] hover:bg-[#B8E63A] text-[#050505] rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            {loadingAI ? 'Polishing...' : 'AI Polish Hook'}
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-[#050505] hover:bg-[#222222] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-[#C8F34A]" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Script'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#737373] uppercase mb-1">Script Title</label>
              <input
                type="text"
                value={currentScript.title}
                onChange={(e) => setCurrentScript({ ...currentScript, title: e.target.value })}
                className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-4 py-2.5 text-sm font-bold text-[#111111] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#737373] uppercase mb-1">Opening Hook (0 - 15s)</label>
              <textarea
                rows={3}
                value={currentScript.content.hook}
                onChange={(e) => handleTextChange('hook', e.target.value)}
                className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl p-4 text-xs text-[#111111] outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#737373] uppercase mb-1">Introduction</label>
              <textarea
                rows={3}
                value={currentScript.content.introduction}
                onChange={(e) => handleTextChange('introduction', e.target.value)}
                className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl p-4 text-xs text-[#111111] outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#737373] uppercase mb-1">Body Points</label>
              <textarea
                rows={6}
                value={currentScript.content.body}
                onChange={(e) => handleTextChange('body', e.target.value)}
                className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl p-4 text-xs text-[#111111] outline-none leading-relaxed font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#737373] uppercase mb-1">Call To Action (CTA)</label>
              <input
                type="text"
                value={currentScript.content.callToAction}
                onChange={(e) => handleTextChange('callToAction', e.target.value)}
                className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-4 py-2.5 text-xs text-[#111111] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#111111]">Metadata & Stats</h3>
            <div className="space-y-3 divide-y divide-[#EEEEEA]">
              <div className="flex justify-between pt-2">
                <span className="text-xs text-[#737373]">Platform</span>
                <span className="text-xs font-bold text-[#111111]">{currentScript.platform}</span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-xs text-[#737373]">Target Duration</span>
                <span className="text-xs font-bold text-[#111111]">{currentScript.targetDuration}</span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-xs text-[#737373]">Word Count</span>
                <span className="text-xs font-bold text-[#111111]">{currentScript.wordCount} words</span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-xs text-[#737373]">Language</span>
                <span className="text-xs font-bold text-[#111111]">{currentScript.language}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
