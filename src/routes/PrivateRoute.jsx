import React from "react";
import { Navigate } from "react-router";

export default function PrivateRoute({ children, user }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
}
