import React, { useState, useEffect } from "react";
import { Sun, Moon, MapPin } from "lucide-react";
import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="w-full shadow-md border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <MapPin className="text-blue-500 dark:text-amber-400" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            TechAdda
          </h1>
        </Link>

        <div className="hidden md:flex gap-6">
          <Link
            to="/map"
            className="text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-amber-400 transition"
          >
            ম্যাপ দেখুন
          </Link>
        </div>
      </div>
    </nav>
  );
}
