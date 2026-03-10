"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "../contexts/LanguageContext";

const DeskCanvas = dynamic(() => import("./DeskCanvas"), { ssr: false });

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { tr } = useLanguage();
  const { about } = tr;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="snap-section section-overlay bg-cream-section torn-edge-top torn-cream flex items-center justify-center px-6 md:px-16 py-20"
    >
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">

        {/* LEFT — text + stats */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="section-content mb-10">
            <span className="text-xs uppercase tracking-[0.3em] text-dark/40 font-medium">
              {about.label}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase mt-4 text-dark leading-tight">
              {about.title1}<br />
              <span className="text-accent">{about.title2}</span>
            </h2>
          </div>

          <div className="section-content delay-200 space-y-4 mb-10">
            <p className="text-base md:text-lg text-dark/70 leading-relaxed">
              {about.p1}
            </p>
            <p className="text-base md:text-lg text-dark/70 leading-relaxed">
              {about.p2}
            </p>
            <p className="text-base md:text-lg text-dark/70 leading-relaxed">
              {about.p3}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            {about.stats.map((stat, idx) => (
              <div
                key={stat.label}
                className="section-content text-center p-4 rounded-2xl bg-dark/5 min-w-0"
                style={{ transitionDelay: `${400 + idx * 100}ms` }}
              >
                <span className="text-3xl md:text-4xl font-black text-accent">{stat.num}</span>
                <p className="text-[10px] uppercase tracking-wider text-dark/50 mt-2 truncate">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — 3D Desk */}
        <div className="w-full lg:w-[480px] xl:w-[540px] h-[380px] md:h-[440px] lg:h-[520px] shrink-0 rounded-2xl overflow-hidden">
          <DeskCanvas />
        </div>

      </div>
    </section>
  );
}
