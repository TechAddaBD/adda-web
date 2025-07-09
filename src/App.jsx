import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AutoLoginAndTrack from "./pages/AutoLoginAndTrack";
import MapView from "./components/MapView";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="text-center mt-10">লোড হচ্ছে...</p>;

  return (
    <div>
      <AutoLoginAndTrack />
      {user ? (
        <MapView />
      ) : (
        <p className="text-center text-lg mt-10 text-red-500 font-semibold">
          🔒 ম্যাপ দেখতে হলে আগে Google সাইন ইন করুন।
        </p>
      )}
    </div>
  );
};

export default App;
