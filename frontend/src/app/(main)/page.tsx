'use client';

import React, { useRef, useEffect } from 'react';
// GSAP Imports for advanced animation
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '@/components/Hero';
import LogoCloud from '@/components/LogoCloud';
import SectionHeader from '@/components/ui/SectionHeader';
import { ArrowUpRight, Clock } from 'lucide-react';
import SecondaryButton from '@/components/ui/SecondaryButton';
import OurServices from '@/components/OurServices';
import Image from 'next/image';
import WhatsNew from '@/components/WhatsNew';

gsap.registerPlugin(ScrollTrigger);

const tools = [
  {
    name: "Resume Analyzer",
    description: "Get instant feedback on your resume's ATS compatibility, keyword optimization, and formatting issues.",
    image: "/resume-analyser.png",
    buttonName: "Try Now",
    url: "/analyse",
    icon: <ArrowUpRight size={16} />,
  },
  {
    name: "Resume Builder",
    description: "Try the best resume builder in the industry and turn your resume into one that will get you invited to every job interview.",
    image: "/resume-builder.webp",
    buttonName: "Coming Soon",
    url: "#",
    icon: <Clock size={16} />,
  },
  {
    name: "AI Interview",
    description: "TGenerate possible interview questions for the position you’re interviewing for and don’t let the job interview catch you unprepared.",
    image: "/ai-interview.webp",
    buttonName: "Coming Soon",
    url: "#",
    icon: <Clock size={16} />,
  },
]


export default function LandingPage() {
  const heroSubtitleRef = useRef<HTMLParagraphElement>(null);
  const workflowStepsRefs = useRef<HTMLElement[]>([]);
  const parallaxMediaRef = useRef<HTMLDivElement>(null);
  const hoverMagnetRef = useRef<HTMLDivElement>(null);
  const customCursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero animations
    const titleLine1 = document.getElementById('hero-title-line1');
    const titleLine2 = document.getElementById('hero-title-line2');
    const subtitleEl = heroSubtitleRef.current;
    const ctaEls = Array.from(document.querySelectorAll('#hero-ctas > *')) as HTMLElement[];

    if (titleLine1) {
      gsap.from(titleLine1, { y: 50, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.2 });
    }
    if (titleLine2) {
      gsap.from(titleLine2, { y: 50, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.35 });
    }
    if (subtitleEl) {
      gsap.from(subtitleEl, { y: 30, opacity: 0, duration: 0.7, ease: "power3.out", delay: 1 });
    }
    if (ctaEls.length) {
      gsap.from(ctaEls, { y: 30, opacity: 0, stagger: 0.15, duration: 0.6, ease: "power3.out", delay: 1.3 });
    }

    // Workflow step reveals
    (workflowStepsRefs.current as HTMLElement[]).forEach((step) => {
      gsap.from(step, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: step, start: "top 85%", toggleActions: "play none none none" },
      });
    });

    // Parallax media
    const mediaContent = hoverMagnetRef.current;
    gsap.to(parallaxMediaRef.current as HTMLElement, {
      yPercent: -3,
      ease: "none",
      scrollTrigger: { trigger: "#showcase", start: "top bottom", end: "bottom top", scrub: 1.5 },
    });

    // Reveal texts
    const revealTexts = Array.from(document.querySelectorAll('#showcase .reveal-text-item')) as HTMLElement[];
    revealTexts.forEach((el) => {
      gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
      });
    });

    // Custom cursor on media
    const container = hoverMagnetRef.current;
    const cursor = customCursorRef.current;
    if (!container || !cursor) return;
    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      gsap.to(cursor, { x, y, duration: 0.3, ease: "power2.out" });
      if (mediaContent) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const dx = (x - centerX) / centerX;
        const dy = (y - centerY) / centerY;
        gsap.to(mediaContent, { rotationY: dx * 8, rotationX: dy * -8, duration: 0.5 });
      }
    };
    const handleMouseEnter = () => { cursor.style.opacity = '1'; };
    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
      if (mediaContent) gsap.to(mediaContent, { rotationY: 0, rotationX: 0, duration: 0.5 });
    };
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased px-1.5 lg:px-4">
      <div className="rounded-2xl lg:rounded-3xl overflow-hidden mt-1.5 lg:mt-4">
        <Hero />
      </div>

      <section className="px-4 sm:px-8 py-10 lg:py-20">
        <LogoCloud />
      </section>

      <section className="px-4 sm:px-8 py-4 lg:py-8">
        <SectionHeader title1='Transform Your' title2='Job Hunt' paragraph='A global team of search-first content marketers engineering semantic relevancy & category signals for both the internet and people' primaryButton={{ buttonName: "Explore Tools", icon: <ArrowUpRight size={20} />}} secondaryButton={{ buttonName: "Learn More" }} imageSrc='/precision.webp' />
      </section>

      <section className="px-4 sm:px-8 py-10 lg:py-20">
        <div className='px-4 md:px-10 lg:px-14 py-6 lg:py-12 rounded-xl lg:rounded-3xl bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8'>
          {tools.map((tool) => (
            <div key={tool.name} className="p-6 flex flex-col">
              <Image width={1920} height={1280} src={tool.image} alt={tool.name} className="w-full h-auto object-contain mb-4 rounded-lg lg:rounded-xl bg-cyan-100" />
              <h3 className="text-xl font-semibold text-slate-950 mb-2">{tool.name}</h3>
              <p className="text-gray-600 mb-4 leading-tight">{tool.description}</p>
              <div className="mt-auto">
                <SecondaryButton buttonName={tool.buttonName} url={tool.url} size='md' icon={tool.icon} color='#000000' />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <OurServices />
      </section>

      <section>
        <WhatsNew />
      </section>
    </div>
  );
}
