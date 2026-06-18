'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import ScoreMeter from '../../../components/ui/score-meter';
import ScoreRing from '../../../components/ui/score-ring';
import Accordion from '../../../components/ui/accordion';
import AnalyseForm from '../../../components/AnalyseForm';
import { Bot, ChartNoAxesCombined, CircleCheck, CirclePlus, LayoutList, NotebookPen, Wrench } from 'lucide-react';

// ─── Helpers for displaying guest audit results ─────────────────────────────

function ScoreCard({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 bg-slate-800/30 rounded-xl border border-slate-800/40">
      <ScoreRing score={score} size={64} strokeWidth={5} fontSize={18} />
      <span className="text-xs text-slate-400 font-medium text-center">{label}</span>
    </div>
  );
}

function FeatureList({ features }: { features: any[] }) {
  if (!features?.length) return null;
  return (
    <ul className="space-y-3 mt-5 lg:mt-10">
      {features.map((f, i) => (
        <li key={i} className="flex gap-5">
          <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${f.status === 'met' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
            }`}>
            {f.status === 'met' ? <CircleCheck /> : <CirclePlus className='rotate-45' />}
          </span>
          <div>
            <p className="text-lg font-semibold text-slate-200">
              {f.name}
              <span className={`ml-8 text-[10px] font-bold uppercase tracking-wide ${f.status === 'met' ? 'text-emerald-500' : 'text-red-500'
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
    <div className="flex items-center gap-3">
      <ScoreRing score={score} size={40} strokeWidth={3.5} fontSize={13} />
      <span className="text-base text-slate-400">{icon}</span>
      <span className="font-semibold text-slate-200 text-xl">{title}</span>
    </div>
  );
}

export default function StandaloneAnalysePage() {
  const [guestResult, setGuestResult] = useState<any | null>(null);
  const [guestCompany, setGuestCompany] = useState('');
  const [guestRole, setGuestRole] = useState('');

  const handleAnalysisComplete = (data: any, company: string, role: string) => {
    setGuestCompany(company);
    setGuestRole(role);
    setGuestResult(data);
  };

  const handleResetAnalysis = () => {
    setGuestResult(null);
    setGuestCompany('');
    setGuestRole('');
  };

  const accordionItems = guestResult ? [
    {
      id: 'overall',
      defaultOpen: true,
      title: <AccordionTitle icon={<ChartNoAxesCombined />} title="Overall Analysis" score={guestResult.overallScore} />,
      content: (
        <div>
          <p className="text-slate-400 leading-relaxed">{guestResult.analysisResult?.overall?.summary}</p>
          <FeatureList features={guestResult.analysisResult?.overall?.features ?? []} />
        </div>
      ),
    },
    {
      id: 'ats',
      title: <AccordionTitle icon={<Bot />} title="ATS Compatibility" score={guestResult.atsScore} />,
      content: (
        <div>
          <p className="text-slate-400 leading-relaxed">{guestResult.analysisResult?.ats?.summary}</p>
          <FeatureList features={guestResult.analysisResult?.ats?.features ?? []} />
        </div>
      ),
    },
    {
      id: 'skills',
      title: <AccordionTitle icon={<Wrench />} title="Skills Match" score={guestResult.skillsScore} />,
      content: (
        <div>
          <p className="text-slate-400 leading-relaxed">{guestResult.analysisResult?.skills?.summary}</p>
          <FeatureList features={guestResult.analysisResult?.skills?.features ?? []} />
        </div>
      ),
    },
    {
      id: 'structure',
      title: <AccordionTitle icon={<LayoutList />} title="Resume Structure" score={guestResult.structureScore} />,
      content: (
        <div>
          <p className="text-slate-400 leading-relaxed">{guestResult.analysisResult?.structure?.summary}</p>
          <FeatureList features={guestResult.analysisResult?.structure?.features ?? []} />
        </div>
      ),
    },
    {
      id: 'style',
      title: <AccordionTitle icon={<NotebookPen />} title="Tone & Style" score={guestResult.styleScore} />,
      content: (
        <div>
          <p className=" text-slate-400 leading-relaxed">{guestResult.analysisResult?.style?.summary}</p>
          <FeatureList features={guestResult.analysisResult?.style?.features ?? []} />
        </div>
      ),
    },
  ] : [];

  // ── RENDER VIEW ───────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden pt-4 lg:pt-8 pb-10">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.06),transparent_50%)] pointer-events-none" />
      <div className="absolute top-[30%] left-[5%] w-87.5 h-87.5 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-75 h-75 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      <Navbar />

      {guestResult ? (
        // GUEST AUDIT RESULT VIEW
        <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-20 py-12 z-10">
          {/* Title bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-white leading-tight">Resume Optimization Report</h1>
              <p className="text-sm text-slate-500 mt-2">
                Targeting: <span className="text-slate-300 font-semibold">{guestRole}</span> at <span className="text-slate-300 font-semibold">{guestCompany}</span>
              </p>
            </div>
            <button
              onClick={handleResetAnalysis}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-sm lg:text-base font-semibold transition-all text-center cursor-pointer"
            >
              Scan Another
            </button>
          </div>

          {/* Summary grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 lg:mb-20">
            {/* Left circular meter */}
            <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-8 flex flex-col items-center justify-center">
              <ScoreMeter
                score={guestResult.overallScore}
                size={220}
                label=""
                summary={guestResult.analysisResult?.overall?.summary?.slice(0, 140)}
              />
            </div>

            {/* Right: scores as ring grid */}
            <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Score Breakdown</p>
              <div className="grid grid-cols-2 gap-4">
                <ScoreCard label="ATS Compatibility" score={guestResult.atsScore} />
                <ScoreCard label="Skills Match" score={guestResult.skillsScore} />
                <ScoreCard label="Resume Structure" score={guestResult.structureScore} />
                <ScoreCard label="Tone & Style" score={guestResult.styleScore} />
              </div>
            </div>
          </div>

          {/* Accordion details */}
          <div className="mb-8">
            <h2 className="font-bold text-white mb-5">Detailed Category Audits</h2>
            <Accordion items={accordionItems} />
          </div>

          {/* Promo callout header */}
          <div className="mt-10 lg:mt-20 p-5 lg:p-10 bg-linear-to-r from-teal-500/10 via-teal-500/5 to-slate-950 border border-teal-500/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">Guest Mode Report</span>
              <h2 className="text-xl lg:text-5xl leading-none max-w-3xl font-bold text-white mt-10">Want to save this analysis and track improvements?</h2>
              <p className="text-sm lg:text-base text-slate-400 mt-2 max-w-3xl">Create a free account to unlock 10 scans instantly and keep a persistent history of your CV checks.</p>
            </div>
            <Link href="/register" className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-medium text-sm lg:text-base shrink-0 shadow-lg shadow-teal-500/15 transition-all text-center">
              Register Free Account
            </Link>
          </div>

        </main>
      ) : (
        // TWO-COLUMN MARKETING AND FORM LAYOUT
        <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-20 py-12 z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-start">
          {/* Left Column: Marketing Benefits */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 pt-4">
            <div>
              <span className="text-teal-400 text-xs font-bold tracking-widest uppercase bg-teal-500/10 border border-teal-500/20 px-2.5 py-1 rounded-full">
                ATS Optimizer
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-4 leading-tight">
                Evaluate Your Resume Fit Instantly
              </h1>
              <p className="text-slate-400 mt-3">
                Applicant tracking systems block over 70% of candidate resumes. Ensure your credentials stand out by running an AI analysis of keyword matching, formatting, and structural checks.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0 flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-white">Advanced Keyword Analysis</h3>
                  <p className="text-sm text-slate-500 mt-0.5">We check for missing technical skills, frameworks, and job-specific verbs directly required by the JD.</p>
                </div>
              </div>
              <div className="flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0 flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-white">Structure & Grid Validation</h3>
                  <p className="text-sm text-slate-500 mt-0.5">We review column alignment, page margins, and section headings to prevent parsing errors on popular tracking servers.</p>
                </div>
              </div>
              <div className="flex gap-3.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0 flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <h3 className=" font-semibold text-white">Full Score Breakdown</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Get scores across 4 key dimensions: ATS compatibility, skills, structure, and writing style.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Scan Form */}
          <div className="lg:col-span-7 w-full">
            <div className="mb-4 text-center lg:text-left">
              <h2 className="text-lg font-bold text-white">Run Free Scan</h2>
              <p className="text-xs text-slate-500 mt-0.5">Upload a PDF resume and paste the description to begin.</p>
            </div>

            <AnalyseForm onAnalysisComplete={handleAnalysisComplete} />
          </div>
        </main>
      )}
    </div>
  );
}
