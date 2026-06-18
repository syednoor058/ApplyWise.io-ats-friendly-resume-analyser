'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import SecondaryButton from './ui/SecondaryButton';
import PrimaryButton from './ui/PrimaryButton';
import Logo from './ui/logo';
import Image from 'next/image';

function truncateName(name: string, max = 12): string {
  return name.length > max ? name.slice(0, max) + '…' : name;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout, verifyUser } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ── Track scroll position for transparent navbar ── */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    /* Check initial state */
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    router.push('/');
  };

  const handleVerifyEmail = async () => {
    if (!user) return;
    setIsVerifying(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      if (res.ok) {
        verifyUser();
        setDropdownOpen(false);
      }
    } catch (e) {
      console.error('Verification failed', e);
    } finally {
      setIsVerifying(false);
    }
  };

  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <header
      className={`fixed top-1.5 lg:top-3 left-0 right-0 z-40 w-full`}
    >
      <div className={`mx-1.5 lg:mx-4 px-4 sm:px-6 lg:px-8 ${
        isScrolled
          ? 'bg-slate-950/20 backdrop-blur-md shadow-lg shadow-black/20 rounded-full'
          : 'bg-transparent' 
      } transition-all duration-300 ease-in-out`}>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold tracking-tight text-white flex flex-row items-start gap-1">
              {/* Apply<span className="text-teal-400">Wise</span> */}
              <Logo className="w-24 sm:w-40 h-auto" />
              <span className="text-xs text-white/60 text-nowrap">v1.0</span>
            </span>
          </Link>

          {/* Auth area */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className={isDashboard ? "relative" : "relative"} ref={dropdownRef}>
                {/* Avatar button */}
                <button
                  id="user-avatar-btn"
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="w-9 h-9 rounded-full bg-linear-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/50 ring-offset-2 ring-offset-slate-950 cursor-pointer"
                  aria-label="User menu"
                >
                  <Image
                    src={`/avatar.webp`}
                    alt="User Avatar"
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                </button>

                {/* Floating dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
                    {/* Identity */}
                    <div className="px-4 py-3.5 border-b border-slate-800/80">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-bold text-white truncate max-w-37.5">
                          {truncateName(user.name)}
                        </span>
                        {user.isVerified ? (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Not Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
                        Credits left: <span className="text-teal-400 font-bold">10</span>
                      </p>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      <Link
                        href="/dashboard/overview"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                      >
                        <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Dashboard
                      </Link>

                      {!user.isVerified && (
                        <button
                          onClick={handleVerifyEmail}
                          disabled={isVerifying}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 transition-colors disabled:opacity-50"
                        >
                          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {isVerifying ? 'Verifying…' : 'Verify Email'}
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-800 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <SecondaryButton buttonName="Sign In" url="/login" size="sm" />
                <PrimaryButton buttonName="Create Account" url="/register" size="sm" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
