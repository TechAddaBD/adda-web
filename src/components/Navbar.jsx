import React, { useState, useEffect } from "react";
import { Sun, Moon, MapPin } from "lucide-react";

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <nav className="w-full shadow-md border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo + Title */}
        <div className="flex items-center gap-2">
          <MapPin className="text-blue-500 dark:text-amber-400" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            AddaMap
          </h1>
        </div>

        {/* Navigation Links (optional in future) */}
        <div className="hidden md:flex gap-6">
          <a
            href="#map"
            className="text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-amber-400 transition"
          >
            ম্যাপ দেখুন
          </a>
          <a
            href="#join"
            className="text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-amber-400 transition"
          >
            আমি আসছি
          </a>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-blue-500" />
          )}
        </button>
      </div>
    </nav>
  );
}
