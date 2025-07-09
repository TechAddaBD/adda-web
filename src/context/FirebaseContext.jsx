import React, { createContext, useContext } from "react";
import { db } from "../services/firebaseConfig";

const FirebaseContext = createContext();

// Custom Hook
export const useFirebase = () => useContext(FirebaseContext);

// Provider Component
export const FirebaseProvider = ({ children }) => {
  const value = {
    db,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
