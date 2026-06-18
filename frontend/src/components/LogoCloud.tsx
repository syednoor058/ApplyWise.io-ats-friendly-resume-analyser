"use client";

const logos = [
  { name: "Red Bull", src: "/brand-logos/red-bull.webp" },
  { name: "Kroger", src: "/brand-logos/kroger.webp" },
  { name: "Emirates", src: "/brand-logos/emirates.webp" },
  { name: "Shark Ninja", src: "/brand-logos/shark-ninja.webp" },
  { name: "Sixt", src: "/brand-logos/sixt.webp" },
  { name: "XBox", src: "/brand-logos/xbox.webp" },
  { name: "PlayStation", src: "/brand-logos/playstation.webp" },
  { name: "HubSpot", src: "/brand-logos/hubspot.webp" },
  { name: "AXA", src: "/brand-logos/axa.webp" },
  { name: "JD", src: "/brand-logos/jd.webp" },
];

export default function LogoCloud() {
  return (
    <section className="overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Desktop: Text left, Logos right */}
        <div className="hidden md:grid grid-cols-12 gap-12 items-center mb-12">
          {/* Text */}
          <div className="col-span-2">
            <h2 className="text-base font-medium tracking-tight leading-[1.1]">
              Companies trusted by...
            </h2>
          </div>

          {/* Logo Scroll - Desktop */}
          <div className="col-span-10 relative">
            {/* Edge fade overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

            <div className="overflow-hidden">
              <div className="flex gap-10 marquee-scroll">
                {/* First set */}
                {logos.map((logo, index) => (
                  <div
                    key={`set1-${index}`}
                    className="h-14 shrink-0 flex items-center justify-center"
                    style={{ width: 160 }}
                  >
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className="w-full h-full object-contain invert-100"
                    />
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {logos.map((logo, index) => (
                  <div
                    key={`set2-${index}`}
                    className="h-14 shrink-0 flex items-center justify-center"
                    style={{ width: 160 }}
                  >
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className="w-full h-full object-contain invert-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Text top, Logos bottom */}
        <div className="md:hidden flex flex-col gap-8">
          {/* Text */}
          <h2 className="text-base font-medium tracking-tight leading-[1.1]">
            Companies trusted by...
          </h2>

          {/* Logo Scroll - Mobile */}
          <div className="relative">
            {/* Edge fade overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

            <div className="overflow-hidden">
              <div className="flex gap-8 marquee-scroll">
                {/* First set */}
                {logos.map((logo, index) => (
                  <div
                    key={`m-set1-${index}`}
                    className="h-12 shrink-0 flex items-center justify-center"
                    style={{ width: 120 }}
                  >
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className="w-full h-full object-contain invert-100"
                    />
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {logos.map((logo, index) => (
                  <div
                    key={`m-set2-${index}`}
                    className="h-12 shrink-0 flex items-center justify-center"
                    style={{ width: 120 }}
                  >
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className="w-full h-full object-contain invert-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-scroll {
          animation: marquee 30s linear infinite;
          width: fit-content;
        }

        .marquee-scroll:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}