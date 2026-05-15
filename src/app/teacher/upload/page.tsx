"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, CheckCircle2 } from 'lucide-react';

export default function ManualHomeworkEntryPage() {
  const router = useRouter();
  
  const [homeworkItems, setHomeworkItems] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    dueDate: ''
  });

  const handleSaveToDB = async () => {
    setIsSaving(true);
    try {
      const studentRes = await fetch('/api/student/progress');
      const student = await studentRes.json();

      for (const item of homeworkItems) {
        await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            studentId: student._id,
            title: item.title,
            isDaily: false,
            dueDate: item.dueDate,
            status: 'incomplete'
          })
        });
      }

      alert('Homework saved successfully!');
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
    
    if (!formData.title || !formData.subject || !formData.dueDate) {
      alert("Please fill in all fields.");
      return;
    }

    setHomeworkItems([...homeworkItems, formData]);
    setFormData({ title: '', subject: '', dueDate: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <main className="min-h-screen bg-[#edf2fa] p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        {/* Header Row */}
        <div className="flex items-center gap-6 mb-10">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-600 hover:bg-slate-50 transition-colors group"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <h1 className="text-3xl font-bold text-slate-900">
            Add New Week&apos;s Homework
          </h1>
        </div>

        {/* Manual Input Card */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Manual Homework Entry
          </h2>

          <form onSubmit={handleAddItem}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Read Chapter 4"
                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
              />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="e.g. History"
                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
              />
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            
            <button
              type="submit"
              className="bg-[#0a0a1a] hover:bg-slate-800 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 w-full md:w-auto transition-colors font-medium"
            >
              <Plus size={20} />
              Add Item
            </button>
          </form>
        </div>

        {/* Results Table Card */}
        {homeworkItems.length > 0 && (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 className="text-green-500" size={24} />
              <h2 className="text-lg font-semibold text-slate-900">
                Added Homework Items
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-4 text-sm font-semibold text-slate-600 w-1/2">Title</th>
                    <th className="py-4 text-sm font-semibold text-slate-600">Subject</th>
                    <th className="py-4 text-sm font-semibold text-slate-600">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {homeworkItems.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 text-slate-700 font-medium">{item.title}</td>
                      <td className="py-4 text-slate-500">{item.subject}</td>
                      <td className="py-4 text-slate-500">{item.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleSaveToDB}
              disabled={isSaving}
              className="w-full mt-8 py-4 bg-[#0a0a1a] text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors duration-200 shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Homework Items'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
