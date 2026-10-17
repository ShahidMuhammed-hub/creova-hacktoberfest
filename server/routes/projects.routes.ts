import { Router } from 'express';

const router = Router();

let mockProjects = [
  { id: 'p1', title: 'Mastering AI Agent Workflows in 2026', contentType: 'Video', status: 'In Production', platform: 'YouTube', updatedAt: '2 hours ago', progress: 65 },
  { id: 'p2', title: '5 Design Principles for High-Converting Carousels', contentType: 'Carousel', status: 'Scheduled', platform: 'Instagram', updatedAt: 'Yesterday', progress: 90 },
  { id: 'p3', title: 'Building Scalable Fullstack Apps with Gemini', contentType: 'Video', status: 'Draft', platform: 'YouTube', updatedAt: '3 days ago', progress: 25 }
];

router.get('/', (req, res) => {
  res.json({ success: true, data: mockProjects });
});

router.post('/', (req, res) => {
  const { title, contentType, platform } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, error: 'Project title is required' });
  }
  const newProject = {
    id: 'p_' + Date.now(),
    title,
    contentType: contentType || 'Video',
    status: 'Draft',
    platform: platform || 'YouTube',
    updatedAt: 'Just now',
    progress: 10
  };
  mockProjects.push(newProject);
  res.status(201).json({ success: true, data: newProject });
});

router.get('/:id', (req, res) => {
  const project = mockProjects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
  res.json({ success: true, data: project });
});

router.patch('/:id', (req, res) => {
  const index = mockProjects.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Project not found' });
  mockProjects[index] = { ...mockProjects[index], ...req.body, updatedAt: 'Just now' };
  res.json({ success: true, data: mockProjects[index] });
});

router.delete('/:id', (req, res) => {
  mockProjects = mockProjects.filter(p => p.id !== req.params.id);
  res.json({ success: true, message: 'Project deleted successfully' });
});

export const projectsRouter = router;
