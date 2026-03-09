"use client";

import { useEffect, useRef } from "react";

const skills = [
  {
    title: "Frontend",
    icon: "🎨",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS", "Framer Motion"],
  },
  {
    title: "Backend",
    icon: "⚙️",
    items: ["Node.js", "REST API", "Express", "SQL Server", "PostgreSQL", "Python"],
  },
  {
    title: "Database",
    icon: "🗄️",
    items: ["SQL Server", "DB Design", "Triggers", "Constraints", "Optimization", "Migrations"],
  },
  {
    title: "Tools",
    icon: "🛠️",
    items: ["Git", "VS Code", "Figma", "Docker", "Postman", "Linux"],
  },
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="snap-section section-overlay bg-accent torn-edge-top torn-accent flex items-center justify-center px-6 md:px-16 py-20 text-cream"
    >
      <div className="max-w-5xl w-full">
        <div className="section-content mb-12 md:mb-16 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-cream/40 font-medium">
            02 / Skills
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase mt-4 text-cream leading-tight">
            What I <span className="text-accent">Know</span>
          </h2>
          <p className="mt-4 text-cream/50 text-base md:text-lg max-w-xl mx-auto">
            Технологии и инструменты, с которыми я работаю каждый день
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {skills.map((skill, idx) => (
            <div
              key={skill.title}
              className="section-content group"
              style={{ transitionDelay: `${idx * 120 + 200}ms` }}
            >
              <div className="bg-cream/5 border border-cream/10 rounded-2xl p-6 hover:bg-accent/15 transition-all duration-500 h-full hover:border-accent/30">
                <span className="text-2xl mb-3 block">{skill.icon}</span>
                <h3 className="text-lg font-bold uppercase tracking-wide text-cream mb-4">
                  {skill.title}
                </h3>
                <ul className="space-y-2">
                  {skill.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-cream/50 flex items-center gap-2 group-hover:text-cream/70 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
