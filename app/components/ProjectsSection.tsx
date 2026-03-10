"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const CARD_BG = "#ECE2D3";

const projectsMeta = [
  { tags: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"], accent: "#C63A2B" },
  { tags: ["React", "Node.js", "Socket.io", "MongoDB"],       accent: "#A64A3B" },
  { tags: ["C#", "PostgreSQL", "React", "REST API", "Docker"], accent: "#6A707A" },
  { tags: ["Next.js", "Tailwind", "Prisma", "Vercel"],         accent: "#9A8F7A" },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { tr } = useLanguage();
  const { projects } = tr;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="snap-section section-overlay bg-white-section torn-edge-top torn-white flex items-center justify-center px-6 md:px-16 py-20"
    >
      <div className="max-w-6xl w-full">
        <div className="section-content mb-12 md:mb-16 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-dark/40 font-medium">
            {projects.label}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase mt-4 text-dark leading-tight">
            {projects.title1} <span className="text-accent">{projects.title2}</span>
          </h2>
          <p className="mt-4 text-dark/60 text-base md:text-lg max-w-xl mx-auto">
            {projects.sub}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.items.map((project, idx) => {
            const meta = projectsMeta[idx];
            return <div
              key={project.title}
              className="section-content"
              style={{ transitionDelay: `${idx * 150 + 200}ms` }}
            >
              <div className="project-card rounded-2xl overflow-hidden h-full" style={{ backgroundColor: CARD_BG }}>
                {/* Color bar at top */}
                <div className="h-2" style={{ backgroundColor: meta.accent }} />
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl md:text-2xl font-bold text-dark leading-tight">
                      {project.title}
                    </h3>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-dark/30 shrink-0 mt-1"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </div>
                  <p className="text-sm md:text-base text-dark/60 leading-relaxed mb-6">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {meta.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1.5 rounded-full bg-dark/8 text-dark/70 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
    </section>
  );
}
