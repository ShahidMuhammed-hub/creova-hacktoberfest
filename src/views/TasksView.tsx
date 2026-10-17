import React, { useState } from 'react';
import { TaskItem } from '../types';
import { CheckSquare, CheckCircle2, Circle, Plus, X, Calendar, Flag } from 'lucide-react';

interface TasksViewProps {
  tasks: TaskItem[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: TaskItem) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ tasks, onToggleTask, onAddTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [dueDate, setDueDate] = useState('Tomorrow');
  const [projectName, setProjectName] = useState('Creator Workflow');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: TaskItem = {
      id: 't_' + Date.now(),
      title,
      priority,
      dueDate,
      completed: false,
      project: projectName
    };

    onAddTask(newTask);
    setTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#111111]">Tasks & Productivity</h2>
          <p className="text-xs text-[#737373]">Manage production deadlines, research checklists, and publishing tasks.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[#050505] hover:bg-[#222222] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C8F34A]" />
          Add Task
        </button>
      </div>

      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-4 bg-[#F8F8F4] border border-[#EEEEEA] rounded-2xl hover:border-[#DEDFD8] transition-all">
            <div className="flex items-center gap-3">
              <button onClick={() => onToggleTask(task.id)} className="cursor-pointer text-[#3B8D50]">
                {task.completed ? <CheckCircle2 className="w-5 h-5 fill-[#3B8D50]/10" /> : <Circle className="w-5 h-5 text-[#888888]" />}
              </button>
              <div>
                <p className={`text-xs font-bold ${task.completed ? 'line-through text-[#888888]' : 'text-[#111111]'}`}>
                  {task.title}
                </p>
                <p className="text-[10px] text-[#737373]">Due: {task.dueDate} {task.project ? `• ${task.project}` : ''}</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
              task.priority === 'High' ? 'bg-[#D64545]/10 text-[#D64545]' : 'bg-[#C38A28]/10 text-[#C38A28]'
            }`}>
              {task.priority}
            </span>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEEEEA]">
              <h3 className="text-sm font-extrabold text-[#111111]">Create New Task</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#888888] hover:text-[#111111] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#737373] uppercase mb-1.5">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g., Final color grading for YouTube master..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-4 py-3 text-xs text-[#111111] outline-none focus:border-[#111111]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#737373] uppercase mb-1.5">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-3 py-2.5 text-xs text-[#111111] outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#737373] uppercase mb-1.5">Due Date</label>
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    placeholder="e.g., Today, Tomorrow"
                    className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-3 py-2.5 text-xs text-[#111111] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#737373] uppercase mb-1.5">Project / Category</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., YouTube Masterclass"
                  className="w-full bg-[#F8F8F4] border border-[#DEDFD8] rounded-xl px-4 py-2.5 text-xs text-[#111111] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#EEEEEA]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#F8F8F4] hover:bg-[#EEEEEE] text-[#111111] rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#050505] hover:bg-[#222222] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
