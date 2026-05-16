"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Calendar, ListTodo, Save } from 'lucide-react';

export default function ManualHomeworkEntryPage() {
  const router = useRouter();
  
  const [homeworkItems, setHomeworkItems] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [taskType, setTaskType] = useState<'daily' | 'weekly'>('daily');
  const [formData, setFormData] = useState({ title: '', date: '', dueDate: '' });

  const handleSaveToDB = async () => {
    setIsSaving(true);
    try {
      const studentRes = await fetch('/api/student/progress');
      const student = await studentRes.json();

      for (const item of homeworkItems) {
        await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: student._id,
            title: item.title,
            isDaily: item.isDaily,
            date: item.date,
            dueDate: item.dueDate,
            status: 'incomplete'
          })
        });
      }

      alert('Homework assigned successfully!');
      router.push('/teacher/dashboard');
    } catch (error) {
      console.error('Error saving homework:', error);
      alert('Failed to save homework. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert("Please provide a task title.");
    if (taskType === 'daily' && !formData.date) return alert("Please select a date for the daily quest.");
    if (taskType === 'weekly' && !formData.dueDate) return alert("Please select a due date for the weekly assignment.");

    setHomeworkItems([...homeworkItems, { 
      ...formData, 
      id: Date.now(),
      isDaily: taskType === 'daily' 
    }]);
    setFormData({ title: '', date: '', dueDate: '' });
  };

  const dailyItems = homeworkItems.filter(item => item.isDaily);
  const weeklyItems = homeworkItems.filter(item => !item.isDaily);

  return (
    <main className="min-h-screen bg-indigo-50 p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-6">
            <button
              onClick={() => router.back()}
              className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-600 hover:bg-slate-50 transition-colors group"
            >
              <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-4xl font-black text-indigo-900 tracking-tight">Assign Homework</h1>
              <p className="text-indigo-600/70 font-medium text-lg">Build the student's schedule for the week</p>
            </div>
          </div>
          {homeworkItems.length > 0 && (
            <button
              onClick={handleSaveToDB}
              disabled={isSaving}
              className="bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-8 rounded-full border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Save size={20} />
              {isSaving ? 'Publishing...' : 'Publish to Student'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-4 h-fit bg-white rounded-[2rem] p-6 shadow-lg border border-indigo-100/50">
            <h2 className="text-xl font-black text-indigo-900 mb-6">Create New Task</h2>
            
            {/* Toggle switch */}
            <div className="flex bg-indigo-50 rounded-xl p-1 mb-6">
              <button
                className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${taskType === 'daily' ? 'bg-white text-indigo-900 shadow-sm' : 'text-indigo-400 hover:text-indigo-600'}`}
                onClick={() => setTaskType('daily')}
              >
                <Calendar size={16} /> Daily Quest
              </button>
              <button
                className={`flex-1 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${taskType === 'weekly' ? 'bg-white text-indigo-900 shadow-sm' : 'text-indigo-400 hover:text-indigo-600'}`}
                onClick={() => setTaskType('weekly')}
              >
                <ListTodo size={16} /> Weekly Assign
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Task Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Read Chapter 4"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-700"
                />
              </div>

              {taskType === 'daily' ? (
                <div>
                  <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Day / Date</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    placeholder="e.g. Monday, May 16"
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-700"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-3 outline-none focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-700"
                  />
                </div>
              )}
              
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all mt-4"
              >
                Add to Schedule
              </button>
            </form>
          </div>

          {/* Right Column: Student Preview */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Daily Quests Preview */}
            <div className={`bg-white rounded-[2rem] p-6 shadow-lg border border-indigo-100/50 transition-opacity ${dailyItems.length === 0 ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <Calendar className="text-indigo-600" size={20} />
                </div>
                <h2 className="text-xl font-black text-indigo-900">Daily Quests Preview</h2>
              </div>
              
              {dailyItems.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-medium bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  No daily quests assigned yet
                </div>
              ) : (
                <div className="space-y-3">
                  {dailyItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50/50 group">
                      <div>
                        <span className="text-xs font-black text-indigo-400 uppercase tracking-wider block mb-1">{item.date}</span>
                        <p className="font-bold text-slate-700">{item.title}</p>
                      </div>
                      <button onClick={() => setHomeworkItems(homeworkItems.filter(i => i.id !== item.id))} className="text-red-400 hover:text-red-600 font-bold text-sm bg-white px-3 py-1 rounded-lg shadow-sm">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Weekly Assignments Preview */}
            <div className={`bg-white rounded-[2rem] p-6 shadow-lg border border-indigo-100/50 transition-opacity ${weeklyItems.length === 0 ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <ListTodo className="text-indigo-600" size={20} />
                </div>
                <h2 className="text-xl font-black text-indigo-900">Weekly Assignments Preview</h2>
              </div>
              
              {weeklyItems.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-medium bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  No weekly assignments added yet
                </div>
              ) : (
                <div className="space-y-3">
                  {weeklyItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50/50 group">
                      <div>
                        <span className="text-xs font-black text-indigo-400 uppercase tracking-wider block mb-1">Due: {item.dueDate}</span>
                        <p className="font-bold text-slate-700">{item.title}</p>
                      </div>
                      <button onClick={() => setHomeworkItems(homeworkItems.filter(i => i.id !== item.id))} className="text-red-400 hover:text-red-600 font-bold text-sm bg-white px-3 py-1 rounded-lg shadow-sm">Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
