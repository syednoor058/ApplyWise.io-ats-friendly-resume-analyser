import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AwardBadge from './ui/AwardBadge';
import PrimaryButton from './ui/PrimaryButton';
import SecondaryButton from './ui/SecondaryButton';
import { ArrowRight } from 'lucide-react';
import ScoreRing from './ui/score-ring';

// Back‑up the default plugin registration – it will only fire once.
gsap.registerPlugin(ScrollTrigger);

/**
 * Hero section component.
 * • Video background that plays muted, autoplay, and loops.
 * • Two‑column layout, left: title, 1‑line paragraph, 2 buttons, avatars, rating.
 * • Right: two blurred cards side-by-side with staggered heights and parallax effect.
 */
export default function Hero() {
  const avatarRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    /* ── Staggered entrance for avatars ── */
    avatarRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { y: 20, opacity: 0, scale: 0.6 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: 0.8 + i * 0.12,
          ease: 'back.out(1.7)',
        }
      );
    });

    /* ── Parallax for Card 1 ── */
    gsap.to('#card-1', {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    /* ── Parallax for Card 2 ── */
    gsap.to('#card-2', {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }, []);

  // Helper to set avatar refs
  const setAvatarRef = (i: number) => (el: HTMLDivElement | null) => {
    avatarRefs.current[i] = el;
  };

  return (
    <section id="hero" className="relative flex flex-col lg:flex-row overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover blur-[0.5px]"
      >
        <source src="/hero-bg.webm" type="video/webm" />
      </video>

      {/* Overlay to increase text contrast */}
      <div className="absolute inset-0 bg-black/40 " />

      {/* Content container */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 px-6 lg:px-12 pt-20 pb-10 lg:pt-28 lg:pb-20 gap-14 lg:gap-0">
        {/* Left side – key content */}
        <div className="col-span-1 lg:col-span-7 justify-center lg:pr-8">
          <h1 className="text-[50px] lg:text-[75px] font-medium tracking-tight leading-none text-white mb-4 text-center lg:text-left">
            Power Your Résumé with <span className='text-accent-one'>Smart Insight</span> 
          </h1>
          <p className="text-lg leading-tight text-slate-200 mb-6 text-center lg:text-left">
            Scan your résumé against industry benchmarks, unlock tailored suggestions and outshine recruiters.
          </p>

          <div className="flex space-x-4 mb-6 justify-center lg:justify-start">
            <PrimaryButton buttonName="Get Started" url="/analyse" icon={<ArrowRight size={18} />} size='lg' />
            <SecondaryButton buttonName="Create Account" url="/register" size='lg' />
          </div>

          {/* Avatar stack – interactive + animated */}
          <div className="flex items-center -space-x-3 mb-4 justify-center lg:justify-start">
            {['/avatars/1.webp', '/avatars/2.webp', '/avatars/3.webp', '/avatars/4.webp'].map(
              (src, i) => (
                <div
                  key={i}
                  ref={setAvatarRef(i)}
                  className="group relative"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/80 ring-offset-2 ring-offset-transparent shadow-lg transition-transform duration-300 group-hover:scale-125 group-hover:z-20 group-hover:ring-[#14b8a6]">
                    <Image
                      src={src}
                      alt={`Avatar ${i}`}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 w-12 h-12 rounded-full bg-[#14b8a6]/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                </div>
              )
            )}
            <span className="ml-8 text-sm text-slate-100 font-medium">
              +2.5k users
            </span>
          </div>

          {/* Rating / achievements – between two leaf sticks */}
          <div className="flex flex-wrap gap-3 items-center justify-center lg:justify-start">
            <AwardBadge
                url="https://www.testdome.com/certificates/211ba780113d47e4979b0861df0a1f3c"
                name="Winner"
                description="Awards 2026"
                icon={<img alt="Studio Shodwe" src="/logos/studio-shodwe.png" className="w-full h-auto invert object-contain" />}
                variant="dark"
              />
              <AwardBadge
                url="https://www.testdome.com/certificates/211ba780113d47e4979b0861df0a1f3c"
                name="Winner"
                description="Awards 2026"
                icon={<img alt="Studio Shodwe" src="/logos/studio-shodwe.png" className="w-full h-auto invert object-contain" />}
                variant="dark"
              />
          </div>
        </div>

        {/* Right side – side cards in a row with offset parallax */}
        <div className="col-span-1 lg:col-span-5 hidden lg:flex items-start justify-center gap-6 mt-10 lg:mt-0 lg:pl-8 relative min-h-100">
          {/* Card 1 – slightly higher */}
          <div
            id="card-1"
            className="w-60 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl drop-shadow-xl border border-white/5 relative z-10 -mt-6"
          >
            <div className="p-5 h-full flex flex-col justify-between text-center">
              <ScoreRing score={89} size={100} strokeWidth={6}/>
              <h3 className="text-xl font-semibold text-white mt-5">Skill Gaps</h3>
              <p className="text-sm text-slate-200">
                Detailed 100‑point ATS compatibility score + gap analysis.
              </p>
              <div className="flex flex-col items-center mt-3">
                <span className="bg-emerald-500/30 border border-emerald-500 text-emerald-300 text-xs px-3 py-1 rounded-full">
                Strong
              </span>
              </div>
            </div>
          </div>

          {/* Card 2 – slightly lower */}
          <div
            id="card-2"
            className="w-60 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl drop-shadow-xl border border-white/5 relative z-10 mt-6"
          >
            <div className="p-5 h-full flex flex-col justify-between text-center">
              <ScoreRing score={72} size={100} strokeWidth={6}/>
              <h3 className="text-xl font-semibold text-white mt-5">Actionable Audit</h3>
              <p className="text-sm text-slate-200">
                Tailored suggestions to get your résumé past the bots and get higher chance.
              </p>
              <div className="flex flex-col items-center mt-3">
                <span className="bg-amber-500/30 border border-amber-500 text-amber-300 text-xs px-3 py-1 rounded-full">
                Medium
              </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
