import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import App from "./App.jsx";
import { FirebaseProvider } from "./context/FirebaseContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <FirebaseProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </FirebaseProvider>
    </BrowserRouter>
  </StrictMode>
);
