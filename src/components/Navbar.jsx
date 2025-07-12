import { Sun, Moon, MapPin } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, loginWithGoogle, logout } = useAuth();

  return (
    <nav className="w-full shadow-md border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <MapPin className="text-blue-500 dark:text-amber-400" />
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            TechAdda
          </h1>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/map"
            className="text-slate-700 dark:text-slate-300 hover:text-blue-500 dark:hover:text-amber-400 transition"
          >
            Map
          </Link>

          {!user ? (
            <button
              onClick={loginWithGoogle}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-3 py-1 rounded"
            >
              Sign in
            </button>
          ) : (
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
