import React from "react";
import { Github, Heart, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-300 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        {/* Left Side - Branding */}
        <div className="flex items-center gap-2">
          <MapPin className="text-blue-500 dark:text-amber-400" />
          <span className="text-slate-700 dark:text-slate-300 font-semibold text-lg">
            AddaMap – ধানমন্ডি লেক আড্ডা
          </span>
        </div>

        {/* Middle - Short Info */}
        <div className="text-slate-600 dark:text-slate-400 text-sm">
          © {new Date().getFullYear()} AddaMap. Coded with{" "}
          <Heart className="inline-block w-4 h-4 text-red-500" /> by community.
        </div>

        {/* Right Side - GitHub or Social */}
        <div>
          <a
            href="https://github.com/your-github"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-500 dark:text-amber-400 hover:underline transition"
          >
            <Github className="w-5 h-5" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
