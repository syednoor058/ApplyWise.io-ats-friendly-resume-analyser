"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useAuthStore } from "../../../store/useAuthStore";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface HistoryItem {
  id: string;
  createdAt: string;
  jobDescription: { company: string; role: string; salary?: string };
  analysis: {
    overallScore: number;
    atsScore: number;
    skillsScore: number;
    structureScore: number;
    styleScore: number;
  };
}

function ScoreBadge({ score }: { score: number }) {
  if (score >= 80)
    return (
      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        {score}
      </span>
    );
  if (score >= 60)
    return (
      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
        {score}
      </span>
    );
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
      {score}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 hover:border-slate-700/60 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        <div className="rounded-xl flex items-center justify-center text-teal-400">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-extrabold text-white tracking-tight">
        {value}
      </p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function OverviewPage() {
  const { user, token, isAuthenticated, initialized } = useAuthStore();
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // auth & data fetch effect
  useEffect(() => {
    if (!initialized) return; // wait for init
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    // Fetch data only when authenticated
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/analysis/analyses`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setHistory(d.history ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [initialized, isAuthenticated, token, router]);

  const stats = useMemo(() => {
    if (!history.length) return null;
    const scores = history.map((h) => h.analysis.overallScore);
    return {
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      highest: Math.max(...scores),
      lowest: Math.min(...scores),
    };
  }, [history]);

  const last5 = useMemo(
    () =>
      [...history]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5),
    [history],
  );

  const topRoles = useMemo(() => {
    const counts = history.reduce(
      (acc, h) => {
        const role = h.jobDescription.role;
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [history]);

  const maxRoleCount = useMemo(
    () =>
      topRoles.length > 0 ? Math.max(...topRoles.map(([, count]) => count)) : 0,
    [topRoles],
  );

  // loading while auth state initializes
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
          <p className="text-sm text-slate-500">Loading overview…</p>
        </div>
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="space-y-10 pt-6 md:pt-10">
        <div className="flex flex-col gap-4 max-w-5xl mx-auto">
          <div className="flex">
            <p className="px-3 py-1 border-white rounded-full bg-white/15 text-white text-sm">
              Overview
            </p>
          </div>
          <div>
            <h1 className="text-4xl font-medium text-slate-500 mt-0.5">
              Welcome back,{" "}
              <span className="font-extrabold capitalize text-white">
                {user?.name}
              </span>
            </h1>
            <p className="text-slate-500 mt-1 max-w-2xl">
              Here's a summary of your resume analyses. Get more analysis on
              your resume before applying for a job.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <div className="w-20 h-20 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center mb-5">
            <svg
              className="w-9 h-9 text-slate-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No analyses yet</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-xs">
            Run your first resume analysis to see your performance overview and
            insights here.
          </p>
          <Link
            href="/dashboard/analyse"
            className="px-5 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-sm hover:bg-teal-400 transition-colors"
          >
            Analyse My Resume
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      {/* Page title */}
      <div className="mb-10 lg:mb-14 flex flex-col gap-4">
        <div className="flex">
          <p className="px-3 py-1 border-white rounded-full bg-white/15 text-white text-sm">
            Overview
          </p>
        </div>
        <div>
          <h1 className="text-4xl font-medium text-slate-500 mt-0.5">
            Welcome back,{" "}
            <span className="font-extrabold capitalize text-white">
              {user?.name}
            </span>
          </h1>
          <p className="text-slate-500 mt-1 max-w-2xl">
            Here's a summary of your resume analyses. Get more analysis on your
            resume before applying for a job.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Analyses"
          value={history.length}
          sub="all time"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
        />
        <StatCard
          label="Avg Overall Score"
          value={`${stats?.avg ?? 0}`}
          sub="out of 100"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          }
        />
        <StatCard
          label="Highest Score"
          value={`${stats?.highest ?? 0}`}
          sub="personal best"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          }
        />
        <StatCard
          label="Lowest Score"
          value={`${stats?.lowest ?? 0}`}
          sub="room to improve"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {/* Last 5 results */}
        <div className="lg:col-span-3 bg-slate-900/60 border border-slate-800/60 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between">
            <h2 className="font-bold text-white">Recent Analyses</h2>
            <Link
              href="/dashboard/history"
              className="text-xs text-teal-400 hover:text-teal-300 transition-colors font-medium flex items-center gap-2"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/60">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-3 py-3 text-left text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-3 py-3 text-right text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                  Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {last5.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/20 transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/history/${item.id}`)}
                >
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-white truncate max-w-[140px]">
                      {item.jobDescription.role}
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-3 py-3.5 text-sm text-slate-400 truncate max-w-[100px]">
                    {item.jobDescription.company}
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <ScoreBadge score={item.analysis.overallScore} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Most applied roles */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5">
          <h2 className="font-bold text-white mb-4">Most Applied Roles</h2>
          {topRoles.length === 0 ? (
            <p className="text-xs text-slate-600">No data yet</p>
          ) : (
            <div className="flex flex-col">
              {topRoles.map(([role, count], index) => (
                <div
                  key={role}
                  className={`pt-4 pb-4 ${index !== 0 ? "border-t border-slate-800/40" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-300 truncate max-w-[140px] font-medium">
                      {role}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {count}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-700"
                      style={{ width: `${(count / maxRoleCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Score breakdown across all analyses */}
      <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-white mb-4">
          Score Category Averages
        </h2>
        {(() => {
          const categories = [
            {
              label: "ATS",
              key: "atsScore" as const,
              color: "from-blue-500 to-cyan-400",
            },
            {
              label: "Skills",
              key: "skillsScore" as const,
              color: "from-violet-500 to-purple-400",
            },
            {
              label: "Structure",
              key: "structureScore" as const,
              color: "from-amber-500 to-yellow-400",
            },
            {
              label: "Style & Tone",
              key: "styleScore" as const,
              color: "from-rose-500 to-pink-400",
            },
          ];
          return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map(({ label, key, color }) => {
                const avg = history.length
                  ? Math.round(
                      history.reduce(
                        (sum, h) => sum + (h.analysis[key] ?? 0),
                        0,
                      ) / history.length,
                    )
                  : 0;
                return (
                  <div key={label} className="bg-slate-800/40 rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-2 font-medium">
                      {label}
                    </p>
                    <p className="text-2xl font-extrabold text-white mb-2">
                      {avg}
                    </p>
                    <div className="h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${color} rounded-full`}
                        style={{ width: `${avg}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
