'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { useRouter } from 'next/navigation';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HistoryItem {
  id: string;
  createdAt: string;
  jobDescription: {
    company: string;
    role: string;
    description: string;
    salary?: string;
  };
  analysis: {
    overallScore: number;
    atsScore: number;
    skillsScore: number;
    structureScore: number;
    styleScore: number;
    analysisResult: any;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ScorePill({ score }: { score: number }) {
  if (score >= 80) return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{score}</span>;
  if (score >= 60) return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">{score}</span>;
  return <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">{score}</span>;
}

function FeatureList({ features }: { features: { name: string; status: string; feedback: string }[] }) {
  return (
    <ul className="space-y-2.5 mt-2">
      {features?.map((f, i) => (
        <li key={i} className="flex gap-2.5">
          <span className={`mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${f.status === 'met' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
            {f.status === 'met' ? '✓' : '✗'}
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-300">
              {f.name}
              <span className={`ml-1.5 text-[9px] font-bold uppercase ${f.status === 'met' ? 'text-emerald-500' : 'text-red-500'}`}>
                {f.status === 'met' ? 'Met' : 'Needs Work'}
              </span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{f.feedback}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}



// ─── Main component ────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const { token, isAuthenticated, initialized } = useAuthStore();
  const router = useRouter();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (!initialized) return;
    if (!isAuthenticated) { router.replace('/login'); return; }
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analysis/analyses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setHistory(d.history ?? []))
      .catch(() => setFetchError(true))
      .finally(() => setLoading(false));
  }, [initialized, isAuthenticated, token, router]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-teal-500/30 border-t-teal-400 animate-spin" />
          <p className="text-sm text-slate-500">Loading history…</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
        <p className="text-sm text-red-400">Failed to load history. Make sure the backend is running.</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-8 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white">History</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {history.length} {history.length === 1 ? 'analysis' : 'analyses'} total
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/analyse')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-semibold hover:bg-teal-500/20 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Analysis
        </button>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-900/40 border border-slate-800/60 rounded-2xl text-center px-4">
          <svg className="w-10 h-10 text-slate-700 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-semibold text-slate-400">No history yet</p>
          <p className="text-xs text-slate-600 mt-1">Your past analyses will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-slate-800/60 bg-slate-900/40 min-w-150">
            <div className="col-span-2 text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Role</div>
            <div className="col-span-2 text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Company</div>
            <div className="col-span-2 text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Date</div>
            <div className="col-span-2 text-[10px] font-semibold text-slate-600 uppercase tracking-wider text-center">Overall</div>
            <div className="col-span-2 text-[10px] font-semibold text-slate-600 uppercase tracking-wider text-center">ATS</div>
            <div className="col-span-1 text-[10px] font-semibold text-slate-600 uppercase tracking-wider text-center">Skills</div>
            <div className="col-span-1 text-[10px] font-semibold text-slate-600 uppercase tracking-wider text-right">View</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-800/40">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/dashboard/history/${item.id}`)}
                className="grid grid-cols-12 gap-2 py-3.5 hover:bg-slate-800/30 cursor-pointer transition-colors group items-center min-w-150"
              >
                <div className="col-span-2">
                  <p className="text-sm font-medium text-white truncate group-hover:text-teal-400 transition-colors">{item.jobDescription.role}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-slate-400 truncate">{item.jobDescription.company}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500 whitespace-nowrap">
                    {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="col-span-2 flex justify-center">
                  <ScorePill score={item.analysis.overallScore} />
                </div>
                <div className="col-span-2 flex justify-center">
                  <ScorePill score={item.analysis.atsScore} />
                </div>
                <div className="col-span-1 flex justify-center">
                  <ScorePill score={item.analysis.skillsScore ?? 0} />
                </div>
                <div className="col-span-1 flex justify-end">
                  <span className="flex gap-1 text-xs text-slate-600 group-hover:text-teal-400 transition-colors font-medium whitespace-nowrap">View</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
