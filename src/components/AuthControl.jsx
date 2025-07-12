import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import AutoLoginAndTrack from "../pages/AutoLoginAndTrack.jsx";

const guestStyle = {
  position: "absolute",
  bottom: "50%",
  left: "50%",
  transform: "translateX(-50%)",
  width: "300px",
  padding: "10px",
  zIndex: 500,
  border: "2px solid #ccc",
  borderRadius: "4px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
};

const logoutStyle = {
  position: "absolute",
  top: "1%",
  right: "0%",
  transform: "translateX(-50%)",
  padding: "10px",
  zIndex: 500,
  border: "1px solid #ccc",
  borderRadius: "10%",
  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
};

const SearchControl = () => {
  const { user, logout } = useAuth();
  return (
    <>
      {!user ? (
        <>
          <h1
            style={guestStyle}
            className="justify-center items-center text-center font-extrabold"
          >
            Weekly Tech Meetup by Dhanmondi Lake
            <AutoLoginAndTrack />
            <span className="text-blue-500">
              Every Saturday, 6:00 PM – 8:00 PM
            </span>
          </h1>
        </>
      ) : (
        <button
          onClick={logout}
          style={logoutStyle}
          className="hidden sm:block rounded cursor-pointer text-red-500"
        >
          Logout
        </button>
      )}
    </>
  );
};

export default SearchControl;
