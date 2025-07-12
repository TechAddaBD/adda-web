import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { UserCircle } from "lucide-react";

const MobileNavbar = ({ map }) => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [searchMarker, setSearchMarker] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest("#profile-icon")
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (
      !map ||
      !inputRef.current ||
      !window.google ||
      !window.google.maps.places
    )
      return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: ["geometry", "name", "formatted_address"],
      }
    );

    autocomplete.bindTo("bounds", map);

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        console.log("No location found");
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      if (searchMarker) {
        searchMarker.setMap(null);
      }

      const newMarker = window.google.maps.marker?.AdvancedMarkerElement
        ? new window.google.maps.marker.AdvancedMarkerElement({
            position: place.geometry.location,
            map,
            title: place.name,
          })
        : new window.google.maps.Marker({
            position: place.geometry.location,
            map,
            title: place.name,
          });

      setSearchMarker(newMarker);
    });

    return () => {
      window.google.maps.event.removeListener(listener);
      if (searchMarker) searchMarker.setMap(null);
    };
  }, [map, searchMarker]);

  if (!user) return null;

  return (
    <div className="absolute top-0 left-0 w-full z-[1001] flex justify-between items-center p-2 bg-white shadow-md md:hidden">
      <input
        ref={inputRef}
        type="text"
        placeholder="Search location..."
        className="flex-1 px-3 py-1 rounded border mr-2 text-sm"
      />

      <button
        id="profile-icon"
        onClick={() => setShowProfile(!showProfile)}
        className="text-gray-700 hover:text-blue-600 focus:outline-none"
      >
        <UserCircle className="w-7 h-7" />
      </button>

      {showProfile && (
        <div
          ref={dropdownRef}
          className="absolute top-12 right-2 bg-white border rounded shadow-lg w-56 p-3 text-sm z-[1002]"
        >
          <p className="font-semibold">{user.displayName}</p>
          <p className="text-gray-500 text-xs">{user.email}</p>
          <hr className="my-2" />
          <button
            onClick={logout}
            className="text-red-600 w-full text-left font-medium hover:underline"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileNavbar;
