export type ViewMode = 
  | 'dashboard'
  | 'discover'
  | 'ideas'
  | 'scripts'
  | 'production'
  | 'localization'
  | 'design'
  | 'calendar'
  | 'publishing'
  | 'analytics'
  | 'tasks'
  | 'projects'
  | 'brandkit'
  | 'integrations'
  | 'settings';

export interface Project {
  id: string;
  title: string;
  contentType: 'Video' | 'Carousel' | 'Short' | 'Article';
  status: 'Draft' | 'In Production' | 'Scheduled' | 'Published';
  platform: 'YouTube' | 'Instagram' | 'TikTok' | 'LinkedIn';
  updatedAt: string;
  progress: number;
}

export interface ContentIdea {
  id: string;
  title: string;
  hook: string;
  niche: string;
  platform: 'YouTube' | 'Instagram' | 'TikTok' | 'LinkedIn';
  format: string;
  estimatedDuration: string;
  angle: string;
  saved: boolean;
  createdAt: string;
}

export interface ScriptItem {
  id: string;
  title: string;
  ideaId?: string;
  platform: 'YouTube' | 'Instagram' | 'TikTok' | 'LinkedIn';
  targetDuration: string;
  language: string;
  content: {
    hook: string;
    introduction: string;
    body: string;
    callToAction: string;
  };
  wordCount: number;
  status: 'Draft' | 'Ready' | 'Filmed';
  updatedAt: string;
}

export interface SceneItem {
  id: string;
  sceneNumber: number;
  title: string;
  duration: string;
  visualDescription: string;
  cameraAngle: string;
  audioNotes: string;
  status: 'Pending' | 'Filmed' | 'Editing';
}

export interface TaskItem {
  id: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  completed: boolean;
  project?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  platform: 'YouTube' | 'Instagram' | 'TikTok' | 'LinkedIn';
  status: 'Scheduled' | 'Published' | 'Draft';
  thumbnailUrl?: string;
}

export interface AnalyticsMetric {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export interface BrandProfile {
  name: string;
  tagline: string;
  niche: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  tone: string;
  targetAudience: string;
  languages: string[];
}
