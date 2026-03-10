"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

// Interpolate between two RGB colors based on progress (0-1)
function lerpColor(
  from: [number, number, number],
  to: [number, number, number],
  t: number
): string {
  const r = Math.round(from[0] + (to[0] - from[0]) * t);
  const g = Math.round(from[1] + (to[1] - from[1]) * t);
  const b = Math.round(from[2] + (to[2] - from[2]) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

const CREAM: [number, number, number] = [253, 242, 227]; // #fdf2e3
const BURGUNDY: [number, number, number] = [140, 20, 20]; // deep burgundy-red

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [bgColor, setBgColor] = useState(lerpColor(CREAM, BURGUNDY, 0));
  const { tr } = useLanguage();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.classList.add("animate-in");

    const container = document.querySelector(".snap-container");
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const heroHeight = el.offsetHeight;
      // progress goes from 0 (top) to 1 (hero fully scrolled past)
      const progress = Math.min(Math.max(scrollTop / heroHeight, 0), 1);
      setBgColor(lerpColor(CREAM, BURGUNDY, progress));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollDown = () => {
    const about = document.getElementById("about");
    about?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="snap-section hero-sticky relative flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: bgColor }}
    >
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-accent/10 blur-2xl" />
      <div className="absolute bottom-1/3 right-16 w-32 h-32 rounded-full bg-cream/10 blur-3xl" />

      <div className="text-center section-content">
        <p className="text-sm md:text-base uppercase tracking-[0.4em] text-dark/40 font-medium mb-6">
          {tr.hero.role}
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-black uppercase leading-[0.9] tracking-tight text-dark">
          Code With A
        </h1>
        <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-black uppercase leading-[0.9] tracking-tight text-accent mt-2">
          Clean Logic
        </h1>
        <p className="mt-8 text-dark/50 text-base md:text-lg max-w-md mx-auto leading-relaxed">
          {tr.hero.sub}
        </p>
      </div>

      <button
        onClick={scrollDown}
        className="absolute bottom-8 right-8 w-14 h-14 rounded-full bg-dark flex items-center justify-center text-cream hover:scale-110 transition-transform duration-300 shadow-lg"
        aria-label="Scroll down"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 13l5 5 5-5" />
          <path d="M7 7l5 5 5-5" />
        </svg>
      </button>
    </section>
  );
}
