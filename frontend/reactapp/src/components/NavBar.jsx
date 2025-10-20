import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./NavBar.css";

export default function NavBar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    // 🔹 Reaguje na promene tokena bilo gde u aplikaciji
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);

    // Čisti listener kad se komponenta ukloni
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };
  const user = JSON.parse(localStorage.getItem("user"));
  {(user?.role === "admin" || user?.role === "organizer") && (<Link to="/create-event" className="navbar-link">Kreiraj događaj</Link>)}
  {user?.role === "admin" && (<Link to="/admin" className="navbar-link">Admin</Link>)}

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-logo">Eventify</h2>

        <Link to="/" className="navbar-link">Početna</Link>
        <Link to="/calendar" className="navbar-link">Kalendar</Link>
        <Link to="/events" className="navbar-link">Događaji</Link>
        {JSON.parse(localStorage.getItem("user"))?.role === "admin" && (<Link to="/admin" className="navbar-link">Admin</Link>)}
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="navbar-button logout">
            Logout
          </button>

        ) : (
          <Link to="/login" className="navbar-button">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
