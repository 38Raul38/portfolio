"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "../contexts/LanguageContext";

const PhoneCanvas = dynamic(() => import("./PhoneCanvas"), { ssr: false });

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { tr } = useLanguage();
  const { contact } = tr;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Sticky footer reveal — technique: outer clips, inner rises via sticky
  return (
    <div className="relative h-screen" style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}>
      <div className="relative h-[200vh] -top-[100vh]">
        <div className="h-screen sticky top-0">
          <section
            id="contact"
            ref={sectionRef}
            className="h-full bg-black-section flex items-center justify-center px-6 md:px-16 py-20 shadow-[0_-20px_60px_rgba(0,0,0,0.5)]"
          >
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-12">

        {/* Left — text & buttons */}
        <div className="flex-1 text-left">
          <div className="section-content">
            <p className="text-sm md:text-base uppercase tracking-[0.4em] text-cream/40 font-medium mb-6">
              {contact.role}
            </p>
            <h2 className="text-5xl md:text-7xl lg:text-[6rem] font-black uppercase leading-[0.9] tracking-tight text-cream">
              {contact.line1}
            </h2>
            <h2 className="text-5xl md:text-7xl lg:text-[6rem] font-black uppercase leading-[0.9] tracking-tight text-accent mt-2">
              {contact.line2}
            </h2>
            <p className="mt-8 text-cream/50 text-base md:text-lg max-w-md leading-relaxed">
              {contact.sub}
            </p>
          </div>

          <div className="section-content delay-200 mt-10 flex flex-wrap gap-4">
            <a
              href="mailto:raulseidov2006@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-cream rounded-full font-semibold text-sm uppercase tracking-wider hover:bg-accent-hover transition-colors duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 6L2 7" />
              </svg>
              Email
            </a>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cream text-dark rounded-full font-semibold text-sm uppercase tracking-wider hover:bg-cream/80 transition-colors duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
            <a
              href="https://t.me/Raaaul38"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-cream text-cream rounded-full font-semibold text-sm uppercase tracking-wider hover:bg-cream hover:text-dark transition-colors duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Telegram
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-cream/10">
            <p className="text-xs text-cream/40 uppercase tracking-wider">
              {contact.copyright}
            </p>
          </div>
        </div>

        {/* Right — 3D Phone */}
        <div className="w-full md:w-[380px] h-[500px] md:h-[600px] shrink-0">
          <PhoneCanvas />
        </div>

      </div>
          </section>
        </div>
      </div>
    </div>
  );
}