'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '../../../../store/useAuthStore';
import ScoreMeter from '../../../../components/ui/score-meter';
import ScoreRing from '../../../../components/ui/score-ring';
import Accordion from '../../../../components/ui/accordion';
import { ArrowLeft, Bot, ChartNoAxesCombined, CircleCheck, CirclePlus, LayoutList, NotebookPen, Wrench } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Feature {
  name: string;
  status: 'met' | 'needs_improvement';
  feedback: string;
}
interface CategoryResult {
  summary: string;
  features: Feature[];
}
interface AnalysisDetail {
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
    analysisResult: {
      overall: CategoryResult;
      ats: CategoryResult;
      skills: CategoryResult;
      structure: CategoryResult;
      style: CategoryResult;
    };
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreCard({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-slate-800/30 rounded-xl border border-slate-800/40">
      <ScoreRing score={score} size={64} strokeWidth={5} fontSize={18} />
      <span className="text-xs text-slate-400 font-medium text-center">{label}</span>
      <p className={`text-xs mt-1.5 text-center border px-1 py-0.5 rounded-full ${score >= 80 ? "text-emerald-400 border border-emerald-500/15 bg-emerald-500/15" : score >= 60 ? "text-amber-400 border border-amber-500/15 bg-amber-500/15" : "text-red-400 border border-red-500/15 bg-red-500/15"}`}>{score >= 80 ? "Strong" : score >= 60 ? "Moderate" : "Weak"}</p>

    </div>
  );
}

function FeatureList({ features }: { features: Feature[] }) {
  if (!features?.length) return null;
  return (
    <ul className="space-y-3 mt-5 lg:mt-10">
      {features.map((f, i) => (
        <li key={i} className="flex gap-5">
          <span className={`mt-1 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${f.status === 'met' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
            }`}>
            {f.status === 'met' ? <CircleCheck /> : <CirclePlus className='rotate-45' />}
          </span>
          <div>
            <p className="text-lg font-semibold text-slate-200">
              {f.name}
              <span className={`ml-5 text-[10px] uppercase tracking-wide px-1 py-0.5 rounded-full border ${f.status === 'met' ? 'text-emerald-500 border-emerald-500 bg-emerald-500/15' : 'text-red-500 border-red-500 bg-red-500/15'
                }`}>
                {f.status === 'met' ? 'Good' : 'Needs Work'}
              </span>
            </p>
            <p className="text-slate-500 mt-1">{f.feedback}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function AccordionTitle({ icon, title, score }: { icon: React.ReactNode; title: string; score: number }) {
  return (
    <div className="flex justify-between items-center w-full gap-4">
      <div className="flex items-center gap-4">
        <span className="text-base text-slate-400">{icon}</span>
        <span className="font-semibold text-slate-200 text-xl">{title}</span>
      </div>
      <ScoreRing score={score} size={40} strokeWidth={3.5} fontSize={13} />
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function AnalysisDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token, isAuthenticated, initialized } = useAuthStore();

  const [data, setData] = useState<AnalysisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialized) return;
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (!id) return;

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analysis/analyses/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error('Analysis not found or access denied.');
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, token, isAuthenticated, initialized, router]);

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-teal-500/30 border-t-teal-400 animate-spin" />
          <p className="text-sm text-slate-500">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-teal-500/30 border-t-teal-400 animate-spin" />
          <p className="text-sm text-slate-500">Loading analysis…</p>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Couldn't load analysis</h2>
        <p className="text-sm text-slate-500 mb-5">{error ?? 'Something went wrong.'}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors flex items-center"
        >
          <ArrowLeft className='pr-2' /> Go Back
        </button>
      </div>
    );
  }

  const { jobDescription, analysis } = data;
  const r = analysis;

  const accordionItems = [
    {
      id: 'overall',
      defaultOpen: true,
      title: <AccordionTitle icon={<ChartNoAxesCombined />} title="Overall Analysis" score={r.overallScore} />,
      content: (
        <div>
          <p className="text-slate-400 leading-relaxed">{r.analysisResult?.overall?.summary}</p>
          <FeatureList features={r.analysisResult?.overall?.features ?? []} />
        </div>
      ),
    },
    {
      id: 'ats',
      title: <AccordionTitle icon={<Bot />} title="ATS Compatibility" score={r.atsScore} />,
      content: (
        <div>
          <p className="text-slate-400 leading-relaxed">{r.analysisResult?.ats?.summary}</p>
          <FeatureList features={r.analysisResult?.ats?.features ?? []} />
        </div>
      ),
    },
    {
      id: 'skills',
      title: <AccordionTitle icon={<Wrench />} title="Skills Match" score={r.skillsScore} />,
      content: (
        <div>
          <p className="text-slate-400 leading-relaxed">{r.analysisResult?.skills?.summary}</p>
          <FeatureList features={r.analysisResult?.skills?.features ?? []} />
        </div>
      ),
    },
    {
      id: 'structure',
      title: <AccordionTitle icon={<LayoutList />} title="Resume Structure" score={r.structureScore} />,
      content: (
        <div>
          <p className="text-slate-400 leading-relaxed">{r.analysisResult?.structure?.summary}</p>
          <FeatureList features={r.analysisResult?.structure?.features ?? []} />
        </div>
      ),
    },
    {
      id: 'style',
      title: <AccordionTitle icon={<NotebookPen />} title="Tone & Style" score={r.styleScore} />,
      content: (
        <div>
          <p className="text-slate-400 leading-relaxed">{r.analysisResult?.style?.summary}</p>
          <FeatureList features={r.analysisResult?.style?.features ?? []} />
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 sm:px-6 py-8 max-w-5xl mx-auto">

      {/* Top bar */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="flex flex-col items-start gap-3">
          <button
            onClick={() => router.push('/dashboard/history')}
            className="mt-1 p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-700/60 transition-all shrink-0"
            aria-label="Back to history"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-white leading-tight">{jobDescription.role}</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {jobDescription.company}
              {jobDescription.salary && <span className="ml-2 text-teal-400">· {jobDescription.salary}</span>}
              <span className="ml-2">· {new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Job description snippet */}
      <div className="mb-6 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4">
        <p className="font-semibold text-slate-500 uppercase tracking-wider mb-2">Job Description</p>
        <p className="text-slate-400">{jobDescription.description}</p>
      </div>

      {/* Score summary grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Left: Match summary */}
        <div className="p-8 flex flex-col items-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Overall Score</p>
          <ScoreMeter
            score={r.overallScore}
            size={180}
            label=""
            summary={r.analysisResult?.overall?.summary?.slice(0, 140)}
          />
        </div>

        {/* Right: Score breakdown */}
        <div className="p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Score Breakdown</p>
          <div className="grid grid-cols-2 gap-4">
            <ScoreCard label="ATS Compatibility" score={r.atsScore} />
            <ScoreCard label="Skills Match" score={r.skillsScore} />
            <ScoreCard label="Resume Structure" score={r.structureScore} />
            <ScoreCard label="Tone & Style" score={r.styleScore} />
          </div>
        </div>
      </div>

      {/* Accordions */}
      <div>
        <h2 className="text-sm font-bold text-white mb-3">Detailed Analysis</h2>
        <Accordion items={accordionItems} />
      </div>
    </div>
  );
}
