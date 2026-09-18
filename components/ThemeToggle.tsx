'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('splitupi_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = stored === 'dark' || (!stored && prefersDark);
    
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('splitupi_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('splitupi_theme', 'light');
    }
  };

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      id="theme-toggle-btn"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 animate-in spin-in-180 duration-200" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700 animate-in spin-in-180 duration-200" />
      )}
    </button>
  );
}
