import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Map from "./pages/Map";
import Home from "./pages/Home";
import { Route, Routes } from "react-router";

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
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        {user && <Route path="/map" element={<Map />} />}
      </Routes>
    </>
  );
};

export default App;
