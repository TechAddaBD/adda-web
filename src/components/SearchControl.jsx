import React, { useEffect, useRef, useState } from "react";

// Basic styling for the search input, can be expanded or moved to a CSS file
const searchInputStyle = {
  position: 'absolute',
  top: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '300px',
  padding: '10px',
  zIndex: 1000, // Ensure it's above the map
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
};

const SearchControl = ({ map }) => {
  const inputRef = useRef(null);
  const [searchMarker, setSearchMarker] = useState(null);

  useEffect(() => {
    if (!map || !inputRef.current || !window.google || !window.google.maps.places) {
      // console.warn("SearchControl: Map, input ref, or Google Places API not available yet.");
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ["geometry", "name", "formatted_address"],
    });

    autocomplete.bindTo("bounds", map); // Bias search results to the map's viewport

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        console.log("No details available for input: '" + place.name + "'");
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17); // Or a suitable zoom level
      }

      // Add or update a marker for the searched location
      if (searchMarker) {
        searchMarker.position = place.geometry.location;
        searchMarker.map = map; // Ensure it's on the map
      } else {
        // Assuming AdvancedMarkerElement is loaded (via API script)
        if (window.google.maps.marker && window.google.maps.marker.AdvancedMarkerElement) {
          const newMarker = new window.google.maps.marker.AdvancedMarkerElement({
            position: place.geometry.location,
            map: map,
            title: place.name,
            // content: can be customized if needed
          });
          setSearchMarker(newMarker);
        } else {
          // Fallback to basic marker if AdvancedMarkerElement is not available
          const newMarker = new window.google.maps.Marker({
            position: place.geometry.location,
            map: map,
            title: place.name,
          });
          setSearchMarker(newMarker);
        }
      }
    });

    return () => {
      if (window.google && window.google.maps && window.google.maps.event) {
         window.google.maps.event.removeListener(listener);
         // It's also good practice to clear instance listeners from the autocomplete instance itself
         // but the 'place_changed' is the main one here.
         // If the Autocomplete instance itself needs cleanup, Google's docs should be consulted.
      }
      // Clean up the marker when the component unmounts or map changes
      if (searchMarker) {
        searchMarker.map = null;
      }
    };
  }, [map, searchMarker]); // Rerun if map changes

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Search location..."
      style={searchInputStyle}
    />
  );
};

export default SearchControl;
