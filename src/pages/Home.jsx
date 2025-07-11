import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AutoLoginAndTrack from "./AutoLoginAndTrack";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="flex-grow flex flex-col justify-center items-center text-center px-4 py-16 max-w-4xl mx-auto">
        <AutoLoginAndTrack />
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight mb-4">
          Weekly Tech Meetup by Dhanmondi Lake <br />
          <span className="text-blue-500">
            Every Saturday, 6:00 PM – 8:00 PM
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl">
          A friendly gathering of developers, designers, entrepreneurs, and tech
          enthusiasts. <br />
          No registration, no fees — just meaningful conversations, knowledge
          sharing, and networking. <br />
          Stay updated with the fast-changing tech world and be part of a
          growing, collaborative community.
        </p>
      </header>

      <Footer />
    </div>
  );
}
