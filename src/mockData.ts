import { Project, ContentIdea, ScriptItem, SceneItem, TaskItem, CalendarEvent, AnalyticsMetric, BrandProfile } from './types';

export const initialProjects: Project[] = [
  {
    id: 'p1',
    title: 'Mastering AI Agent Workflows in 2026',
    contentType: 'Video',
    status: 'In Production',
    platform: 'YouTube',
    updatedAt: '2 hours ago',
    progress: 65
  },
  {
    id: 'p2',
    title: '5 Design Principles for High-Converting Carousels',
    contentType: 'Carousel',
    status: 'Scheduled',
    platform: 'Instagram',
    updatedAt: 'Yesterday',
    progress: 90
  },
  {
    id: 'p3',
    title: 'Building Scalable Fullstack Apps with Gemini',
    contentType: 'Video',
    status: 'Draft',
    platform: 'YouTube',
    updatedAt: '3 days ago',
    progress: 25
  },
  {
    id: 'p4',
    title: 'The Future of Autonomous Creator Tools',
    contentType: 'Short',
    status: 'Published',
    platform: 'TikTok',
    updatedAt: '5 days ago',
    progress: 100
  }
];

export const initialIdeas: ContentIdea[] = [
  {
    id: 'i1',
    title: 'Why Most Creators Fail at Multilingual Scaling',
    hook: 'Stop translating your videos manually. Here is how top creators automate global reach.',
    niche: 'Creator Economy',
    platform: 'YouTube',
    format: 'Long-form Video',
    estimatedDuration: '10 mins',
    angle: 'Educational & Strategy',
    saved: true,
    createdAt: 'Today'
  },
  {
    id: 'i2',
    title: 'The 3-Step Script Formula That Keeps Viewers Hooked for 8+ Minutes',
    hook: 'If your retention drops at the 30-second mark, you are making this fatal hook mistake.',
    niche: 'Content Strategy',
    platform: 'Instagram',
    format: 'Carousel',
    estimatedDuration: '7 slides',
    angle: 'Actionable Framework',
    saved: true,
    createdAt: 'Yesterday'
  },
  {
    id: 'i3',
    title: 'Unlocking Gemma 4 for Advanced Content Ideation',
    hook: 'Discover how open weights models give creators unprecedented control over their content pipeline.',
    niche: 'AI & Tech',
    platform: 'YouTube',
    format: 'Tutorial',
    estimatedDuration: '12 mins',
    angle: 'Tech Deep-Dive',
    saved: false,
    createdAt: '3 days ago'
  }
];

export const initialScript: ScriptItem = {
  id: 's1',
  title: 'Mastering AI Agent Workflows in 2026',
  platform: 'YouTube',
  targetDuration: '8 minutes',
  language: 'English',
  content: {
    hook: 'What if you could delegate 80% of your content research and outlining to an AI agent while you focus entirely on camera presence?',
    introduction: 'Welcome back to the channel. Today we are breaking down how top creators are leveraging CREOVA and Gemma 4 to build automated creator operating systems.',
    body: 'Point 1: The shift from manual ideation to agentic research.\nPoint 2: Structuring scripts with optimized retention hooks.\nPoint 3: Multi-platform localization without losing brand voice.',
    callToAction: 'Drop a comment below with your biggest content workflow bottleneck, and subscribe for weekly creator engineering breakdowns.'
  },
  wordCount: 340,
  status: 'Ready',
  updatedAt: '2 hours ago'
};

export const initialScenes: SceneItem[] = [
  {
    id: 'sc1',
    sceneNumber: 1,
    title: 'The Hook & Problem Statement',
    duration: '0:00 - 0:45',
    visualDescription: 'Host speaking directly to camera with dynamic split screen showing messy creator workflows.',
    cameraAngle: 'Medium Close-up, Eye Level',
    audioNotes: 'Crisp lavalier mic, subtle background lo-fi beat.',
    status: 'Filmed'
  },
  {
    id: 'sc2',
    sceneNumber: 2,
    title: 'Demonstrating CREOVA Dashboard',
    duration: '0:45 - 2:30',
    visualDescription: 'Screen recording of CREOVA clean white panels, pale grid background, and lime accent indicators.',
    cameraAngle: 'Screen Recording + Picture-in-Picture',
    audioNotes: 'Upbeat transition sound effect.',
    status: 'Editing'
  },
  {
    id: 'sc3',
    sceneNumber: 3,
    title: 'Deep Dive into Gemma 4 AI Generation',
    duration: '2:30 - 5:00',
    visualDescription: 'Close-up of AI script studio generating real-time hooks and scene breakdowns.',
    cameraAngle: 'Over-the-shoulder desk shot',
    audioNotes: 'Narration with gentle synth pad.',
    status: 'Pending'
  }
];

export const initialTasks: TaskItem[] = [
  {
    id: 't1',
    title: 'Finalize B-roll footage for YouTube tutorial',
    priority: 'High',
    dueDate: 'Today, 5:00 PM',
    completed: false,
    project: 'Mastering AI Agent Workflows'
  },
  {
    id: 't2',
    title: 'Review translated Arabic & Malayalam subtitles',
    priority: 'Medium',
    dueDate: 'Tomorrow, 12:00 PM',
    completed: false,
    project: 'Global Reach Expansion'
  },
  {
    id: 't3',
    title: 'Approve Instagram carousel design draft',
    priority: 'High',
    dueDate: 'Today, 2:00 PM',
    completed: true,
    project: '5 Design Principles'
  },
  {
    id: 't4',
    title: 'Schedule weekly newsletter & social drops',
    priority: 'Low',
    dueDate: 'Oct 20',
    completed: false
  }
];

export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'e1',
    title: 'Mastering AI Agent Workflows',
    date: '2026-10-18',
    time: '10:00 AM',
    platform: 'YouTube',
    status: 'Scheduled'
  },
  {
    id: 'e2',
    title: '5 Design Principles Carousel',
    date: '2026-10-19',
    time: '02:00 PM',
    platform: 'Instagram',
    status: 'Scheduled'
  },
  {
    id: 'e3',
    title: 'Future of Autonomous Creator Tools',
    date: '2026-10-12',
    time: '11:30 AM',
    platform: 'TikTok',
    status: 'Published'
  }
];

export const initialMetrics: AnalyticsMetric[] = [
  { label: 'Total Views', value: '248,590', change: '+18.4%', isPositive: true },
  { label: 'Engagement Rate', value: '8.7%', change: '+2.1%', isPositive: true },
  { label: 'Subscriber Growth', value: '+14,250', change: '+12.8%', isPositive: true },
  { label: 'Published Content', value: '42 items', change: '+5 items', isPositive: true }
];

export const initialBrandProfile: BrandProfile = {
  name: 'CREOVA Studio',
  tagline: 'Create Smarter. Grow Further.',
  niche: 'Creator Economy & AI Engineering',
  primaryColor: '#C8F34A',
  secondaryColor: '#050505',
  fontFamily: 'Inter, sans-serif',
  tone: 'Authoritative, Inspiring, & Practical',
  targetAudience: 'Digital Creators, Founders, and Modern Educators',
  languages: ['English', 'Malayalam', 'Arabic', 'Urdu']
};
