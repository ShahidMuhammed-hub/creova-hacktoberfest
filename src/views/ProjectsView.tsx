import React, { useState } from 'react';
import { Project } from '../types';
import { FolderKanban, Plus, FileText, ArrowRight, X, Check, Trash2, Sparkles } from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  onProjectAdded?: (project: Project) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, onProjectAdded }) => {
  const [projectList, setProjectList] = useState<Project[]>(projects);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'Video' | 'Carousel' | 'Short' | 'Article'>('Video');
  const [newPlatform, setNewPlatform] = useState<'YouTube' | 'Instagram' | 'TikTok' | 'LinkedIn'>('YouTube');
  const [loading, setLoading] = useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/v1/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          contentType: newType,
          platform: newPlatform
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setProjectList([data.data, ...projectList]);
        if (onProjectAdded) onProjectAdded(data.data);
        setIsNewModalOpen(false);
        setNewTitle('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await fetch(`/api/v1/projects/${id}`, { method: 'DELETE' });
      setProjectList(projectList.filter(p => p.id !== id));
      if (activeProject?.id === id) setActiveProject(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#111111]">Projects & Assets</h2>
          <p className="text-xs text-[#737373]">All your active and archived video projects, carousels, and media assets.</p>
        </div>
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center gap-2 bg-[#050505] hover:bg-[#222222] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C8F34A]" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projectList.map((p) => (
          <div key={p.id} className="bg-white border border-[#DEDFD8] hover:border-[#111111] rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4 transition-all">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 bg-[#C8F34A]/30 text-[#111111] rounded-full text-[10px] font-bold">
                  {p.platform}
                </span>
                <span className="text-[10px] text-[#737373]">Updated {p.updatedAt}</span>
              </div>
              <h3 className="text-sm font-bold text-[#111111]">{p.title}</h3>
              <p className="text-xs text-[#737373] mt-1">Type: {p.contentType} • Progress: {p.progress}%</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#EEEEEA]">
              <span className="px-2.5 py-1 bg-[#F8F8F4] border border-[#DEDFD8] text-[#111111] rounded-full text-[10px] font-bold">{p.status}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteProject(p.id)}
                  className="p-2 text-[#888888] hover:text-[#D64545] transition-colors cursor-pointer"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveProject(p)}
                  className="px-3 py-1.5 bg-[#050505] text-white rounded-xl text-xs font-bold hover:bg-[#222222] transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Open Project</span>
                  <ArrowRight className="w-3 h-3 text-[#C8F34A]" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#DEDFD8] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEA]">
              <h3 className="text-sm font-bold text-[#111111]">Create New Project</h3>
              <button onClick={() => setIsNewModalOpen(false)} className="text-[#888888] hover:text-[#111111]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#737373] uppercase mb-1">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g., Ultimate AI Tutorial 2026..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-4 py-2.5 text-xs text-[#111111] outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#737373] uppercase mb-1">Content Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-3 py-2.5 text-xs text-[#111111] outline-none"
                  >
                    <option value="Video">Video</option>
                    <option value="Carousel">Carousel</option>
                    <option value="Short">Short</option>
                    <option value="Article">Article</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#737373] uppercase mb-1">Platform</label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value as any)}
                    className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-3 py-2.5 text-xs text-[#111111] outline-none"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="LinkedIn">LinkedIn</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#050505] hover:bg-[#222222] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                {loading ? 'Creating Project...' : 'Save & Initialize Project'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Open Project Workspace Modal */}
      {activeProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#DEDFD8] rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#EEEEEA]">
              <div>
                <span className="px-2.5 py-0.5 bg-[#C8F34A]/30 text-[#111111] rounded-full text-[10px] font-bold">
                  {activeProject.platform} • {activeProject.contentType}
                </span>
                <h3 className="text-lg font-extrabold text-[#111111] mt-1">{activeProject.title}</h3>
              </div>
              <button onClick={() => setActiveProject(null)} className="w-8 h-8 rounded-xl bg-[#F8F8F4] flex items-center justify-center text-[#888888] hover:text-[#111111]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#F8F8F4] border border-[#EEEEEA] rounded-2xl space-y-2">
                <p className="text-xs font-bold text-[#111111]">Project Status & Progress</p>
                <div className="flex items-center justify-between text-xs text-[#737373]">
                  <span>Status: {activeProject.status}</span>
                  <span>{activeProject.progress}% Completed</span>
                </div>
                <div className="w-full h-2 bg-[#DEDFD8] rounded-full overflow-hidden">
                  <div className="h-full bg-[#C8F34A]" style={{ width: `${activeProject.progress}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => alert('Opening Script Studio for this project...')}
                  className="p-4 bg-[#F8F8F4] hover:bg-[#EEEEEA] border border-[#DEDFD8] rounded-2xl text-left transition-all cursor-pointer"
                >
                  <p className="text-xs font-bold text-[#111111]">Edit Script</p>
                  <p className="text-[10px] text-[#737373]">Hooks, intro, and body</p>
                </button>
                <button 
                  onClick={() => alert('Opening Production Planner...')}
                  className="p-4 bg-[#F8F8F4] hover:bg-[#EEEEEA] border border-[#DEDFD8] rounded-2xl text-left transition-all cursor-pointer"
                >
                  <p className="text-xs font-bold text-[#111111]">Storyboard Scenes</p>
                  <p className="text-[10px] text-[#737373]">Camera angles & B-roll</p>
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#EEEEEA] flex justify-end">
              <button
                onClick={() => setActiveProject(null)}
                className="px-5 py-2.5 bg-[#050505] text-white rounded-xl text-xs font-bold hover:bg-[#222222] transition-all cursor-pointer"
              >
                Close Workspace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
