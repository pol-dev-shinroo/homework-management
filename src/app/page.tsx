"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, BookOpen, Users } from 'lucide-react';

export default function RoleSelectionPage() {
  const router = useRouter();

  const roles = [
    {
      title: "Teacher / Parent",
      description: "Manage, assign, and monitor homework",
      icon: <GraduationCap className="w-10 h-10 text-blue-600" />,
      iconBg: "bg-blue-100",
      buttonText: "Login as Teacher / Parent",
      path: "/teacher/dashboard"
    },
    {
      title: "Student",
      description: "View and submit homework",
      icon: <BookOpen className="w-10 h-10 text-green-600" />,
      iconBg: "bg-green-100",
      buttonText: "Login as Student",
      path: "/student/dashboard"
    },
  ];

  return (
    <main className="min-h-screen bg-[#edf2fa] flex flex-col items-center justify-center p-6 font-sans">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          Homework Manager
        </h1>
        <p className="text-lg text-slate-600">
          Select your role to continue
        </p>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full">
        {roles.map((role, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col items-center text-center"
          >
            {/* Icon Wrapper */}
            <div className={`w-20 h-20 ${role.iconBg} rounded-full flex items-center justify-center mb-6`}>
              {role.icon}
            </div>

            {/* Content */}
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              {role.title}
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              {role.description}
            </p>

            {/* Action Button */}
            <button 
              onClick={() => role.path !== "#" && router.push(role.path)}
              className="w-full mt-auto py-3 px-6 bg-[#0a0a1a] text-white font-semibold rounded-xl transition-colors duration-200 hover:bg-slate-800"
            >
              {role.buttonText}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
