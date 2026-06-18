'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from './logo';

const socialLinks = [
  {
    name: 'Twitter',
    href: 'https://twitter.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    /* Simulate subscription — in production connect to API */
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="bg-white rounded-xl lg:rounded-3xl pt-12 md:pt-14 lg:pt-16 pb-2 md:pb-4 lg:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Inner grid: newsletter + social + copyright ── */}
        <div className="max-w-2xl space-y-5">
          {/* Social media links */}
          <div className="flex items-center gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-950 hover:text-accent-one transition-colors duration-200"
              >
                {link.icon}
              </a>
            ))}
          </div>
          {/* Newsletter subscription */}
          <div className="">
            <h3 className="text-4xl font-semibold text-slate-950 mb-1 tracking-tight leading-none">
              Stay ahead of the curve
            </h3>
            <p className="text-slate-800/80 mb-5">
              Get weekly ATS tips, industry insights, and product updates.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-3 max-w-md"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2.5 rounded-lg text-sm text-slate-950 bg-white/90 placeholder-slate-500 border border-slate-950/20 focus:outline-none focus:ring-2 focus:ring-slate-950/40 transition-colors"
              />
              <button
                type="submit"
                className="shrink-0 w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-slate-950 hover:bg-slate-800 transition-colors duration-200"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>

          
        </div>
        {/* ── Logo full width ── */}
        <div className="text-center mt-14 mb-8 flex flex-1 items-start">
          <Link href="/" className="w-full">
            <Logo className="w-full h-auto" theme='light' />
          </Link>
        </div>

        

        {/* Copyright */}
          <div className="text-center pt-4 border-t border-slate-950/20 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-1 text-xs sm:text-sm text-slate-800">
            <p className="">
              &copy; {new Date().getFullYear()} ApplyWise.io. All rights reserved.
            </p>
            <p>Made with ❤️ from <a href="https://syednoor.vercel.app" target="_blank" rel="noopener noreferrer" className="text-accent-one hover:underline">Syed Shaeduzzaman Noor</a></p>
          </div>
      </div>
    </footer>
  );
}