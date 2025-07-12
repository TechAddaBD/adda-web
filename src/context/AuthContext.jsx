import { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { defaultImage } from "../utils/defaultImage";
import { db } from "../services/firebaseConfig";
import { doc, setDoc, Timestamp } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        startTrackingLocation(currentUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    try {
      const result = await signInWithPopup(auth, provider);
      const loggedUser = result.user;
      setUser(loggedUser);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(getAuth());
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper to track user location
function startTrackingLocation(user) {
  const updateLocation = () => {
    if (!navigator.geolocation) return;

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

        setDoc(doc(db, "realtime_locations", user.uid), userData).catch((err) =>
          console.error("Failed to update location:", err)
        );
      },
      (err) => {
        console.error("Geolocation error:", err);
      }
    );
  };

  updateLocation();
  const interval = setInterval(updateLocation, 10000);
  return () => clearInterval(interval);
}
