"use client";

import { useEffect, useRef } from "react";

const experiences = [
  {
    year: "2024 — н.в.",
    role: "Frontend Developer",
    company: "Freelance / Personal Projects",
    description:
      "Разработка современных веб-приложений на Next.js и React. Проектирование UI/UX, интеграция API, оптимизация производительности.",
  },
  {
    year: "2023 — 2024",
    role: "Full-Stack Developer",
    company: "Tech Company",
    description:
      "Создание внутренних инструментов для бизнеса. Работа с REST API, SQL Server, проектирование баз данных с триггерами и ограничениями.",
  },
  {
    year: "2022 — 2023",
    role: "Junior Developer",
    company: "Startup",
    description:
      "Разработка MVP продукта, настройка CI/CD, работа с Docker. Участие в код-ревью и agile-процессах.",
  },
  {
    year: "2021 — 2022",
    role: "Обучение",
    company: "Самообразование & Курсы",
    description:
      "Изучение веб-разработки, алгоритмов и структур данных. Создание учебных проектов и участие в хакатонах.",
  },
];

export default function ExperienceSection() {
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
      id="experience"
      ref={sectionRef}
      className="snap-section section-overlay-sticky bg-white-section torn-edge-top torn-white flex items-center justify-center px-6 md:px-16 py-20"
    >
      <div className="max-w-4xl w-full">
        <div className="section-content mb-12 md:mb-16 text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-dark/40 font-medium">
            04 / Experience
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase mt-4 text-dark leading-tight">
            My <span className="text-accent">Path</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="timeline-line text-dark/20" />

          <div className="space-y-12">
            {experiences.map((exp, idx) => (
              <div
                key={exp.year}
                className="section-content relative pl-12 md:pl-0"
                style={{ transitionDelay: `${idx * 150 + 200}ms` }}
              >
                {/* Dot */}
                <div className="absolute left-[0.65rem] md:left-1/2 md:-translate-x-1/2 top-1 w-3 h-3 rounded-full bg-accent border-2 border-dark/20 z-10" />

                <div
                  className={`md:w-[calc(50%-2rem)] ${
                    idx % 2 === 0 ? "md:ml-auto md:pl-8" : "md:mr-auto md:pr-8 md:text-right"
                  }`}
                >
                  <span className="text-accent text-sm font-bold tracking-wide">
                    {exp.year}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-dark mt-1">
                    {exp.role}
                  </h3>
                  <p className="text-dark/40 text-sm font-medium uppercase tracking-wider mt-1">
                    {exp.company}
                  </p>
                  <p className="text-dark/60 text-sm md:text-base leading-relaxed mt-3">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
