import React, { useEffect, useState } from "react";
import useRealtimeLocations from "../hooks/useRealtimeLocations";
import { getAuth } from "firebase/auth";
import SearchControl from "../components/SearchControl";
import LocateButton from "../components/LocateButton";
import MobileNavbar from "../components/MobileNavbar";
import MobileFooter from "../components/MobileFooter";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import AuthControl from "../components/AuthControl.jsx";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

const MapComponent = ({ people, currentUid, userPosition, onMapLoad }) => {
  const map = useMap();
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    if (map) {
      onMapLoad(map);
    }
  }, [map, onMapLoad]);

  return (
    <>
      {people.map((person) => {
        const isSelf = person.id === currentUid;
        const labelName = isSelf ? "🧍 Me" : person.name;
        const photoURL = person.photoURL || "location.png";

        return (
          <AdvancedMarker
            key={person.id}
            position={{ lat: person.lat, lng: person.lng }}
            onClick={() => setSelectedPerson(person)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "50%",
                padding: "1px 1px",
              }}
            >
              <img
                src={photoURL}
                alt={labelName}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                }}
              />
            </div>
          </AdvancedMarker>
        );
      })}

      {selectedPerson && (
        <InfoWindow
          position={{ lat: selectedPerson.lat, lng: selectedPerson.lng }}
          onCloseClick={() => setSelectedPerson(null)}
        >
          <div className="text-center space-y-1 p-2">
            <img
              src={selectedPerson.photoURL || "location.png"}
              alt="user"
              className="w-12 h-12 rounded-full mx-auto border border-slate-300"
            />
            <p className="font-semibold text-blue-600">
              {selectedPerson.id === currentUid ? "🧍 Me" : selectedPerson.name}
            </p>
            <p className="text-sm text-slate-500">
              ⏱️ Updated:{" "}
              {new Date(
                selectedPerson.updatedAt?.seconds * 1000
              ).toLocaleTimeString()}
            </p>
          </div>
        </InfoWindow>
      )}

      {userPosition && (
        <AdvancedMarker
          position={{ lat: userPosition[0], lng: userPosition[1] }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#4285F4",
              border: "1px solid white",
            }}
          />
        </AdvancedMarker>
      )}
    </>
  );
};

const MarkerComponent = ({ people }) => {
  const map = useMap();

  useEffect(() => {
    if (!window.google || !map || !window.google.maps.marker) {
      return;
    }

    const markers = people.map(
      (person) =>
        new window.google.maps.marker.AdvancedMarkerElement({
          position: { lat: person.lat, lng: person.lng },
          content: document.createElement("div"),
        })
    );
    new MarkerClusterer({ markers, map: map });
  }, [map, people]);
  return <></>;
};

const MapPage = () => {
  const { people } = useRealtimeLocations();
  const [currentUid, setCurrentUid] = useState(null);
  const [userPosition, setUserPosition] = useState(null); // [lat, lng]
  const [gMapInstance, setGMapInstance] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUid(user.uid);
    }
  }, []);

  const apiKey = import.meta.env.VITE_MAP_KEY;
  if (!apiKey) {
    console.warn(
      "Please replace YOUR_API_KEY with your actual Google Maps API key."
    );
    return (
      <p className="text-center text-red-600">
        Google Maps API Key not configured.
      </p>
    );
  }

  return (
    <section className="relative w-full h-screen bg-slate-100 dark:bg-slate-900 overflow-hidden">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: 23.7461685, lng: 90.3780503 }}
          defaultZoom={17}
          mapId={"YOUR_MAP_ID"}
          disableDefaultUI={true}
          zoomControl={true}
        >
          <MarkerComponent people={people} />
          <MapComponent
            people={people}
            currentUid={currentUid}
            userPosition={userPosition}
            onMapLoad={setGMapInstance}
          />
        </Map>
      </APIProvider>
      {gMapInstance && (
        <>
          <div className="hidden md:block">
            <SearchControl map={gMapInstance} />
          </div>
          <div className="md:hidden">
            <MobileNavbar map={gMapInstance} />
          </div>
        </>
      )}
      <MobileFooter />
      {gMapInstance && <AuthControl />}
      {gMapInstance && (
        <LocateButton map={gMapInstance} onLocate={setUserPosition} />
      )}
    </section>
  );
};

export default MapPage;
