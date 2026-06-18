"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import PrimaryButton from "./ui/PrimaryButton";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { ArrowUpRight, Clock } from "lucide-react";

const newsItems = [
  {
    id: 1,
    category: "Insights",
    image: "/whats-new/wn-1.jpg",
    author: { name: "Carrie Rose", avatar: "/work-images/work-1.jpg" },
    time: "2 mins",
    title: "Ryan McNamara Is Now Rise at Seven's Global Operations Director"
  },
  {
    id: 2,
    category: "Strategy",
    image: "/whats-new/wn-2.webp",
    author: { name: "Stephen Kenwright", avatar: "/work-images/work-2.jpg" },
    time: "4 days",
    title: "Rise at Seven Appointed by Coneys to Drive Demand and Retail Growth for them in the Chocolate Confectionery Category"
  },
  {
    id: 3,
    category: "Agency Life",
    image: "/whats-new/wn-3.webp",
    author: { name: "John Doe", avatar: "/work-images/work-3.jpg" },
    time: "1 week",
    title: "Rise at Seven Appointed by Langtins to drive demand and retail growth for Noomz"
  }
];

export default function WhatsNew() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const eclipseRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current && hoveredId !== null) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [hoveredId]);

  useEffect(() => {
    if (cursorRef.current) {
      if (hoveredId !== null) {
        gsap.to(cursorRef.current, { scale: 1, opacity: 1, duration: 0.3 });
      } else {
        gsap.to(cursorRef.current, { scale: 0, opacity: 0, duration: 0.3 });
      }
    }
  }, [hoveredId]);

  const handleMouseEnter = (id: number, index: number) => {
    setHoveredId(id);
    if (eclipseRefs.current[index]) {
      gsap.to(eclipseRefs.current[index], {
        scale: 3,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = (index: number) => {
    setHoveredId(null);
    if (eclipseRefs.current[index]) {
      gsap.to(eclipseRefs.current[index], {
        scale: 0,
        duration: 0.6,
        ease: "power2.in",
      });
    }
  };

  return (
    <section className="py-10 lg:py-20 px-4 lg:px-8 overflow-hidden relative">
      {/* Custom Global Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-32 h-32 bg-accent-two rounded-full z-100 pointer-events-none hidden lg:flex items-center justify-center opacity-0 scale-0 select-none"
        style={{ left: -25, top: -35 }}
      >
        <ArrowUpRight size={32} />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header (Ref: OurServices) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          <div className="w-full md:w-[2/3]">
            <h2 className="text-[50px] lg:text-[75px] font-medium tracking-tight leading-none flex items-center">
              What&apos;s
              <span className="inline-flex items-center">
                <span className="inline-block w-12 h-12 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-lg overflow-hidden mx-3">
                  <Image width={100} height={100} src="/whats-new/header.webp" alt="" className="w-full h-full object-cover" />
                </span>
                New
              </span>
            </h2>
          </div>
          <div className="hidden md:flex w-full md:w-[1/3] items-center justify-end">
            <PrimaryButton size="lg" buttonName="Let's Connect" url="#" icon={<ArrowUpRight size={20} />} />
          </div>
        </div>
        <div className="w-full h-px bg-slate-700 mb-12 hidden md:block" />

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-3 gap-10">
          {newsItems.map((item, index) => (
            <div
              key={item.id}
              className={`group flex flex-col transition-transform duration-500 hover:-translate-y-4 ${hoveredId === item.id ? 'lg:cursor-none' : ''}`}
              onMouseEnter={() => handleMouseEnter(item.id, index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              {/* Image Container */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-6 bg-zinc-100">
                <Image
                  src={item.image}
                  alt=""
                  width={400}
                  height={400}
                  className="w-full h-full object-cover transition-all duration-700"
                />

                {/* Category Badge */}
                <div className="absolute top-5 left-5 px-3 py-1.5 bg-white/30 backdrop-blur-md rounded-full text-sm font-medium text-white z-20">
                  {item.category}
                </div>

                {/* Blurred Eclipse Overlay */}
                <div
                  ref={(el) => { eclipseRefs.current[index] = el; }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full h-full bg-white/10 backdrop-blur-sm rounded-full scale-0 pointer-events-none z-10"
                />
              </div>

              {/* Badges Row */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full">
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-zinc-300">
                    <Image width={400} height={400} src={item.author.avatar} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-medium text-slate-950">{item.author.name}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full">
                  <Clock size={14} className="text-slate-800" />
                  <span className="text-xs font-medium text-slate-800">{item.time}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-[28px] font-medium leading-none">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

        {/* Mobile View */}
        <div className="lg:hidden">
          <Swiper
            modules={[Pagination]}
            loop={true}
            spaceBetween={20}
            slidesPerView={1.2}
            centeredSlides={false}
            pagination={{
              type: "progressbar",
              el: ".news-tracker"
            }}
            className="w-full overflow-visible"
          >
            {[...newsItems, ...newsItems].map((item, idx) => (
              <SwiperSlide key={`${item.id}-${idx}`}>
                <div className="flex flex-col">
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-6 shadow-lg">
                    <Image fill src={item.image} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/30 backdrop-blur-md rounded-full text-sm font-semibold text-white">
                      {item.category}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full text-xs">
                      <div className="w-3.5 h-3.5 rounded-full overflow-hidden bg-zinc-300">
                        <Image width={400} height={400} src={item.author.avatar} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium text-slate-950">{item.author.name}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full text-xs">
                      <Clock size={12} className="text-slate-800" />
                      <span className="font-medium text-slate-950">{item.time}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-medium leading-tight">{item.title}</h3>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Tracker at the bottom of the Swiper */}
          <div className="mt-6 mb-10">
            <div className="w-full h-1 relative overflow-hidden news-tracker" />
          </div>

          <div className="lg:hidden mb-10 flex items-center justify-center">
            <PrimaryButton size="md" buttonName="Let's Connect" url="#" icon={<ArrowUpRight size={16} />} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .news-tracker.swiper-pagination-progressbar {
          position: relative !important;
          background: #f3f4f6 !important; /*  */
        }
        .news-tracker .swiper-pagination-progressbar-fill {
          background: #ff579f !important;
          transition-duration: 300ms !important;
        }
      `}</style>
    </section>
  );
}
