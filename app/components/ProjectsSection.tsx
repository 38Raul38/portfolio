"use client";

import { useEffect, useRef } from "react";

const projects = [
  {
    title: "E-Commerce Platform",
    description:
      "Полнофункциональная платформа электронной коммерции с корзиной, оплатой и панелью администратора. Построена на Next.js с серверным рендерингом.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
    color: "bg-accent",
  },
  {
    title: "Task Management App",
    description:
      "Приложение для управления задачами с drag-and-drop досками, real-time обновлениями и командной работой. Включает аналитику продуктивности.",
    tags: ["React", "Node.js", "Socket.io", "MongoDB"],
    color: "bg-salmon",
  },
  {
    title: "Database Optimizer",
    description:
      "Инструмент для автоматического анализа и оптимизации SQL-запросов. Находит узкие места, предлагает индексы и оптимизирует структуру БД.",
    tags: ["SQL Server", "Python", "REST API", "Docker"],
    color: "bg-slate",
  },
  {
    title: "Portfolio Generator",
    description:
      "SaaS-платформа для автоматической генерации портфолио. Пользователь заполняет данные — получает готовый сайт с уникальным дизайном.",
    tags: ["Next.js", "Tailwind", "Prisma", "Vercel"],
    color: "bg-sage",
  },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
            03 / Projects
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase mt-4 text-dark leading-tight">
            My <span className="text-accent">Work</span>
          </h2>
          <p className="mt-4 text-dark/60 text-base md:text-lg max-w-xl mx-auto">
            Избранные проекты, которые отражают мой подход к разработке
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <div
              key={project.title}
              className="section-content"
              style={{ transitionDelay: `${idx * 150 + 200}ms` }}
            >
              <div className="project-card bg-cream rounded-2xl overflow-hidden h-full">
                {/* Color bar at top */}
                <div className={`h-2 ${project.color}`} />
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
                    {project.tags.map((tag) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}
