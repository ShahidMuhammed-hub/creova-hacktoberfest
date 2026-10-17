import React, { useState } from 'react';
import { Project, ContentIdea, TaskItem, CalendarEvent, ViewMode } from '../types';
import { 
  FileText, 
  Clapperboard, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  TrendingUp, 
  Plus, 
  ChevronRight,
  Search,
  Loader2,
  Globe
} from 'lucide-react';

interface DashboardViewProps {
  projects: Project[];
  ideas: ContentIdea[];
  tasks: TaskItem[];
  calendarEvents: CalendarEvent[];
  onNavigate: (view: ViewMode) => void;
  onToggleTask: (taskId: string) => void;
  onOpenCreateModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  projects,
  ideas,
  tasks,
  calendarEvents,
  onNavigate,
  onToggleTask,
  onOpenCreateModal
}) => {
  const draftCount = projects.filter(p => p.status === 'Draft').length;
  const productionCount = projects.filter(p => p.status === 'In Production').length;
  const scheduledCount = projects.filter(p => p.status === 'Scheduled').length;
  const publishedCount = projects.filter(p => p.status === 'Published').length;

  const [searchTopic, setSearchTopic] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const handleAISearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTopic.trim()) return;
    setLoadingSearch(true);
    setSearchResult(null);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Provide the latest updates, industry news, algorithm shifts, and strategic intelligence for creators on the topic: "${searchTopic}". Highlight key takeaways, new opportunities, and actionable advice.`
        })
      });
      const data = await res.json();
      setSearchResult(data.success && data.text ? data.text : "No recent news found for this topic.");
    } catch (e) {
      console.error(e);
      setSearchResult("Failed to retrieve AI intelligence report. Please try again.");
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Greeting Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm hover:border-[#111111] transition-all">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C8F34A]/30 text-[#111111] text-[10px] font-bold uppercase tracking-wider">
              Creator OS Active
            </span>
            <span className="text-xs text-[#737373]">Thursday, October 17, 2026</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#111111] tracking-tight">Good morning, Alex.</h2>
          <p className="text-sm text-[#737373] mt-0.5">Your content workflow, projects, and publishing activity in one place.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 bg-[#050505] hover:bg-[#222222] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#C8F34A]" />
            Create content
          </button>
        </div>
      </div>

      {/* Main AI Integrated Search Bar for Latest Updates & News */}
      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#C8F34A]/30 text-[#111111] flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111111]">AI Intelligence & Creator News Search</h3>
              <p className="text-xs text-[#737373]">Search any topic, algorithm trend, or platform update to get real-time AI insights.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleAISearch} className="flex gap-2">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-[#888888]" />
            <input
              type="text"
              placeholder="e.g., YouTube Shorts algorithm updates 2026, TikTok monetization changes..."
              value={searchTopic}
              onChange={(e) => setSearchTopic(e.target.value)}
              className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-2xl pl-11 pr-4 py-3 text-xs text-[#111111] outline-none focus:border-[#111111] transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loadingSearch || !searchTopic.trim()}
            className="px-6 py-3 bg-[#050505] hover:bg-[#222222] disabled:opacity-50 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm shrink-0"
          >
            {loadingSearch ? (
              <>
                <Loader2 className="w-4 h-4 text-[#C8F34A] animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#C8F34A]" />
                <span>Get AI Intelligence</span>
              </>
            )}
          </button>
        </form>

        {searchResult && (
          <div className="mt-4 p-5 bg-[#F8F8F4] border border-[#DEDFD8] rounded-2xl space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-[#EEEEEA] pb-2">
              <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C8F34A]" />
                AI Intelligence Report: "{searchTopic}"
              </span>
              <button onClick={() => setSearchResult(null)} className="text-xs text-[#888888] hover:text-[#111111]">
                Clear
              </button>
            </div>
            <div className="text-xs text-[#111111] leading-relaxed whitespace-pre-wrap pt-1 font-medium">
              {searchResult}
            </div>
          </div>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Content Status & Recent Projects */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Panel A: Content Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div 
              onClick={() => onNavigate('projects')}
              className="bg-white border border-[#DEDFD8] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-[#111111] hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[#737373] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-[#111111]">Drafts</span>
                <FileText className="w-4 h-4 text-[#888888] group-hover:text-[#111111]" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#111111]">{draftCount}</p>
                <p className="text-[10px] text-[#737373] mt-0.5">Ready for review</p>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('production')}
              className="bg-white border border-[#DEDFD8] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-[#111111] hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[#737373] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-[#111111]">Production</span>
                <Clapperboard className="w-4 h-4 text-[#888888] group-hover:text-[#111111]" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#111111]">{productionCount}</p>
                <p className="text-[10px] text-[#737373] mt-0.5">In progress</p>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('calendar')}
              className="bg-white border border-[#DEDFD8] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-[#111111] hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[#737373] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-[#111111]">Scheduled</span>
                <Calendar className="w-4 h-4 text-[#888888] group-hover:text-[#111111]" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#111111]">{scheduledCount}</p>
                <p className="text-[10px] text-[#737373] mt-0.5">Queued to post</p>
              </div>
            </div>

            <div 
              onClick={() => onNavigate('analytics')}
              className="bg-white border border-[#DEDFD8] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:border-[#111111] hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[#737373] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider group-hover:text-[#111111]">Published</span>
                <TrendingUp className="w-4 h-4 text-[#888888] group-hover:text-[#111111]" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#111111]">{publishedCount}</p>
                <p className="text-[10px] text-[#3B8D50] font-semibold mt-0.5">+18% this month</p>
              </div>
            </div>
          </div>

          {/* Panel B: Content Activity Chart & Analytics Preview */}
          <div 
            onClick={() => onNavigate('analytics')}
            className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm hover:border-[#111111] hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#EEEEEA] mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#111111]">Content Reach & Activity</h3>
                <p className="text-xs text-[#737373]">Performance trajectory over the last 30 days</p>
              </div>
              <span className="text-xs font-semibold text-[#111111] hover:underline flex items-center gap-1">
                <span>View analytics</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="h-48 w-full flex items-end justify-between gap-2 px-2 pt-6 pb-2 relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                <div className="border-b border-dashed border-[#E5E5E0] w-full" />
                <div className="border-b border-dashed border-[#E5E5E0] w-full" />
                <div className="border-b border-dashed border-[#E5E5E0] w-full" />
              </div>

              {[35, 48, 62, 50, 75, 90, 82, 95, 88, 110, 102, 125].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 z-10 group">
                  <div 
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      idx === 11 ? 'bg-[#C8F34A] border border-[#111111]' : 'bg-[#050505]/10 group-hover:bg-[#050505]'
                    }`}
                    style={{ height: `${val}px` }}
                  />
                  <span className="text-[9px] text-[#888888]">W{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Panel D: Recent Projects Table / List */}
          <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm hover:border-[#111111] transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-[#EEEEEA] mb-4">
              <h3 className="text-sm font-bold text-[#111111]">Recent Projects</h3>
              <button 
                onClick={() => onNavigate('projects')}
                className="text-xs font-semibold text-[#111111] hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>
            <div className="space-y-3">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  onClick={() => onNavigate('projects')}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#F8F8F4] border border-[#EEEEEA] hover:border-[#111111] hover:bg-white hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#DEDFD8] flex items-center justify-center font-bold text-xs text-[#111111]">
                      {project.platform === 'YouTube' ? 'YT' : 'IG'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#111111]">{project.title}</p>
                      <p className="text-[10px] text-[#737373]">{project.contentType} • Updated {project.updatedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      project.status === 'Published' ? 'bg-[#3B8D50]/10 text-[#3B8D50]' :
                      project.status === 'Scheduled' ? 'bg-[#C38A28]/10 text-[#C38A28]' :
                      'bg-[#111111]/5 text-[#111111]'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Lime Featured Card, Today's Tasks, Quick AI Actions */}
        <div className="space-y-6">

          {/* Special Lime Featured Card */}
          <div className="bg-[#C8F34A] border border-[#111111]/10 rounded-3xl p-6 text-[#050505] shadow-lg relative overflow-hidden flex flex-col justify-between hover:scale-[1.01] transition-all cursor-pointer" onClick={() => onNavigate('ideas')}>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
              <Sparkles className="w-48 h-48" />
            </div>
            <div>
              <span className="px-3 py-1 bg-black text-[#C8F34A] rounded-full text-[10px] font-bold uppercase tracking-wider">
                Growth Masterclass
              </span>
              <h3 className="text-xl font-extrabold mt-3 tracking-tight">How to reduce content creation friction by 25%?</h3>
              <p className="text-xs mt-2 text-[#222222] font-medium leading-relaxed">
                Discover agentic workflows, script templates, and automated localization built into CREOVA.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between">
              <button 
                onClick={(e) => { e.stopPropagation(); onNavigate('ideas'); }}
                className="bg-black hover:bg-[#222222] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                Explore Studio
              </button>
            </div>
          </div>

          {/* Panel E: Today's Tasks */}
          <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm hover:border-[#111111] transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-[#EEEEEA] mb-4">
              <h3 className="text-sm font-bold text-[#111111]">Today's Tasks</h3>
              <button 
                onClick={() => onNavigate('tasks')}
                className="text-xs font-semibold text-[#737373] hover:text-[#111111] cursor-pointer"
              >
                Manage
              </button>
            </div>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => onToggleTask(task.id)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#F8F8F4] hover:border hover:border-[#DEDFD8] transition-all cursor-pointer"
                >
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleTask(task.id); }}
                    className="mt-0.5 text-[#111111] hover:text-[#3B8D50] transition-colors cursor-pointer"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#3B8D50] fill-[#3B8D50]/10" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#888888]" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className={`text-xs font-semibold ${task.completed ? 'line-through text-[#888888]' : 'text-[#111111]'}`}>
                      {task.title}
                    </p>
                    <p className="text-[10px] text-[#737373] mt-0.5">{task.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel F: Quick AI Actions */}
          <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm hover:border-[#111111] transition-all">
            <h3 className="text-sm font-bold text-[#111111] mb-4">Quick AI Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => onNavigate('ideas')}
                className="p-3 bg-[#F8F8F4] hover:bg-white hover:border-[#111111] border border-[#EEEEEA] rounded-2xl text-left transition-all cursor-pointer group shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-[#C8F34A] mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-[#111111]">Generate Idea</p>
                <p className="text-[10px] text-[#737373] mt-0.5">AI hooks & angles</p>
              </button>

              <button 
                onClick={() => onNavigate('scripts')}
                className="p-3 bg-[#F8F8F4] hover:bg-white hover:border-[#111111] border border-[#EEEEEA] rounded-2xl text-left transition-all cursor-pointer group shadow-sm"
              >
                <FileText className="w-4 h-4 text-[#111111] mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-[#111111]">Write Script</p>
                <p className="text-[10px] text-[#737373] mt-0.5">Structured outlines</p>
              </button>

              <button 
                onClick={() => onNavigate('localization')}
                className="p-3 bg-[#F8F8F4] hover:bg-white hover:border-[#111111] border border-[#EEEEEA] rounded-2xl text-left transition-all cursor-pointer group shadow-sm"
              >
                <Clapperboard className="w-4 h-4 text-[#111111] mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-[#111111]">Localize Video</p>
                <p className="text-[10px] text-[#737373] mt-0.5">Translate audio</p>
              </button>

              <button 
                onClick={() => onNavigate('design')}
                className="p-3 bg-[#F8F8F4] hover:bg-white hover:border-[#111111] border border-[#EEEEEA] rounded-2xl text-left transition-all cursor-pointer group shadow-sm"
              >
                <Calendar className="w-4 h-4 text-[#111111] mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-xs font-bold text-[#111111]">Design Graphics</p>
                <p className="text-[10px] text-[#737373] mt-0.5">Thumbnails & carousels</p>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
