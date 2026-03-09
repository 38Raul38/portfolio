"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "#home", num: "01" },
  { label: "About", href: "#about", num: "02" },
  { label: "Skills", href: "#skills", num: "03" },
  { label: "Projects", href: "#projects", num: "04" },
  { label: "Experience", href: "#experience", num: "05" },
  { label: "Contact", href: "#contact", num: "06" },
];

const ease: [number, number, number, number] = [0.76, 0, 0.24, 1];

const panelVariants = {
  closed: { x: "100%" },
  open: {
    x: "0%",
    transition: { duration: 0.8, ease },
  },
  exit: {
    x: "100%",
    transition: { duration: 0.6, ease, delay: 0.3 },
  },
};

const overlayVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.4, delay: 0.4 } },
};

const closeBtnVariants = {
  closed: { scale: 0, rotate: -180 },
  open: {
    scale: 1,
    rotate: 0,
    transition: { duration: 0.5, ease, delay: 0.4 },
  },
  exit: {
    scale: 0,
    rotate: 180,
    transition: { duration: 0.3, ease },
  },
};

const linkVariants = {
  closed: { opacity: 0, x: 60 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease,
      delay: 0.35 + i * 0.08,
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    x: 40,
    transition: {
      duration: 0.3,
      ease,
      delay: i * 0.04,
    },
  }),
};

const socialVariants = {
  closed: { opacity: 0, y: 20 },
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease, delay: 0.75 },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2, ease },
  },
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "skills", "projects", "experience", "contact"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= -100 && rect.top < window.innerHeight / 2) {
            setActiveSection(id);
            break;
          }
        }
      }
      const container = document.querySelector(".snap-container");
      if (container) setScrolled(container.scrollTop > 100);
    };

    const container = document.querySelector(".snap-container");
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = useCallback((href: string) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }, []);

  return (
    <>
      {/* ===== Top Navbar ===== */}
      <motion.nav
        initial={false}
        animate={{
          y: scrolled && !menuOpen ? -80 : 0,
          opacity: scrolled && !menuOpen ? 0 : 1,
        }}
        transition={{ duration: 0.6, ease }}
        className="fixed top-0 left-0 w-full z-40 px-8 md:px-14 py-5 flex items-center justify-between"
        style={{ pointerEvents: scrolled && !menuOpen ? "none" : "auto" }}
      >
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); scrollTo("#home"); }}
          className="text-xl md:text-2xl font-black uppercase tracking-wider text-dark"
        >
          Raul
        </a>
        <ul className="hidden md:flex gap-8 items-center">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className={`text-sm tracking-wide transition-colors duration-300 hover:text-accent ${
                  activeSection === link.href.replace("#", "")
                    ? "text-accent font-semibold"
                    : "text-dark/60"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </motion.nav>

      {/* ===== Burger Button ===== */}
      <motion.button
        initial={false}
        animate={{
          scale: scrolled && !menuOpen ? 1 : 0,
          opacity: scrolled && !menuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease }}
        onClick={() => setMenuOpen(true)}
        className="fixed top-6 right-6 md:top-8 md:right-10 z-[55] w-14 h-14 rounded-full bg-dark flex items-center justify-center cursor-pointer"
        style={{ pointerEvents: scrolled && !menuOpen ? "auto" : "none" }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open menu"
      >
        <div className="flex flex-col gap-[5px] items-center">
          <span className="block w-5 h-[2px] bg-cream rounded-full" />
          <span className="block w-5 h-[2px] bg-cream rounded-full" />
          <span className="block w-5 h-[2px] bg-cream rounded-full" />
        </div>
      </motion.button>

      {/* ===== Menu Overlay ===== */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dark overlay on left side */}
            <motion.div
              key="overlay"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="exit"
              className="fixed inset-0 z-[58] bg-black/40 backdrop-blur-[2px]"
              onClick={() => setMenuOpen(false)}
            />

            {/* Close button — red circle at panel edge */}
            <motion.button
              key="close-btn"
              variants={closeBtnVariants}
              initial="closed"
              animate="open"
              exit="exit"
              onClick={() => setMenuOpen(false)}
              className="fixed z-[65] w-14 h-14 rounded-full bg-accent flex items-center justify-center cursor-pointer shadow-lg"
              style={{ top: "2rem", right: "calc(50% - 1.75rem)" }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close menu"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fdf2e3" strokeWidth="3" strokeLinecap="round">
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Right panel */}
            <motion.div
              key="panel"
              variants={panelVariants}
              initial="closed"
              animate="open"
              exit="exit"
              className="fixed top-0 right-0 h-full w-full md:w-1/2 z-[60] bg-cream shadow-[-20px_0_60px_rgba(0,0,0,0.15)]"
            >
              {/* Left edge — torn paper effect */}
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-r from-dark/5 to-transparent" />

              <div className="h-full flex flex-col justify-center px-12 md:px-16 lg:px-20">
                {/* Nav links */}
                <div className="flex flex-col gap-6 md:gap-8">
                  {navLinks.map((link, idx) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      custom={idx}
                      variants={linkVariants}
                      initial="closed"
                      animate="open"
                      exit="exit"
                      onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                      className="group flex items-baseline gap-5"
                    >
                      <motion.span
                        className="text-dark/25 text-xs font-mono tracking-widest min-w-[1.5rem] text-right"
                        whileHover={{ color: "#c0392b" }}
                      >
                        {link.num}
                      </motion.span>
                      <motion.span
                        className={`text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight ${
                          activeSection === link.href.replace("#", "")
                            ? "text-accent"
                            : "text-dark"
                        }`}
                        whileHover={{
                          color: "#c0392b",
                          x: 8,
                          transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] },
                        }}
                      >
                        {link.label}
                      </motion.span>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Social icons */}
              <motion.div
                variants={socialVariants}
                initial="closed"
                animate="open"
                exit="exit"
                className="absolute bottom-10 left-12 md:left-16 lg:left-20 flex items-center gap-3"
              >
                {[
                  {
                    href: "https://github.com/",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    ),
                  },
                  {
                    href: "mailto:raul@example.com",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M22 7l-10 6L2 7" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://www.linkedin.com/",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://t.me/",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    ),
                  },
                ].map((social, i) => (
                  <motion.a
                    key={social.href}
                    href={social.href}
                    target={social.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-cream"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      transition: { delay: 0.8 + i * 0.07, duration: 0.4, ease },
                    }}
                    exit={{
                      scale: 0,
                      opacity: 0,
                      transition: { duration: 0.2 },
                    }}
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
