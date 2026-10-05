"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Shield, Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-slate-950/80 dark:bg-slate-950/80 bg-white/80 backdrop-blur-md border-b border-white/10 dark:border-white/10 border-slate-200" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Left */}
        <Link href="/" className="flex items-center gap-2 group">
          <Shield className="w-8 h-8 text-blue-500 group-hover:text-cyan-400 transition-colors" />
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">CyberGuard</span>
        </Link>

        {/* Center (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors">Home</Link>
          <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors">Pricing</a>
          <a href="#about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors">About</a>
        </nav>

        {/* Right (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
          <Link href="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-white border border-slate-300 dark:border-white/20 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all hover:scale-105">
            Get Started &rarr;
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-slate-900 dark:text-white" onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-white/10 overflow-hidden"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              <Link href="/" onClick={() => setMobileMenu(false)} className="text-slate-900 dark:text-slate-200 font-medium">Home</Link>
              <a href="#features" onClick={() => setMobileMenu(false)} className="text-slate-900 dark:text-slate-200 font-medium">Features</a>
              <a href="#pricing" onClick={() => setMobileMenu(false)} className="text-slate-900 dark:text-slate-200 font-medium">Pricing</a>
              <a href="#about" onClick={() => setMobileMenu(false)} className="text-slate-900 dark:text-slate-200 font-medium">About</a>
              <hr className="border-slate-200 dark:border-white/10" />
              <Link href="/login" className="text-slate-900 dark:text-slate-200 font-medium">Sign In</Link>
              <Link href="/register" className="text-emerald-500 font-bold">Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
