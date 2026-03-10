"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";

const navItems = [
  { key: "home",       href: "#home",       num: "01" },
  { key: "about",      href: "#about",      num: "02" },
  { key: "skills",     href: "#skills",     num: "03" },
  { key: "projects",   href: "#projects",   num: "04" },
  { key: "experience", href: "#experience", num: "05" },
  { key: "contact",    href: "#contact",   num: "06" },
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
  const { lang, setLang, tr } = useLanguage();
  const navLinks = navItems.map(item => ({ ...item, label: tr.nav[item.key as keyof typeof tr.nav] }));

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
        <motion.a
          href="#home"
          onClick={(e) => { e.preventDefault(); scrollTo("#home"); }}
          className="text-xl md:text-2xl font-black uppercase tracking-wider text-dark flex items-baseline overflow-visible"
          whileHover="hovered"
          initial="rest"
          animate="rest"
        >
          {/* R — falls off screen bottom, reappears from top, snaps back */}
          <motion.span
            className="inline-block"
            style={{ display: "inline-block" }}
            variants={{
              rest: { y: 0, rotate: 0, opacity: 1 },
              hovered: {
                y:       [0,   "110vh",  "110vh",  "-120%",  0],
                rotate:  [0,       22,      22,        0,    0],
                opacity: [1,        1,       0,        0,    1],
                transition: {
                  duration: 1.8,
                  times:   [0, 0.35, 0.36, 0.37, 1],
                  ease:    ["easeIn", "linear", "linear", "easeOut"],
                },
              },
            }}
          >
            R
          </motion.span>
          {/* Remaining letters of RAUL SEIDOV — subtle wave on hover */}
          {["A", "U", "L", "\u00A0", "S", "E", "I", "D", "O", "V"].map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              variants={{
                rest: { y: 0 },
                hovered: {
                  y: [0, -5, 0],
                  transition: {
                    duration: 0.4,
                    delay: 0.05 + i * 0.04,
                    ease: "easeInOut",
                  },
                },
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.a>
        <div className="hidden md:flex items-center gap-1">
        <ul className="flex gap-1 items-center">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <li key={link.href}>
                <motion.a
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  className="relative flex flex-col items-center px-4 py-2 group"
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                >
                  {/* Pill background */}
                  <motion.span
                    className="absolute inset-0 rounded-full bg-dark/8"
                    variants={{
                      rest: { opacity: 0, scaleX: 0.7, scaleY: 0.6 },
                      hover: { opacity: 1, scaleX: 1, scaleY: 1 },
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  />

                  {/* Number — slides down from above on hover */}
                  <motion.span
                    className="text-[9px] font-mono text-accent leading-none"
                    variants={{
                      rest: { opacity: 0, y: -6 },
                      hover: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {link.num}
                  </motion.span>

                  {/* Label — shifts up slightly on hover */}
                  <motion.span
                    className={`relative text-sm tracking-wide font-medium transition-colors duration-200 ${
                      isActive ? "text-accent" : "text-dark/60 group-hover:text-dark"
                    }`}
                    variants={{
                      rest: { y: 0 },
                      hover: { y: -1 },
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {link.label}
                  </motion.span>

                  {/* Active dot */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Hover underline (only when not active) */}
                  {!isActive && (
                    <motion.span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-dark/30"
                      variants={{
                        rest: { width: 0, opacity: 0 },
                        hover: { width: "60%", opacity: 1 },
                      }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                  )}
                </motion.a>
              </li>
            );
})}
        </ul>
        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === "en" ? "ru" : "en")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-dark/20 text-xs font-bold tracking-wider hover:border-dark/50 transition-all duration-200 ml-1"
        >
          <span className={lang === "en" ? "text-accent" : "text-dark/40"}>EN</span>
          <span className="text-dark/20 mx-0.5">/</span>
          <span className={lang === "ru" ? "text-accent" : "text-dark/40"}>RU</span>
        </button>
        </div>
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
                    href: "https://www.linkedin.com/in/raul-seidov-6393ba354/",
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
