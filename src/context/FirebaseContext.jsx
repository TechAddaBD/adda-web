import React, { createContext, useContext } from "react";
import { db } from "../services/firebaseConfig";

// Context তৈরি
const FirebaseContext = createContext();

// Custom Hook
export const useFirebase = () => useContext(FirebaseContext);

// Provider Component
export const FirebaseProvider = ({ children }) => {
  const value = {
    db, // Firestore access
    // Future scope: auth, storage, etc.
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
