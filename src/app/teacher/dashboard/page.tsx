"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, ListChecks, ClipboardCheck, Check, X, Inbox } from 'lucide-react';

export default function TeacherDashboardPage() {
  const router = useRouter();

  const [pendingRequests, setPendingRequests] = React.useState<any[]>([]);

  const fetchPending = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch pending tasks');
      const waiting = data.filter((t: any) => t.status === 'waiting');
      setPendingRequests(waiting);
    } catch (error) {
      console.error('Error fetching pending tasks:', error);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      // 1. Mark task as complete
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'complete' })
      });

      // 2. Award coins to student
      const studentRes = await fetch('/api/student/progress');
      const student = await studentRes.json();
      
      await fetch('/api/student/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coins: (student.coins || 0) + 1 })
      });

      fetchPending();
    } catch (error) {
      console.error('Error approving task:', error);
    }
  };

  const handleReturn = async (id: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'incomplete' })
      });
      fetchPending();
    } catch (error) {
      console.error('Error returning task:', error);
    }
  };

  return (
    <main className="min-h-screen bg-[#edf2fa] p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header Area */}
        <div className="mb-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-600 hover:bg-slate-50 transition-colors mb-6 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>

          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Teacher / Parent Dashboard
          </h1>
          <p className="text-slate-600">
            Manage your classroom homework
          </p>
        </div>

        {/* Top Grid: Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Card 1: Upload */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col">
            <div className="bg-blue-100 rounded-xl w-12 h-12 flex items-center justify-center mb-6">
              <Upload className="text-blue-600" size={24} />
            </div>
            
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              Upload New Week's Homework
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Upload an image of homework assignments and let AI process them
            </p>
            
            <button 
              onClick={() => router.push('/teacher/upload')}
              className="w-full mt-auto py-3.5 px-6 bg-[#0a0a1a] text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors duration-200 shadow-sm"
            >
              Upload Homework
            </button>
          </div>

          {/* Card 2: Manage */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col">
            <div className="bg-green-100 rounded-xl w-12 h-12 flex items-center justify-center mb-6">
              <ListChecks className="text-green-600" size={24} />
            </div>
            
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              Check Student's Assignments
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              View the daily quests and weekly assignments the student has.
            </p>
            
            <button 
              onClick={() => router.push('/student/dashboard')}
              className="w-full mt-auto py-3.5 px-6 bg-[#0a0a1a] text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors duration-200 shadow-sm"
            >
              See Homework
            </button>
          </div>
        </div>

        {/* Pending Approvals Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <ClipboardCheck className="text-amber-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Pending Approvals</h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {pendingRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/50">
                      <th className="py-4 px-6 text-sm font-semibold text-slate-600">Student</th>
                      <th className="py-4 px-6 text-sm font-semibold text-slate-600">Assignment</th>
                      <th className="py-4 px-6 text-sm font-semibold text-slate-600 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {pendingRequests.map((req) => (
                      <tr key={req._id} className="hover:bg-slate-50 transition-colors group">
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                              S
                            </div>
                            <span className="font-semibold text-slate-800">Student</span>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <p className="text-sm text-slate-600 font-medium">{req.title}</p>
                          <p className="text-xs text-slate-400 mt-1">Submitted on {req.date || req.dueDate || 'N/A'}</p>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleApprove(req._id)}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors shadow-sm"
                              title="Approve"
                            >
                              <Check size={18} />
                            </button>
                            <button 
                              onClick={() => handleReturn(req._id)}
                              className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors shadow-sm"
                              title="Return to Student"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Inbox className="text-slate-300" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">You&apos;re all caught up!</h3>
                <p className="text-slate-500">No pending homework to review.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
