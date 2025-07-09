import React, { useState } from "react";
import { MapPin, Send } from "lucide-react";
import { addCheckIn } from "../services/locationService";

export default function CheckInForm() {
  const [formData, setFormData] = useState({
    name: "",
    message: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
      },
      () => {
        alert("লোকেশন আনতে ব্যর্থ। অনুগ্রহ করে লোকেশন পারমিশন দিন।");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ✅ এখানে Firebase এ পাঠানোর কোড থাকবে
    const res = await addCheckIn(formData);
    if (res.success) {
      alert("✅ চেক-ইন সফল হয়েছে!");
    } else {
      alert("❌ চেক-ইন ব্যর্থ হয়েছে!");
    }
    console.log("🛰️ Submitted Data:", formData);
    alert("ধন্যবাদ! আপনি চেক-ইন করেছেন।");
    setFormData({ name: "", message: "", latitude: "", longitude: "" });
  };

  return (
    <section
      id="join"
      className="w-full bg-slate-50 dark:bg-slate-900 py-12 px-4"
    >
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
            ✅ আমি আসছি!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            আপনার নাম আর লোকেশন দিয়ে চেক-ইন করুন
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              আপনার নাম
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="যেমন: Rakib"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              আপনার বার্তা
            </label>
            <input
              type="text"
              name="message"
              id="message"
              placeholder="যেমন: বটতলার পাশে বসে আছি!"
              required
              value={formData.message}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              type="button"
              onClick={handleLocation}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-medium transition"
            >
              <MapPin className="w-5 h-5" />
              লোকেশন আনুন
            </button>

            <div className="text-sm text-slate-600 dark:text-slate-400">
              📍 Lat: {formData.latitude ? formData.latitude.toFixed(5) : "N/A"}
              , Lng:{" "}
              {formData.longitude ? formData.longitude.toFixed(5) : "N/A"}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-semibold transition"
            >
              <Send className="w-5 h-5" />
              চেক-ইন করুন
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
