import { Locate } from "lucide-react";
import React from "react";

const LocateButton = ({ map, onLocate }) => { // map prop added
  const handleClick = () => {
    if (!map) {
      console.error("Google Map instance not available in LocateButton");
      return;
    }
    if (!navigator.geolocation) {
      alert("Browser not support Geolocation");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        map.panTo({ lat: latitude, lng: longitude }); // Use panTo for smooth movement
        map.setZoom(18); // Google Maps zoom level might need adjustment compared to Leaflet's
        if (onLocate) {
          onLocate([latitude, longitude]);
        }
      },
      (err) => {
        alert("Location Not Found!");
        console.error("❌ Geolocation Error:", err);
      }
    );
  };

  return (
    <button
      onClick={handleClick}
      className="absolute bottom-30 right-2.5 px-2 py-2 rounded-full shadow-md hover:bg-blue-100 z-[999] cursor-pointer"
      title="See your location"
    >
      <Locate />
    </button>
  );
};

export default LocateButton;
