'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import { useAuthStore } from '../../store/useAuthStore';
import Image from 'next/image';

function truncateName(name: string, max = 12): string {
  return name.length > max ? name.slice(0, max) + '…' : name;
}

const navItems = [
  {
    href: '/dashboard/overview',
    label: 'Overview',
    icon: (active: boolean) => (
      <svg className={`w-5 h-5 shrink-0 ${active ? 'text-teal-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
      </svg>
    ),
  },
  {
    href: '/dashboard/analyse',
    label: 'Analyse',
    icon: (active: boolean) => (
      <svg className={`w-5 h-5 shrink-0 ${active ? 'text-teal-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    href: '/dashboard/history',
    label: 'History',
    icon: (active: boolean) => (
      <svg className={`w-5 h-5 shrink-0 ${active ? 'text-teal-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout, initialize } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Initialize authentication state on mount
  useEffect(() => {
    initialize();
  }, []);

  return ( 
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <div className="flex flex-1 min-h-0 pt-6 md:pt-10">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-slate-900 bg-slate-950 sticky top-16 h-[calc(100vh-4rem)] select-none">
          <nav className="flex-1 pt-6 pb-4 px-3 space-y-0.5">
            <p className="px-3 mb-3 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Navigation</p>
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active
                    ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                    }`}
                >
                  {item.icon(active)}
                  <span>{item.label}</span>
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0" />}
                </Link>
              );
            })}
          </nav>

          {/* Profile metadata at the bottom */}
          <div className="border-t border-slate-900 bg-slate-950/80 p-4">
            {isAuthenticated && user ? (
              <div className="flex flex-col gap-2">
                <div className='flex gap-3'>
                  {/* Avatar */}
                  <div className="w-9 h-9 shrink-0 rounded-full bg-linear-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-teal-500/10">
                    <Image
                      src={`/avatar.webp`}
                      alt="User Avatar"
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  </div>

                  {/* User Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold text-white truncate block">
                        {truncateName(user.name, 12)}
                      </span>
                      {user.isVerified ? (
                        <span className="text-emerald-400 shrink-0" title="Verified Account">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                      ) : (
                        <span className="text-amber-400 shrink-0" title="Not Verified">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate" title={user.email}>{user.email}</p>
                    <p className="text-sm text-slate-400 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      Credits left: <span className="text-teal-400 font-bold">10</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Link
                  href="/login"
                  className="block w-full py-2 text-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-semibold hover:bg-teal-500/20 transition-all"
                >
                  Sign In
                </Link>
              </div>
            )}
            <div className="mt-3 px-1 text-center flex justify-between items-center text-[9px] text-slate-700">
              <span>ApplyWise v1.0</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </div>
        </aside>

        {/* Mobile bottom nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-900 backdrop-blur-sm">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${active ? 'text-teal-400' : 'text-slate-500 hover:text-slate-300'}`}>
                  {item.icon(active)}
                  <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
