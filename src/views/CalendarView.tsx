import React, { useState } from 'react';
import { CalendarEvent } from '../types';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarViewProps {
  events: CalendarEvent[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
  const [eventList, setEventList] = useState<CalendarEvent[]>(events);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#111111]">Content Calendar</h2>
          <p className="text-xs text-[#737373]">Manage your publishing schedule across YouTube, Instagram, TikTok, and LinkedIn.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#050505] hover:bg-[#222222] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm">
          <Plus className="w-4 h-4 text-[#C8F34A]" />
          Schedule Content
        </button>
      </div>

      <div className="bg-white border border-[#DEDFD8] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-[#EEEEEA]">
          <h3 className="text-sm font-bold text-[#111111]">October 2026 Schedule</h3>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl border border-[#DEDFD8] hover:bg-[#F8F8F4]"><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-2 rounded-xl border border-[#DEDFD8] hover:bg-[#F8F8F4]"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="space-y-3">
          {eventList.map((ev) => (
            <div key={ev.id} className="flex items-center justify-between p-4 bg-[#F8F8F4] border border-[#EEEEEA] rounded-2xl hover:border-[#DEDFD8] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#DEDFD8] flex items-center justify-center font-bold text-xs text-[#111111]">
                  {ev.platform === 'YouTube' ? 'YT' : ev.platform === 'Instagram' ? 'IG' : 'TK'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">{ev.title}</h4>
                  <p className="text-[10px] text-[#737373]">Scheduled for {ev.date} at {ev.time}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                ev.status === 'Published' ? 'bg-[#3B8D50]/10 text-[#3B8D50]' : 'bg-[#C38A28]/10 text-[#C38A28]'
              }`}>
                {ev.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
