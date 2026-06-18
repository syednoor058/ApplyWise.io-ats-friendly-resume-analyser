'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import { ArrowRight, Bot, BriefcaseBusiness, Calculator, ChartNoAxesCombined, FileText, LayoutPanelTop, PencilRuler, Scale, Search, Wrench } from 'lucide-react';

const LOADING_STEPS = [
  { icon: <FileText />, text: 'Analysing documents...' },
  { icon: <Search />, text: 'Extracting data from resume...' },
  { icon: <BriefcaseBusiness />, text: 'Processing job description...' },
  { icon: <Scale />, text: 'Cross validating requirements...' },
  { icon: <ChartNoAxesCombined />, text: 'Analysing overall fit...' },
  { icon: <Bot />, text: 'Analysing ATS compatibility...' },
  { icon: <Wrench />, text: 'Checking skill requirements...' },
  { icon: <LayoutPanelTop />, text: 'Evaluating resume structure...' },
  { icon: <PencilRuler />, text: 'Analysing tone and style...' },
  { icon: <Calculator />, text: 'Calculating final scores...' },
];

const ITEM_H = 30;
const N = LOADING_STEPS.length;
const EXTENDED = [...LOADING_STEPS, LOADING_STEPS[0]];

interface AnalyseFormProps {
  onAnalysisComplete?: (data: any, company: string, role: string) => void;
}

