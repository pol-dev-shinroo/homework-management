"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Coins, 
  Calendar, 
  ListTodo, 
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function StudentDashboardPage() {
  const router = useRouter();

  // Collapsible state
  const [isDailyOpen, setIsDailyOpen] = useState(true);
  const [isWeeklyOpen, setIsWeeklyOpen] = useState(true);

  const [weeklyTasks, setWeeklyTasks] = useState<any[]>([]);
  const [dailyQuests, setDailyQuests] = useState<any[]>([]);
  const [coins, setCoins] = useState(0);

  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/student/progress');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch progress');
      setCoins(data.coins || 0);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch tasks');
      
      const weekly = data.filter((t: any) => !t.isDaily);
      const daily = data.filter((t: any) => t.isDaily);

      setWeeklyTasks(weekly);
      
      // Group daily tasks by date
      const grouped: { [key: string]: any } = {};
      daily.forEach((t: any) => {
        const dateKey = t.date || 'Today';
        if (!grouped[dateKey]) {
          grouped[dateKey] = {
            day: '', // Could be derived from date if needed
            date: dateKey,
            tasks: []
          };
        }
        grouped[dateKey].tasks.push(t);
      });
      
      setDailyQuests(Object.values(grouped));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProgress();
  }, []);

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'incomplete':
        return <span className="inline-block px-4 py-1.5 bg-slate-200 text-slate-600 text-xs font-bold rounded-full whitespace-nowrap">Incomplete</span>;
      case 'waiting':
        return <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full whitespace-nowrap">Waiting for Teacher</span>;
      case 'complete':
        return <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-full whitespace-nowrap">Complete</span>;
      default:
        return null;
    }
  };

  const renderActionButton = (task: any) => {
    if (task.status === 'incomplete') {
      return (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            updateTaskStatus(task._id, 'waiting');
          }}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-6 rounded-full border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all text-xs shadow-sm"
        >
          Finish
        </button>
      );
    }
    if (task.status === 'waiting') {
      return (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            updateTaskStatus(task._id, 'incomplete');
          }}
          className="px-6 py-2 border-2 border-slate-200 text-slate-500 text-xs font-bold rounded-full hover:bg-slate-50 transition-all active:scale-[0.98]"
        >
          Cancel
        </button>
      );
    }
    return null;
  };

  return (
    <main className="min-h-screen bg-indigo-50 p-8 relative font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.back()}
              className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-600 hover:bg-slate-50 transition-colors group"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-4xl font-black text-indigo-900 tracking-tight">Student Dashboard</h1>
              <p className="text-indigo-600/70 font-medium text-lg">View and submit your homework</p>
            </div>
          </div>

          <div 
            onClick={() => router.push('/student/rewards')}
            data-testid="coins-widget"
            className="group border-2 border-yellow-400 bg-yellow-100 rounded-3xl p-5 flex items-center gap-5 cursor-pointer hover:bg-yellow-200 transition shadow-md w-fit self-start md:self-auto"
          >
            <div className="bg-yellow-400 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-inner group-hover:rotate-12 transition-transform duration-300">
              <Coins size={28} />
            </div>
            <div>
              <p className="text-sm text-yellow-800 font-bold uppercase tracking-wider">Your Coins</p>
              <p className="text-3xl font-black text-amber-700">{coins}</p>
            </div>
          </div>
        </div>

        {/* Main Content Area: Stacked Layout */}
        <div className="flex flex-col gap-10 mt-8">
          
          {/* Section A: Daily Schedule (Daily Quests) */}
          <div className="w-full bg-white rounded-[2rem] p-8 shadow-lg overflow-hidden flex flex-col border border-indigo-100/50">
            <div 
              className="flex items-center gap-4 cursor-pointer hover:bg-indigo-50/50 p-2 -m-2 rounded-2xl transition-colors mb-6"
              onClick={() => setIsDailyOpen(!isDailyOpen)}
            >
              <div className="p-3 bg-indigo-100 rounded-2xl">
                <Calendar className="text-indigo-600" size={28} />
              </div>
              <h2 className="text-2xl font-black text-indigo-900">Daily Quests</h2>
              <div className="ml-auto text-indigo-300">
                {isDailyOpen ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
              </div>
            </div>

            {isDailyOpen && (
              <div className="w-full">
                <div className="grid grid-cols-12 gap-4 pb-4 border-b border-indigo-50/50 mb-2 px-4">
                  <div className="col-span-6 text-sm font-bold text-indigo-300 uppercase tracking-widest">Task</div>
                  <div className="col-span-3 text-sm font-bold text-indigo-300 uppercase tracking-widest text-center">Status</div>
                  <div className="col-span-3 text-sm font-bold text-indigo-300 uppercase tracking-widest text-right pr-4">Action</div>
                </div>
                
                <div className="space-y-4">
                  {dailyQuests.map((day, dIdx) => (
                    <div key={dIdx} className="space-y-2">
                      <div className="inline-block bg-indigo-100 text-indigo-800 font-black px-5 py-2 rounded-full mt-4 mb-2 text-xs uppercase tracking-wider">
                        {day.date}
                      </div>
                      {day.tasks.map((task: any) => (
                        <div key={task._id} className="grid grid-cols-12 items-center gap-4 p-4 rounded-2xl hover:bg-indigo-50/30 transition-colors group">
                          <div className="col-span-6">
                            <p className={`text-base font-bold leading-relaxed ${task.status === 'complete' ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
                              {task.title}
                            </p>
                          </div>
                          <div className="col-span-3 flex justify-center">
                            {renderStatusBadge(task.status)}
                          </div>
                          <div className="col-span-3 flex justify-end pr-2">
                            {renderActionButton(task)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section B: Overall Weekly Homework (Weekly Assignments) */}
          <div className="w-full bg-white rounded-[2rem] p-8 shadow-lg border border-indigo-100/50">
            <div 
              className="flex items-center gap-4 cursor-pointer hover:bg-indigo-50/50 p-2 -m-2 rounded-2xl transition-colors mb-8"
              onClick={() => setIsWeeklyOpen(!isWeeklyOpen)}
            >
              <div className="p-3 bg-indigo-100 rounded-2xl">
                <ListTodo className="text-indigo-600" size={28} />
              </div>
              <h2 className="text-2xl font-black text-indigo-900">Weekly Assignments</h2>
              <div className="ml-auto text-indigo-300">
                {isWeeklyOpen ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
              </div>
            </div>

            {isWeeklyOpen && (
              <div className="w-full">
                <div className="grid grid-cols-12 gap-4 pb-4 border-b border-indigo-50/50 mb-4 px-4">
                  <div className="col-span-6 text-sm font-bold text-indigo-300 uppercase tracking-widest">Assignment Title</div>
                  <div className="col-span-3 text-sm font-bold text-indigo-300 uppercase tracking-widest text-center">Status</div>
                  <div className="col-span-3 text-sm font-bold text-indigo-300 uppercase tracking-widest text-right pr-4">Action</div>
                </div>

                <div className="space-y-3">
                  {weeklyTasks.map((task: any) => (
                    <div key={task._id} className="grid grid-cols-12 items-center gap-4 p-5 rounded-3xl hover:bg-indigo-50/30 transition-colors group">
                      <div className="col-span-6">
                        <p className={`text-lg font-black leading-relaxed ${task.status === 'complete' ? 'text-slate-300 line-through' : 'text-slate-700'}`}>
                          {task.title}
                        </p>
                      </div>
                      <div className="col-span-3 flex justify-center">
                        {renderStatusBadge(task.status)}
                      </div>
                      <div className="col-span-3 flex justify-end pr-2">
                        {renderActionButton(task)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 bg-indigo-900 text-white p-4 rounded-full shadow-2xl cursor-pointer hover:scale-110 hover:-rotate-6 transition-all active:scale-95 group z-50">
        <HelpCircle size={32} />
        <span className="absolute right-full mr-5 top-1/2 -translate-y-1/2 bg-indigo-900 text-white text-sm font-black px-4 py-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border-2 border-indigo-700">
          Need help?
        </span>
      </div>
    </main>
  );
}
