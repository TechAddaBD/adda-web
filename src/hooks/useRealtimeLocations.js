import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

export default function useRealtimeLocations() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "realtime_locations"),
      (snapshot) => {
        const peopleData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPeople(peopleData);
      }
    );

    return () => unsubscribe(); // Unsubscribe on cleanup
  }, []);

  return { people };
}
