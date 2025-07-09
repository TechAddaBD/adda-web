import React from "react";
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import CheckInForm from "../components/CheckInForm";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="flex-grow flex flex-col justify-center items-center text-center px-4 py-16 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight mb-4">
          ধানমন্ডি লেকপাড়ে{" "}
          <span className="text-blue-500">শনিবার সন্ধ্যা ৬টা থেকে ৮টা</span>{" "}
          পর্যন্ত <br />
          সবাই মিলে <span className="text-amber-500">আড্ডা</span> দিই!
        </h1>
        <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl">
          কোনো রেজিস্ট্রেশন ফি নেই, কোনো চাপ নেই। শুধু শেয়ার হবে জ্ঞান, আইডিয়া
          আর ঝালমুড়ি। <br />
          টেক দুনিয়া দ্রুত এগোচ্ছে, তাই নিয়মিত আড্ডায় যোগ দিয়ে সবার সাথে থাকো।
        </p>
      </header>

      {/* Map Section */}
      <MapView />

      {/* Check-In Form Section */}
      <CheckInForm />

      {/* Footer */}
      <Footer />
    </div>
  );
}
