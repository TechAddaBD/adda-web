import { Locate } from "lucide-react";
import React from "react";
import { useMap } from "react-leaflet";

const LocateButton = ({ onLocate }) => {
  const map = useMap();
  const handleClick = () => {
    if (!navigator.geolocation) {
      alert("আপনার ব্রাউজারে Geolocation সাপোর্ট করে না!");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.flyTo([latitude, longitude], 18);
        onLocate([latitude, longitude]);
      },
      (err) => {
        alert("অবস্থান পাওয়া যায়নি!");
        console.error("❌ Geolocation Error:", err);
      }
    );
  };
  return (
    <button
      onClick={handleClick}
      className="absolute bottom-5 right-5 bg-white text-blue-600 px-4 py-2 rounded-full shadow-md hover:bg-blue-100 z-[999] flex items-center gap-2 cursor-pointer"
      title="See your location"
    >
      <Locate /> <span className="text-sm font-medium">Your location</span>
    </button>
  );
};

export default LocateButton;
