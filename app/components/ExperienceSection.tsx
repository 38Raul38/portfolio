"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "../contexts/LanguageContext";

const StackedLayers = dynamic(() => import("./StackedLayers"), { ssr: false });

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeLayer, setActiveLayer] = useState(3);
  const { tr } = useLanguage();
  const experiences = tr.experience.items;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add("animate-in");
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = document.querySelector(".snap-container");
    const observers = itemRefs.current.map((el, idx) => {
      if (!el) return null;
      const layerIdx = experiences.length - 1 - idx;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveLayer(layerIdx);
        },
        { root: container as Element, threshold: 0.6 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(obs => obs?.disconnect());
  }, [experiences.length]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="snap-section section-overlay bg-white-section torn-edge-top torn-edge-bottom torn-white flex items-center justify-center px-6 md:px-16 py-20"
    >
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">

        <div className="flex-1 min-w-0">
          <div className="section-content mb-10 text-center lg:text-left">
            <span className="text-xs uppercase tracking-[0.3em] text-dark/40 font-medium">
              {tr.experience.label}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase mt-4 text-dark leading-tight">
              {tr.experience.title1} <span className="text-accent">{tr.experience.title2}</span>
            </h2>
          </div>

          <div className="space-y-2">
            {experiences.map((exp, idx) => {
              const layerIdx = experiences.length - 1 - idx;
              const isActive = activeLayer === layerIdx;
              const isLast = idx === experiences.length - 1;
              return (
                <div
                  key={exp.year}
                  ref={el => { itemRefs.current[idx] = el; }}
                  className="section-content relative pr-14 cursor-pointer"
                  style={{ transitionDelay: `${idx * 150 + 200}ms` }}
                  onMouseEnter={() => setActiveLayer(layerIdx)}
                  onMouseLeave={() => setActiveLayer(3)}
                >
                  <div
                    className={`absolute right-6 top-0 w-0.5 transition-colors duration-500 ${
                      isLast ? "bottom-6" : "bottom-0"
                    } ${isActive ? "bg-accent" : "bg-dark/15"}`}
                  />

                  <div
                    className={`absolute right-[18px] top-5 w-3 h-3 rounded-full border-2 z-10 transition-all duration-300 ${
                      isActive
                        ? "bg-accent border-accent scale-125 shadow-[0_0_0_4px_rgba(192,57,43,0.15)]"
                        : "bg-white border-dark/20"
                    }`}
                  />

                  <div
                    className={`rounded-2xl p-5 transition-all duration-300 ${
                      isActive
                        ? "bg-accent/6 border border-accent/20"
                        : "border border-transparent"
                    }`}
                  >
                    <span
                      className={`text-sm font-bold tracking-wide transition-colors duration-300 ${
                        isActive ? "text-accent" : "text-dark/40"
                      }`}
                    >
                      {exp.year}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-dark mt-1">
                      {exp.role}
                    </h3>
                    <p className="text-dark/40 text-xs font-medium uppercase tracking-wider mt-0.5">
                      {exp.company}
                    </p>
                    <p
                      className={`text-sm leading-relaxed mt-2 transition-all duration-300 ${
                        isActive ? "text-dark/70" : "text-dark/50"
                      }`}
                    >
                      {exp.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full lg:w-[400px] xl:w-[460px] h-[340px] md:h-[420px] lg:h-[500px] shrink-0">
          <StackedLayers activeIndex={activeLayer} />
        </div>

      </div>
    </section>
  );
}
