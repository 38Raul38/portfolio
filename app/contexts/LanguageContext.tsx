"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "ru";

const t = {
  en: {
    // Navbar
    nav: { home: "Home", about: "About", skills: "Skills", projects: "Projects", experience: "Experience", contact: "Contact" },

    // Hero
    hero: {
      role: "Software Engineer & Web Developer",
      sub: "Building fast, scalable, and beautiful web applications with attention to detail.",
    },

    // About
    about: {
      label: "01 / About",
      title1: "About",
      title2: "Me",
      p1: "Software Engineer with hands-on experience building web applications and working with databases. I specialize in creating structured, scalable, and logically designed solutions.",
      p2: "Experienced with SQL Server and complex database design — triggers, constraints, and optimized queries. I work with React, backend logic, and API integration.",
      p3: "My approach is to write clean, maintainable code and turn complex problems into elegant solutions. I'm constantly learning and embracing new technologies.",
      stats: [
        { num: "3+", label: "Years of Exp" },
        { num: "20+", label: "Projects" },
        { num: "10+", label: "Technologies" },
        { num: "100%", label: "Delivered" },
      ],
    },

    // Skills
    skills: {
      label: "02 / Skills",
      title: "What I Know",
      sub: "Technologies and tools I work with every day",
    },

    // Projects
    projects: {
      label: "03 / Projects",
      title1: "My",
      title2: "Work",
      sub: "Selected projects that reflect my approach to development",
      items: [
        {
          title: "E-Commerce Platform",
          description: "Full-featured e-commerce platform with cart, payments, and admin dashboard. Built on Next.js with server-side rendering.",
        },
        {
          title: "Task Management App",
          description: "Task management app with drag-and-drop boards, real-time updates, and team collaboration. Includes productivity analytics.",
        },
        {
          title: "FitCal",
          description: "Calorie & nutrition tracker with a full REST API backend. Built with C#, PostgreSQL, React frontend, and deployed via Docker.",
        },
        {
          title: "Portfolio Generator",
          description: "SaaS platform for automatic portfolio generation. Users fill in their data and get a ready-made site with a unique design.",
        },
      ],
    },

    // Experience
    experience: {
      label: "04 / Experience",
      title1: "My",
      title2: "Path",
      items: [
        {
          year: "2023 — 2024",
          role: "Full-Stack Developer",
          company: "Tech Company",
          description: "Building internal business tools. Working with REST API, SQL Server, and designing databases with triggers and constraints.",
        },
        {
          year: "2024 — Present",
          role: "Frontend Developer",
          company: "Freelance / Personal Projects",
          description: "Building modern web applications with Next.js and React. UI/UX design, API integration, and performance optimization.",
        },
        {
          year: "2022 — 2023",
          role: "Junior Developer",
          company: "Startup",
          description: "Developing MVP products, configuring CI/CD, working with Docker. Participating in code reviews and agile processes.",
        },
        {
          year: "2021 — 2022",
          role: "Learning",
          company: "Self-Education & Courses",
          description: "Studying web development, algorithms, and data structures. Building practice projects and participating in hackathons.",
        },
      ],
    },

    // Contact
    contact: {
      role: "Software Engineer & Web Developer",
      line1: "Code With A",
      line2: "Clean Logic",
      sub: "Building fast, scalable, and beautiful web applications with attention to detail.",
      copyright: "© 2026 Raul. All rights reserved.",
    },
  },

  ru: {
    // Navbar
    nav: { home: "Главная", about: "Обо мне", skills: "Навыки", projects: "Проекты", experience: "Опыт", contact: "Контакт" },

    // Hero
    hero: {
      role: "Инженер-программист & Веб-разработчик",
      sub: "Создаю быстрые, масштабируемые и красивые веб-приложения с вниманием к деталям.",
    },

    // About
    about: {
      label: "01 / Обо мне",
      title1: "Обо",
      title2: "Мне",
      p1: "Инженер-программист с практическим опытом разработки веб-приложений и работы с базами данных. Специализируюсь на создании структурированных, масштабируемых и логично построенных решений.",
      p2: "Имею опыт работы с SQL Server и проектированием сложных структур БД — триггерами, ограничениями и оптимизированными запросами. Работаю с React, backend-логикой и интеграцией API.",
      p3: "Мой подход — писать чистый, поддерживаемый код и превращать сложные задачи в элегантные решения. Постоянно учусь и осваиваю новые технологии.",
      stats: [
        { num: "3+", label: "Года опыта" },
        { num: "20+", label: "Проектов" },
        { num: "10+", label: "Технологий" },
        { num: "100%", label: "Результат" },
      ],
    },

    // Skills
    skills: {
      label: "02 / Навыки",
      title: "Что я умею",
      sub: "Технологии и инструменты, с которыми я работаю каждый день",
    },

    // Projects
    projects: {
      label: "03 / Проекты",
      title1: "Мои",
      title2: "Работы",
      sub: "Избранные проекты, отражающие мой подход к разработке",
      items: [
        {
          title: "E-Commerce Platform",
          description: "Полнофункциональная платформа электронной коммерции с корзиной, оплатой и панелью администратора. Построена на Next.js с серверным рендерингом.",
        },
        {
          title: "Task Management App",
          description: "Приложение для управления задачами с drag-and-drop досками, real-time обновлениями и командной работой. Включает аналитику продуктивности.",
        },
        {
          title: "FitCal",
          description: "Трекер калорий и питания с полноценным REST API бэкендом. Написан на C#, PostgreSQL, React-фронтенд, деплой через Docker.",
        },
        {
          title: "Portfolio Generator",
          description: "SaaS-платформа для автоматической генерации портфолио. Пользователь заполняет данные — получает готовый сайт с уникальным дизайном.",
        },
      ],
    },

    // Experience
    experience: {
      label: "04 / Опыт",
      title1: "Мой",
      title2: "Путь",
      items: [
        {
          year: "2023 — 2024",
          role: "Full-Stack Developer",
          company: "Технологическая компания",
          description: "Создание внутренних инструментов для бизнеса. Работа с REST API, SQL Server, проектирование баз данных с триггерами и ограничениями.",
        },
        {
          year: "2024 — н.в.",
          role: "Frontend Developer",
          company: "Фриланс / Личные проекты",
          description: "Разработка современных веб-приложений на Next.js и React. Проектирование UI/UX, интеграция API, оптимизация производительности.",
        },
        {
          year: "2022 — 2023",
          role: "Junior Developer",
          company: "Стартап",
          description: "Разработка MVP продукта, настройка CI/CD, работа с Docker. Участие в код-ревью и agile-процессах.",
        },
        {
          year: "2021 — 2022",
          role: "Обучение",
          company: "Самообразование & Курсы",
          description: "Изучение веб-разработки, алгоритмов и структур данных. Создание учебных проектов и участие в хакатонах.",
        },
      ],
    },

    // Contact
    contact: {
      role: "Инженер-программист & Веб-разработчик",
      line1: "Код с",
      line2: "Чистой Логикой",
      sub: "Создаю быстрые, масштабируемые и красивые веб-приложения с вниманием к деталям.",
      copyright: "© 2026 Raul. Все права защищены.",
    },
  },
};

type Translations = typeof t.en;

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: Translations;
}

const LanguageContext = createContext<LangCtx>({
  lang: "en",
  setLang: () => {},
  tr: t.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <LanguageContext.Provider value={{ lang, setLang, tr: t[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