export default function AnalyseForm({ onAnalysisComplete }: AnalyseFormProps) {
  const router = useRouter();
  const { user, isAuthenticated, token } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ticker animation state
  const [tickerPos, setTickerPos] = useState(0);
  const [withTransition, setWithTransition] = useState(false);
  const [iconIdx, setIconIdx] = useState(0);

  const isActiveRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopTicker = () => {
    isActiveRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startTicker = () => {
    isActiveRef.current = true;
    setTickerPos(0);
    setWithTransition(false);
    setIconIdx(0);

    let pos = 0;
    const PAUSE_MS = 2000;
    const SLIDE_MS = 650;

    const advance = () => {
      if (!isActiveRef.current) return;

      pos += 1;
      setIconIdx(pos % N);
      setWithTransition(true);
      setTickerPos(pos);

      if (pos === N) {
        timeoutRef.current = setTimeout(() => {
          if (!isActiveRef.current) return;
          setWithTransition(false);
          pos = 0;
          setTickerPos(0);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (!isActiveRef.current) return;
              setWithTransition(true);
              timeoutRef.current = setTimeout(advance, PAUSE_MS);
            });
          });
        }, SLIDE_MS);
      } else {
        timeoutRef.current = setTimeout(advance, PAUSE_MS + SLIDE_MS);
      }
    };

    timeoutRef.current = setTimeout(advance, PAUSE_MS);
  };

  useEffect(() => () => stopTicker(), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isAuthenticated && user && !user.isVerified) {
      setError('Please verify your email address to run resume analyses.');
      return;
    }
    if (!resumeFile) {
      setError('Please select a resume PDF.');
      return;
    }

    setError(null);
    setIsLoading(true);
    startTicker();

    const formData = new FormData();
    formData.append('companyName', company);
    formData.append('role', role);
    formData.append('salary', salary || 'Negotiable');
    formData.append('description', description);
    formData.append('resume', resumeFile);

    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analysis/analyze`, {
        method: 'POST',
        headers,
        body: formData,
      });
      const data = await res.json();
      stopTicker();

      if (!res.ok) throw new Error(data.error || data.message || 'Analysis failed.');

      const recordId = data.savedRecordId;
      if (recordId) {
        router.push(`/dashboard/history/${recordId}`);
      } else if (onAnalysisComplete) {
        onAnalysisComplete(data, company, role);
        setIsLoading(false);
      } else {
        throw new Error('Analysis completed but record reference was not saved.');
      }
    } catch (err: any) {
      stopTicker();
      setError(err.message ?? 'Something went wrong.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    const translateY = -(tickerPos * ITEM_H) + ITEM_H;

    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 overflow-hidden min-h-[400px]">


        {/* Precaution text */}
        <div className="text-center max-w-sm mb-8 px-4 z-10">
          <h2 className="text-lg font-medium text-white">Evaluating Resume Optimization</h2>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            Please wait while our models cross-validate your CV.<br />
            Do not refresh or navigate away.
          </p>
        </div>

        {/* Spinning circle with cycling icon */}
        <div className="relative mb-10">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 opacity-15 blur-2xl animate-pulse" />
          <div className="w-32 h-32 rounded-full border-4 border-slate-900 bg-slate-950 flex items-center justify-center relative z-10">
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-400 border-r-teal-500/60"
              style={{ animation: 'spin 1.4s linear infinite' }}
            />
            <div
              className="absolute inset-2 rounded-full border-2 border-transparent border-b-emerald-500/40 border-l-teal-400/30"
              style={{ animation: 'spin 2s linear infinite reverse' }}
            />
            <div className="w-[72px] h-[72px] rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl shadow-inner">
              <span style={{ display: 'inline-block' }} className="transition-all duration-500">
                {LOADING_STEPS[iconIdx]?.icon}
              </span>
            </div>
          </div>
        </div>

        {/* Slot-machine rolling ticker */}
        <div
          className="relative w-full max-w-xs z-10"
          style={{ height: `${ITEM_H * 3}px`, overflow: 'hidden' }}
        >
          <div
            style={{
              transform: `translateY(${translateY}px)`,
              transition: withTransition ? `transform ${ITEM_H / 48 * 0.65}s cubic-bezier(0.4, 0, 0.2, 1)` : 'none',
              willChange: 'transform',
            }}
          >
            {EXTENDED.map((step, i) => {
              const dist = i - tickerPos;
              const isCenter = dist === 0;
              const isAdjacent = Math.abs(dist) === 1;

              return (
                <div
                  key={i}
                  style={{
                    height: `${ITEM_H}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'font-size 0.65s ease, opacity 0.65s ease, letter-spacing 0.65s ease',
                    fontSize: isCenter ? '0.875rem' : '0.7rem',
                    fontWeight: isCenter ? 700 : 400,
                    color: isCenter ? '#2dd4bf' : '#475569',
                    opacity: isCenter ? 1 : isAdjacent ? 0.38 : 0,
                    letterSpacing: isCenter ? '0.015em' : '0',
                    whiteSpace: 'nowrap',
                    padding: '0 10px',
                    userSelect: 'none',
                  }}
                >
                  {step.text}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-6 flex items-start gap-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
          <svg className="w-5 h-5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 bg-slate-900/20 border border-slate-900/60 p-6 sm:p-8 rounded-2xl backdrop-blur-md">
        {/* Company + Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Company Name <span className="text-red-400">*</span>
            </label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              placeholder="e.g. Google"
              className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/60 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Job Role / Title <span className="text-red-400">*</span>
            </label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/60 transition-all"
            />
          </div>
        </div>

        {/* Salary */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Salary <span className="text-slate-600">(optional)</span>
          </label>
          <input
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="e.g. $80,000 – $120,000 / year (default: Negotiable)"
            className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/60 transition-all"
          />
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Job Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
            placeholder="Paste the full job description here…"
            className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500/60 transition-all resize-none leading-relaxed"
          />
        </div>

        {/* Resume upload */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Resume / CV <span className="text-red-400">*</span>{' '}
            <span className="text-slate-600 normal-case">(PDF only)</span>
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`relative border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all hover:border-teal-500/40 hover:bg-teal-500/5 ${resumeFile ? 'border-teal-500/40 bg-teal-500/5' : 'border-slate-800'
              }`}
          >
            {resumeFile ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-white truncate max-w-[200px]">{resumeFile.name}</p>
                  <p className="text-[10px] text-slate-500">{(resumeFile.size / 1024).toFixed(0)} KB · Change</p>
                </div>
              </div>
            ) : (
              <>
                <svg className="w-8 h-8 text-slate-700 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-xs text-slate-400 font-medium">
                  Drop resume here or <span className="text-teal-400 font-semibold">browse</span>
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5">PDF format only (Max 5 MB)</p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
            className="sr-only"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!company || !role || !description || !resumeFile}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold hover:from-teal-400 hover:to-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-teal-500/10 flex items-center justify-center gap-2"
        >
          Analyse Resume <ArrowRight size={14} />
        </button>
      </form>
    </div>
  );
}
