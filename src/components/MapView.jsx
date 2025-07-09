import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { getAuth } from "firebase/auth";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import useRealtimeLocations from "../hooks/useRealtimeLocations";

// Marker with photo and name label
const getPhotoLabelIcon = (name, photoURL) =>
  divIcon({
    html: `
      <div style="
        display: flex;
        align-items: center;
        background: #fff;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 4px 8px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      ">
        <img src="${photoURL}" style="width:24px;height:24px;border-radius:50%;margin-right:6px;" />
        <span style="font-size:13px;font-weight:500;color:#333;">${name}</span>
      </div>
    `,
    className: "",
    iconSize: [120, 32],
    iconAnchor: [60, 16],
  });

export default function MapView() {
  const { people, loading } = useRealtimeLocations();
  const [currentUid, setCurrentUid] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUid(user.uid);
    }
  }, []);

  if (loading) {
    return <p className="text-center text-slate-600">লোড হচ্ছে...</p>;
  }

  // Filter last 1 hour's active users
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const activePeople = people.filter((p) => {
    const updated = p.updatedAt?.seconds * 1000;
    return updated >= oneHourAgo;
  });

  // Center map to current location
  const handleFindMe = () => {
    if (!mapRef.current) {
      console.warn("Map not ready yet");
      return;
    }
    if (!navigator.geolocation) {
      alert("Geolocation আপনার ব্রাউজারে সাপোর্ট করে না!");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        mapRef.current.flyTo([latitude, longitude], 18);
      },
      (error) => {
        console.error("❌ অবস্থান নেওয়া যায়নি:", error);
        alert("অবস্থান পাওয়া যায়নি!");
      }
    );
  };

  return (
    <section className="relative w-full min-h-[500px] py-10 px-4 bg-slate-100 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            🗺️ ম্যাপে সক্রিয় সবাই
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            শেষ ১ ঘণ্টায় সক্রিয় সকল ইউজারদের লাইভ লোকেশন
          </p>
        </div>

        {/* Map container */}
        <div className="relative w-full h-[500px] rounded-xl overflow-hidden border shadow">
          {/* 📍 My Location Button */}
          <button
            onClick={handleFindMe}
            className="absolute top-5 right-5 bg-white text-blue-600 px-4 py-2 rounded-full shadow-md hover:bg-blue-100 z-[999] flex items-center gap-2"
            title="আমার অবস্থান দেখাও"
          >
            📍 <span className="text-sm font-medium">আমার অবস্থান</span>
          </button>

          <MapContainer
            center={[23.7465, 90.374]}
            zoom={16}
            scrollWheelZoom={true}
            className="w-full h-full z-10"
            whenCreated={(mapInstance) => {
              mapRef.current = mapInstance;
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MarkerClusterGroup>
              {activePeople.map((person) => {
                const isSelf = person.id === currentUid;
                const labelName = isSelf ? "🧍 আপনি" : person.name;
                const photoURL = person.photoURL || "fallback.png";

                return (
                  <Marker
                    key={person.id}
                    position={[person.lat, person.lng]}
                    icon={getPhotoLabelIcon(labelName, photoURL)}
                  >
                    <Popup>
                      <div className="text-center space-y-1">
                        <img
                          src={photoURL}
                          alt="user"
                          className="w-12 h-12 rounded-full mx-auto border border-slate-300"
                        />
                        <p className="font-semibold text-blue-600">
                          {labelName}
                        </p>
                        <p className="text-sm text-slate-500">
                          ⏱️ Updated:{" "}
                          {new Date(
                            person.updatedAt?.seconds * 1000
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>
    </section>
  );
}
