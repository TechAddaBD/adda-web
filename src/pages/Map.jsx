import React, { useEffect, useState } from "react";
import useRealtimeLocations from "../hooks/useRealtimeLocations";
import { getAuth } from "firebase/auth";
import SearchControl from "../components/SearchControl";
import LocateButton from "../components/LocateButton";
import { getPhotoLabelIcon } from "../utils/getPhotoLabelIcon";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";

const Map = () => {
  const { people, loading } = useRealtimeLocations();
  const [currentUid, setCurrentUid] = useState(null);
  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUid(user.uid);
    }
  }, []);

  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  const activePeople = people.filter((p) => {
    const updated = p.updatedAt?.seconds * 1000;
    return updated >= oneHourAgo;
  });

  if (loading) {
    return <p className="text-center text-slate-600">Loading ...</p>;
  }

  return (
    <section className="relative w-full h-screen bg-slate-100 dark:bg-slate-900">
      <div className="w-full h-full">
        <div className="relative w-full h-full overflow-hidden">
          <MapContainer
            center={[23.7465, 90.374]}
            zoom={16}
            scrollWheelZoom={true}
            className="w-full h-full z-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <SearchControl />
            <LocateButton onLocate={setUserPosition} />

            <MarkerClusterGroup>
              {activePeople.map((person) => {
                const isSelf = person.id === currentUid;
                const labelName = isSelf ? "🧍 Me" : person.name;
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

            {userPosition && (
              <Circle
                center={userPosition}
                radius={50}
                pathOptions={{
                  color: "#3182ce",
                  fillColor: "#90cdf4",
                  fillOpacity: 0.3,
                }}
              />
            )}
          </MapContainer>
        </div>
      </div>
    </section>
  );
};

export default Map;
