import { useEffect, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../services/firebaseConfig";
import { defaultImage } from "../utils/defaultImage";

export default function AutoLoginAndTrack() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();

    // Listen for auth state change
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("✅ Logged in:", currentUser.displayName);
        setUser(currentUser);
        startTrackingLocation(currentUser); // Start location tracking
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    try {
      const result = await signInWithPopup(auth, provider);
      const loggedUser = result.user;
      setUser(loggedUser);
      console.log("✅ Google Sign-In successful:", loggedUser.displayName);
    } catch (error) {
      console.error("❌ Google Sign-In error:", error);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {!user && (
        <button
          onClick={handleGoogleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded shadow"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}

function startTrackingLocation(user) {
  const updateLocation = () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        const userData = {
          uid: user.uid,
          name: user.displayName || "Anonymous",
          photoURL: user.photoURL || defaultImage,
          lat: latitude,
          lng: longitude,
          updatedAt: Timestamp.now(),
        };

        setDoc(doc(db, "realtime_locations", user.uid), userData)
          .then(() => {
            console.log("📍 Location updated:", userData);
          })
          .catch((err) => {
            console.error("❌ Failed to update location:", err);
          });
      },
      (err) => {
        console.error("❌ Geolocation error:", err);
      }
    );
  };

  // Call immediately, then every 10s
  updateLocation();
  const interval = setInterval(updateLocation, 10000);

  // Cleanup on unmount
  return () => clearInterval(interval);
}
