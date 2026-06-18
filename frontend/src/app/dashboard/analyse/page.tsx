'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import AnalyseForm from '../../../components/AnalyseForm';

export default function DashboardAnalysePage() {
  const { isAuthenticated, initialized } = useAuthStore();
  const router = useRouter();

  // Redirect only after auth state is initialized
  useEffect(() => {
    if (initialized && !isAuthenticated) {
      router.replace('/login');
    }
  }, [initialized, isAuthenticated, router]);

  // Show a loading indicator while auth state is being determined
  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-teal-500/30 border-t-teal-400 animate-spin" />
          <p className="text-sm text-slate-500">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  // If not authenticated after initialization, render nothing (redirect already triggered)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-white">Analyse Resume</h1>
        <p className="text-sm text-slate-500 mt-0.5">Optimize your CV against target job requirements</p>
      </div>
      <AnalyseForm />
    </div>
  );
}
