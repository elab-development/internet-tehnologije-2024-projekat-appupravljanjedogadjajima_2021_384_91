import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { login } from "../api";
import { useEffect } from "react";
import { getEvents } from "../api";
import { Link } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setError("Sva polja su obavezna!");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    setError("Unesite ispravan e-mail!");
    return;
  }

  try {
    const data = await login(email, password);
    
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("storage"));
      console.log("Uspešna prijava:", data);

      setError("");
      navigate("/calendar");
    } else {
      setError("Login uspeo, ali token nije vraćen sa servera.");
    }
  } catch (err) {
    console.error(err);
    setError("Pogrešan email ili lozinka!");
  }
};


  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Prijava na Eventify</h2>
        <p className="subtitle">Unesite svoje podatke za pristup platformi</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Unesite email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Lozinka:</label>
          <input
            type="password"
            placeholder="Unesite lozinku..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn">
            Prijavi se
          </button>
        </form>

        <div className="login-footer">
          <p>Zaboravili ste lozinku?{" "} <Link to="/forgot-password" className="link"> Resetuj lozinku</Link></p>
          <p>Nemate nalog?{" "}<Link to="/register" className="link">Registrujte se</Link></p>
        </div>
      </div>
    </div>
  );
}
