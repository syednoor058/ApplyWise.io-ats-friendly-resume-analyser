"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PrimaryButton from "./ui/PrimaryButton";

interface Service {
  id: number;
  name: string;
  href: string;
  image: string;
}

const services: Service[] = [
  { id: 1, name: "Precise Analysis", href: "#", image: "/work-images/work-1.jpg" },
  {
    id: 2,
    name: "Job Matching",
    href: "#",
    image: "/work-images/work-2.jpg",
  },
  {
    id: 3,
    name: "Optimization Tips",
    href: "#",
    image: "/work-images/work-4.jpg",
  },
  {
    id: 4,
    name: "Resume Builder",
    href: "#",
    image: "/work-images/work-3.jpg",
  },
  {
    id: 5,
    name: "Preparation Tools",
    href: "#",
    image: "/work-images/work-1.jpg",
  },
  { id: 6, name: "Real-Time Updates", href: "#", image: "/work-images/work-2.jpg" },
];

export default function OurServices() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>, id: number) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setHoveredId(id);
  };

  return (
    <section className="py-10 lg:py-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          {/* Left: Title with square image */}
          <div className="w-full md:w-[2/3]">
            <h2 className="text-[50px] lg:text-[75px] font-medium tracking-tight leading-none flex items-center">
              Our
              <span className="inline-flex items-center">
                <span className="inline-block w-12 h-12 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-lg overflow-hidden mx-3">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('/excellence.webp')" }}
                  />
                </span>
                Services
              </span>
            </h2>
          </div>

          {/* Right: Get in Touch button */}
          <div className="hidden w-full md:w-[1/3] md:flex items-center justify-start md:justify-end">
            <PrimaryButton
              size="lg"
              buttonName="Analyse Resume"
              url="/analyse"
              icon={<ArrowUpRight size={20} />}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-slate-700 mb-0 hidden md:block" />

        {/* Desktop: 2 cols × 3 rows grid */}
        <div className="hidden md:grid grid-cols-2 gap-x-10 mt-8">
          {services.map((service, index) => (
            <Link
              key={service.id}
              href={service.href}
              className="group relative overflow-hidden transition-all duration-300 rounded-full"
              style={{ padding: "1rem 1.5rem" }}
              onMouseEnter={(e) => handleMouseMove(e, service.id)}
              onMouseMove={(e) => handleMouseMove(e, service.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Background Image (appears on hover) */}
              <div
                className={`absolute inset-0 z-0 transition-opacity duration-500 ${
                  hoveredId === service.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${service.image}')` }}
                />
                <div className="absolute inset-0 bg-slate-900/40" />
              </div>

              {/* Divider (bottom border) */}
              {index < services.length - 2 && (
                <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-700" />
              )}

              {/* Content */}
              <div className="relative z-10 flex items-center gap-3">
                {/* Arrow Icon (slides in from left on hover) */}
                <div
                  className={`overflow-hidden transition-all duration-500 ${
                    hoveredId === service.id
                      ? "w-10 opacity-100"
                      : "w-0 opacity-0"
                  }`}
                >
                  <ArrowUpRight className={`text-white transition-transform duration-500 text-5xl ${
                      hoveredId === service.id
                        ? "translate-y-0"
                        : "translate-y-full"
                    }`} size={48} />
                </div>
                {/* Service Name */}
                <span
                  className={`text-lg md:text-[40px] font-medium transition-colors duration-300 ${
                    hoveredId === service.id
                      ? "text-white"
                      : "text-grey-900 whitespace-nowrap"
                  }`}
                >
                  {service.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile: Single column */}
        <div className="md:hidden flex flex-col">
          {services.map((service, index) => (
            <div key={service.id}>
              <Link
                href={service.href}
                className="flex items-center gap-4 py-4 group"
              >
                {/* Square Image Left */}
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${service.image}')` }}
                  />
                </div>

                {/* Service Name */}
                <span className="text-[30px] font-medium text-grey-900 group-hover:text-grey-600 transition-colors leading-none">
                  {service.name}
                </span>
              </Link>

              {/* Divider */}
              {index < services.length - 1 && (
                <div className="w-full h-px bg-slate-700" />
              )}
            </div>
          ))}

          <div className="flex items-center justify-center mt-5">
            <PrimaryButton
              size="md"
              buttonName="Analyse Resume"
              url="/analyse"
              icon={<ArrowUpRight size={16} />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
