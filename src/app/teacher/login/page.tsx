"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TeacherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Mock authentication
    if (email === 'teacher@test.com' && password === 'password123') {
      router.push('/teacher/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-[#edf2fa] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-10 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900 text-center mb-8">
            Teacher Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="teacher@test.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-[#0a0a1a] text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors duration-200 shadow-md active:scale-[0.98]"
            >
              Login as Teacher
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm">
            Mock Login: teacher@test.com / password123
          </p>
        </div>
      </div>
    </main>
  );
}
