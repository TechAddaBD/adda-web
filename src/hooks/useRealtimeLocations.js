import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../services/firebaseConfig";

export default function useRealtimeLocations() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Changed to use Realtime Database `ref` and `onValue`
    const locationsRef = ref(db, "realtime_locations");
    const unsubscribe = onValue(
      locationsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const peopleData = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setPeople(peopleData);
        } else {
          setPeople([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching realtime locations:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Unsubscribe on cleanup
  }, []);

  return { people, loading };
}
