import { Link } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-logo">Eventify</h2>

        <Link to="/" className="navbar-link">Početna</Link>
        <Link to="/calendar" className="navbar-link">Kalendar</Link>
        <Link to="/events" className="navbar-link">Događaji</Link>
        <Link to="/admin" className="navbar-link">Admin</Link>
      </div>

      <div className="navbar-right">
        <Link to="/login" className="navbar-button">Login</Link>
      </div>
    </nav>
  );
}
