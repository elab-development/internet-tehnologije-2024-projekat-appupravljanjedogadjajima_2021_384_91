import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate(); // React hook za navigaciju
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // osnovna validacija
    if (!email || !password) {
      setError("Sva polja su obavezna!");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Unesite ispravan e-mail!");
      return;
    }

    // simulacija ispravnih kredencijala
    if (email === "admin@eventify.com" && password === "12345") {
      console.log("Uspešna prijava:", email);
      setError("");

      // Navigacija na kalendar (ili home)
      navigate("/calendar");
    } else {
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
          <p>Zaboravili ste lozinku? <a href="#">Resetuj lozinku</a></p>
        </div>
      </div>
    </div>
  );
}
