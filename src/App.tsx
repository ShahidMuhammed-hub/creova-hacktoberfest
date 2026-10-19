import React, { useState, useEffect } from 'react';
import { House, Sparkles, FolderKanban, Menu, X } from 'lucide-react';
import { ViewMode, Project, ContentIdea, ScriptItem, SceneItem, TaskItem, CalendarEvent } from './types';
import { 
  initialProjects, 
  initialIdeas, 
  initialScript, 
  initialScenes, 
  initialTasks, 
  initialCalendarEvents 
} from './mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CreateContentModal } from './components/CreateContentModal';
import { AIAgentDrawer } from './components/AIAgentDrawer';

import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { DiscoverView } from './views/DiscoverView';
import { IdeaStudioView } from './views/IdeaStudioView';
import { ScriptStudioView } from './views/ScriptStudioView';
import { ProductionView } from './views/ProductionView';
import { LocalizationView } from './views/LocalizationView';
import { DesignStudioView } from './views/DesignStudioView';
import { CalendarView } from './views/CalendarView';
import { PublishingView } from './views/PublishingView';
import { AnalyticsView } from './views/AnalyticsView';
import { TasksView } from './views/TasksView';
import { ProjectsView } from './views/ProjectsView';
import { BrandKitView } from './views/BrandKitView';
import { IntegrationsView } from './views/IntegrationsView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'Alex Morgan',
    email: 'alex@creova.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
  });

  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [ideas, setIdeas] = useState<ContentIdea[]>(initialIdeas);
  const [script, setScript] = useState<ScriptItem>(initialScript);
  const [scenes] = useState<SceneItem[]>(initialScenes);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [calendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAIAgentOpen, setIsAIAgentOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setIsMobileMenuOpen(false); };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [isMobileMenuOpen]);

  // Fetch initial data from backend API v1 on mount
  useEffect(() => {
    fetch('/api/v1/projects')
      .then(res => res.json())
      .then(data => { if (data.success && data.data) setProjects(data.data); })
      .catch(() => {});

    fetch('/api/v1/ideas')
      .then(res => res.json())
      .then(data => { if (data.success && data.data) setIdeas(data.data); })
      .catch(() => {});

    fetch('/api/v1/tasks')
      .then(res => res.json())
      .then(data => { if (data.success && data.data) setTasks(data.data); })
      .catch(() => {});

    fetch('/api/v1/publishing/calendar')
      .then(res => res.json())
      .then(data => { if (data.success && data.data) { /* calendar events */ } })
      .catch(() => {});
  }, []);

  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const newCompleted = !task.completed;

    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: newCompleted } : t));
    
    try {
      await fetch(`/api/v1/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: newCompleted })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddIdea = (newIdea: ContentIdea) => {
    setIdeas([newIdea, ...ideas]);
  };

  const handleConvertToScript = (idea: ContentIdea, generatedScript: ScriptItem) => {
    setScript(generatedScript);
    setCurrentView('scripts');
  };

  const handleAddTask = (newTask: TaskItem) => {
    setTasks([newTask, ...tasks]);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            projects={projects}
            ideas={ideas}
            tasks={tasks}
            calendarEvents={calendarEvents}
            onNavigate={setCurrentView}
            onToggleTask={handleToggleTask}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />
        );
      case 'discover':
        return <DiscoverView />;
      case 'ideas':
        return <IdeaStudioView ideas={ideas} onAddIdea={handleAddIdea} onConvertToScript={handleConvertToScript} onNavigate={setCurrentView} />;
      case 'scripts':
        return <ScriptStudioView script={script} onUpdateScript={setScript} />;
      case 'production':
        return <ProductionView scenes={scenes} />;
      case 'localization':
        return <LocalizationView />;
      case 'design':
        return <DesignStudioView />;
      case 'calendar':
        return <CalendarView events={calendarEvents} />;
      case 'publishing':
        return <PublishingView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'tasks':
        return <TasksView tasks={tasks} onToggleTask={handleToggleTask} onAddTask={handleAddTask} />;
      case 'projects':
        return <ProjectsView projects={projects} />;
      case 'brandkit':
        return <BrandKitView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'settings':
        return <SettingsView onLogout={() => setIsAuthenticated(false)} currentUser={currentUser} />;
      default:
        return <DashboardView projects={projects} ideas={ideas} tasks={tasks} calendarEvents={calendarEvents} onNavigate={setCurrentView} onToggleTask={handleToggleTask} onOpenCreateModal={() => setIsCreateModalOpen(true)} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginView
        onLogin={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="flex min-h-dvh min-w-0 bg-grid-pattern">
      <div className="hidden md:block shrink-0"><Sidebar currentView={currentView} onSelectView={handleNavigate} /></div>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="presentation">
          <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-black/60" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[min(85vw,320px)] shadow-2xl" role="dialog" aria-modal="true" aria-label="CREOVA navigation">
            <Sidebar currentView={currentView} onSelectView={handleNavigate} isMobile />
            <button type="button" className="absolute right-3 top-5 rounded-lg p-2 text-white bg-white/10" aria-label="Close menu" onClick={() => setIsMobileMenuOpen(false)}><X size={20}/></button>
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Header 
          currentView={currentView} 
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenCreateModal={() => setIsCreateModalOpen(true)} 
          onOpenAIAgent={() => setIsAIAgentOpen(true)}
          currentUser={currentUser}
          onLogout={() => setIsAuthenticated(false)}
          onNavigate={handleNavigate}
        />
        <main className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto pb-20 md:pb-0 creova-mobile-main">
          {renderCurrentView()}
        </main>
        <nav aria-label="Mobile navigation" className="fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-[#080808] text-white md:hidden" style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
          <div className="grid grid-cols-4 h-16">
            {[
              { label: 'Home', icon: House, action: () => handleNavigate('dashboard'), active: currentView === 'dashboard' },
              { label: 'AI Agent', icon: Sparkles, action: () => setIsAIAgentOpen(true), active: isAIAgentOpen },
              { label: 'Projects', icon: FolderKanban, action: () => handleNavigate('projects'), active: currentView === 'projects' },
              { label: 'Menu', icon: Menu, action: () => setIsMobileMenuOpen(true), active: isMobileMenuOpen },
            ].map(item => { const Icon = item.icon; return (
              <button key={item.label} type="button" onClick={item.action} aria-label={item.label} className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${item.active ? 'text-[#C8F34A]' : 'text-[#b8b8b8]'}`}>
                <Icon size={21}/><span>{item.label}</span>
              </button>
            ); })}
          </div>
        </nav>
      </div>

      <CreateContentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onNavigate={setCurrentView}
      />

      <AIAgentDrawer
        isOpen={isAIAgentOpen}
        onClose={() => setIsAIAgentOpen(false)}
      />
    </div>
  );
}
