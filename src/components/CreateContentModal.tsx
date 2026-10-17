import React, { useState } from 'react';
import { X, Sparkles, Lightbulb, FileText, Clapperboard, Calendar, ArrowRight } from 'lucide-react';
import { ViewMode } from '../types';

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewMode) => void;
}

export const CreateContentModal: React.FC<CreateContentModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'YouTube' | 'Instagram' | 'TikTok'>('YouTube');
  const [generating, setGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickGenerate = async () => {
    if (!selectedTopic.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate a high-converting content hook and outline for ${selectedPlatform} about: ${selectedTopic}. Keep it concise and professional.`
        })
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedResult(data.text);
      } else {
        setGeneratedResult('Failed to generate. Please check your API key.');
      }
    } catch (err) {
      setGeneratedResult('Error connecting to AI service.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-[#DEDFD8] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#EEEEEA]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#C8F34A] flex items-center justify-center text-[#050505] font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-[#111111]">Create New Content</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-[#F8F8F4] flex items-center justify-center text-[#737373] hover:text-[#111111]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#737373] uppercase mb-1.5">What is your topic or idea?</label>
            <input
              type="text"
              placeholder="e.g., Autonomous AI agents in software engineering..."
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-4 py-2.5 text-sm text-[#111111] placeholder-[#929292] outline-none focus:border-[#050505]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#737373] uppercase mb-1.5">Platform</label>
            <div className="grid grid-cols-3 gap-2">
              {(['YouTube', 'Instagram', 'TikTok'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPlatform(p)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                    selectedPlatform === p 
                      ? 'bg-[#050505] text-white border-[#050505]' 
                      : 'bg-[#F8F8F4] text-[#555555] border-[#DEDFD8] hover:border-[#111111]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {generatedResult && (
            <div className="p-4 bg-[#F8F8F4] border border-[#DEDFD8] rounded-2xl text-xs text-[#111111] space-y-2">
              <p className="font-bold text-[#050505]">AI Generated Outline:</p>
              <p className="whitespace-pre-line leading-relaxed">{generatedResult}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleQuickGenerate}
              disabled={generating || !selectedTopic.trim()}
              className="py-2.5 px-4 bg-[#C8F34A] hover:bg-[#B8E63A] disabled:opacity-50 text-[#050505] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              {generating ? 'Generating...' : 'AI Instant Generate'}
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigate('ideas');
              }}
              className="py-2.5 px-4 bg-[#050505] hover:bg-[#222222] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Open Idea Studio</span>
              <ArrowRight className="w-4 h-4 text-[#C8F34A]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
