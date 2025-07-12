import React, { useEffect, useState, useRef } from "react";
import useRealtimeLocations from "../hooks/useRealtimeLocations";
import { getAuth } from "firebase/auth";
import SearchControl from "../components/SearchControl";
import LocateButton from "../components/LocateButton";
import { getPhotoLabelIcon } from "../utils/getPhotoLabelIcon";

import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import AuthControl from "../components/AuthControl.jsx";

const render = (status) => {
  if (status === Status.LOADING) return <p className="text-center text-slate-600">Loading Map...</p>;
  if (status === Status.FAILURE) return <p className="text-center text-red-600">Error loading map.</p>;
  return null;
};

const GoogleMapComponent = ({
  people,
  currentUid,
  userPosition,
  onMapLoad,
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindow, setInfoWindow] = useState(null);
  const [markerCluster, setMarkerCluster] = useState(null);
  const [userCircle, setUserCircle] = useState(null);

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !map && window.google) {
      const initialMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 23.7461685, lng: 90.3780503 },
        zoom: 17, // Adjusted default zoom
        mapId: "YOUR_MAP_ID", // Optional: if you have a Map ID for custom styling
        disableDefaultUI: true,
        zoomControl: true,
      });
      setMap(initialMap);
      onMapLoad(initialMap); // Pass map instance up

      // Initialize InfoWindow (re-use one instance)
      setInfoWindow(new window.google.maps.InfoWindow());
    }
  }, [mapRef, map, onMapLoad]);

  // Initialize MarkerClusterer
  useEffect(() => {
    if (map && !markerCluster) {
      setMarkerCluster(new MarkerClusterer({ map, markers: [] }));
    }
    return () => {
      // Cleanup clusterer
      if (markerCluster) {
        markerCluster.clearMarkers();
      }
    };
  }, [map, markerCluster]);

  // Update markers
  useEffect(() => {
    if (!map || !infoWindow || !markerCluster || !window.google.maps.marker) return;

    // Clear previous markers from clusterer and map
    markerCluster.clearMarkers();
    markers.forEach(marker => marker.map = null); // Remove from map directly if not handled by clusterer well

    const newMarkers = people.map((person) => {
      const isSelf = person.id === currentUid;
      const labelName = isSelf ? "🧍 Me" : person.name;
      const photoURL = person.photoURL || "location.png"; // Ensure fallback.png is in public

      const markerContent = getPhotoLabelIcon(labelName, photoURL);

      const advMarker = new window.google.maps.marker.AdvancedMarkerElement({
        position: { lat: person.lat, lng: person.lng },
        map, // Add to map initially, clusterer will manage
        content: markerContent,
        title: labelName,
      });

      advMarker.addListener("click", () => {
        const popupContent = `
          <div class="text-center space-y-1 p-2">
            <img src="${photoURL}" alt="user" class="w-12 h-12 rounded-full mx-auto border border-slate-300" />
            <p class="font-semibold text-blue-600">${labelName}</p>
            <p class="text-sm text-slate-500">
              ⏱️ Updated: ${new Date(person.updatedAt?.seconds * 1000).toLocaleTimeString()}
            </p>
          </div>
        `;
        infoWindow.setContent(popupContent);
        infoWindow.open(map, advMarker);
      });
      return advMarker;
    });

    setMarkers(newMarkers);
    markerCluster.addMarkers(newMarkers);

  }, [map, people, currentUid, infoWindow, markerCluster]);

  // Update user location circle
  useEffect(() => {
    if (!map) return;

    if (userPosition) {
      if (userCircle) {
        userCircle.setCenter({ lat: userPosition[0], lng: userPosition[1] });
      } else {
        const circle = new window.google.maps.Circle({
          strokeColor: "#3182ce",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#90cdf4",
          fillOpacity: 0.35,
          map,
          center: { lat: userPosition[0], lng: userPosition[1] },
          radius: 50, // meters
        });
        setUserCircle(circle);
      }
    } else {
      if (userCircle) {
        userCircle.setMap(null); // Remove circle if userPosition is null
        setUserCircle(null);
      }
    }
  }, [map, userPosition, userCircle]);


  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
};


const Map = () => {
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

  // Filter active people (optional, can be done before passing to GoogleMapComponent)
  // const oneHourAgo = Date.now() - 60 * 60 * 1000;
  // const activePeople = people.filter((p) => {
  //   const updated = p.updatedAt?.seconds * 1000;
  //   return updated >= oneHourAgo;
  // });

  const apiKey = import.meta.env.VITE_MAP_KEY;
  if (!apiKey) {
     console.warn("Please replace YOUR_API_KEY with your actual Google Maps API key.");
     return <p className="text-center text-red-600">Google Maps API Key not configured.</p>;
  }


  return (
    <section className="relative w-full h-screen bg-slate-100 dark:bg-slate-900">
      <Wrapper apiKey={apiKey} render={render} libraries={["marker", "places"]}>
        <GoogleMapComponent
          people={people} // Pass all people, or activePeople
          currentUid={currentUid}
          userPosition={userPosition}
          onMapLoad={setGMapInstance}
        />
      </Wrapper>
      {gMapInstance && <SearchControl map={gMapInstance} />}
      {gMapInstance && <AuthControl />}
      {gMapInstance && <LocateButton map={gMapInstance} onLocate={setUserPosition} />}
    </section>
  );
};

export default Map;
