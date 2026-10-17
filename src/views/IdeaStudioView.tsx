import React, { useState } from 'react';
import { ContentIdea, ScriptItem, ViewMode } from '../types';
import { Lightbulb, Sparkles, Plus, ArrowRight, Bookmark, Check, Trash2, Loader2 } from 'lucide-react';

interface IdeaStudioViewProps {
  ideas: ContentIdea[];
  onAddIdea: (idea: ContentIdea) => void;
  onConvertToScript?: (idea: ContentIdea, script: ScriptItem) => void;
  onNavigate?: (view: ViewMode) => void;
}

export const IdeaStudioView: React.FC<IdeaStudioViewProps> = ({ ideas, onAddIdea, onConvertToScript, onNavigate }) => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<'YouTube' | 'Instagram' | 'TikTok' | 'LinkedIn'>('YouTube');
  const [loading, setLoading] = useState(false);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [ideaList, setIdeaList] = useState<ContentIdea[]>(ideas);

  const handleGenerateIdeas = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Generate 3 high-engaging content ideas for ${platform} about "${topic}". Format each with a Catchy Title, Hook, and Content Angle.`
        })
      });
      const data = await res.json();
      if (data.success) {
        const newIdea: ContentIdea = {
          id: 'i_' + Date.now(),
          title: `AI Generated: ${topic}`,
          hook: data.text.slice(0, 120) + '...',
          niche: 'Creator Strategy',
          platform: platform,
          format: 'Video',
          estimatedDuration: '8 mins',
          angle: 'Engagement & Growth',
          saved: true,
          createdAt: 'Just now'
        };
        setIdeaList([newIdea, ...ideaList]);
        onAddIdea(newIdea);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToScriptClick = async (idea: ContentIdea) => {
    setConvertingId(idea.id);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Write a complete, high-retention video script for platform "${idea.platform}" based on this content idea:\nTitle: ${idea.title}\nHook: ${idea.hook}\nAngle: ${idea.angle}\n\nProvide structured content for Hook, Introduction, Body, and Call to Action.`
        })
      });
      const data = await res.json();
      const generatedText = data.success && data.text ? data.text : `Hook: ${idea.hook}\nIntroduction: Welcome back creators! Today we explore ${idea.title}.\nBody: Here is the deep dive into ${idea.angle}...\nCallToAction: Subscribe for more creator strategies!`;

      const newScript: ScriptItem = {
        id: 's_' + Date.now(),
        title: idea.title,
        ideaId: idea.id,
        platform: idea.platform,
        targetDuration: idea.estimatedDuration || '8 mins',
        language: 'English',
        content: {
          hook: idea.hook,
          introduction: `Welcome back everyone! Today we're breaking down: ${idea.title}.`,
          body: generatedText,
          callToAction: 'Drop a comment below with your thoughts and subscribe for more!'
        },
        wordCount: 350,
        status: 'Draft',
        updatedAt: 'Just now'
      };

      if (onConvertToScript) {
        onConvertToScript(idea, newScript);
      } else if (onNavigate) {
        onNavigate('scripts');
      }
    } catch (e) {
      console.error(e);
      const fallbackScript: ScriptItem = {
        id: 's_' + Date.now(),
        title: idea.title,
        ideaId: idea.id,
        platform: idea.platform,
        targetDuration: idea.estimatedDuration || '8 mins',
        language: 'English',
        content: {
          hook: idea.hook,
          introduction: `Welcome back! Today we are discussing ${idea.title}.`,
          body: `Exploring ${idea.angle} for ${idea.platform}...`,
          callToAction: 'Like and subscribe for more content!'
        },
        wordCount: 200,
        status: 'Draft',
        updatedAt: 'Just now'
      };
      if (onConvertToScript) {
        onConvertToScript(idea, fallbackScript);
      } else if (onNavigate) {
        onNavigate('scripts');
      }
    } finally {
      setConvertingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#111111]">Idea Studio</h2>
          <p className="text-xs text-[#737373]">Generate hooks, angles, and content frameworks backed by AI.</p>
        </div>
      </div>

      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#737373] uppercase mb-1.5">Topic or Niche Focus</label>
            <input
              type="text"
              placeholder="e.g., Monetization strategies for micro-creators..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-4 py-2.5 text-xs text-[#111111] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#737373] uppercase mb-1.5">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as any)}
              className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-4 py-2.5 text-xs text-[#111111] outline-none"
            >
              <option value="YouTube">YouTube</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateIdeas}
          disabled={loading || !topic.trim()}
          className="w-full py-3 bg-[#050505] hover:bg-[#222222] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-[#C8F34A]" />
          {loading ? 'Generating AI Ideas...' : 'Generate Content Ideas'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideaList.map((idea) => (
          <div key={idea.id} className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 bg-[#C8F34A]/30 text-[#111111] rounded-full text-[10px] font-bold">
                  {idea.platform}
                </span>
                <span className="text-[10px] text-[#737373]">{idea.createdAt}</span>
              </div>
              <h3 className="text-sm font-bold text-[#111111] mb-2">{idea.title}</h3>
              <p className="text-xs text-[#555555] bg-[#F8F8F4] p-3 rounded-xl border border-[#EEEEEA] italic">
                "{idea.hook}"
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#EEEEEA]">
              <span className="text-[10px] font-semibold text-[#737373]">{idea.angle}</span>
              <button
                onClick={() => handleConvertToScriptClick(idea)}
                disabled={convertingId === idea.id}
                className="px-3 py-1.5 bg-[#050505] text-white rounded-lg text-xs font-bold hover:bg-[#222222] disabled:opacity-50 transition-all cursor-pointer flex items-center gap-1.5"
              >
                {convertingId === idea.id ? (
                  <>
                    <Loader2 className="w-3 h-3 text-[#C8F34A] animate-spin" />
                    <span>Converting...</span>
                  </>
                ) : (
                  <>
                    <span>Convert to Script</span>
                    <ArrowRight className="w-3 h-3 text-[#C8F34A]" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
