"use client";

import { useEffect, useRef } from "react";

const stats = [
  { num: "3+", label: "Года опыта" },
  { num: "20+", label: "Проектов" },
  { num: "10+", label: "Технологий" },
  { num: "100%", label: "Результат" },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div className="section-content">
            <span className="text-xs uppercase tracking-[0.3em] text-dark/40 font-medium">
              01 / About
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase mt-4 text-dark leading-tight">
              About<br />
              <span className="text-accent">Me</span>
            </h2>
          </div>

          <div className="section-content delay-200">
            <p className="text-base md:text-lg text-dark/70 leading-relaxed mb-6">
              Software Engineer с практическим опытом разработки
              веб-приложений и работы с базами данных. Специализируюсь на создании
              структурированных, масштабируемых и логично построенных решений.
            </p>
            <p className="text-base md:text-lg text-dark/70 leading-relaxed mb-6">
              Имею опыт работы с SQL Server и проектированием сложных структур БД,
              триггерами, ограничениями и оптимизированными запросами. Работаю
              с React, backend-логикой и интеграцией API.
            </p>
            <p className="text-base md:text-lg text-dark/70 leading-relaxed">
              Мой подход — писать чистый, поддерживаемый код и превращать сложные задачи
              в элегантные решения. Постоянно учусь и осваиваю новые технологии.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className="section-content text-center p-6 rounded-2xl bg-dark/5"
              style={{ transitionDelay: `${400 + idx * 100}ms` }}
            >
              <span className="text-3xl md:text-4xl font-black text-accent">{stat.num}</span>
              <p className="text-xs uppercase tracking-[0.2em] text-dark/50 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
