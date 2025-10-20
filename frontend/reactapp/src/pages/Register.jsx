import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api"; 
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [password_confirmation, setPasswordConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !password_confirmation) {
        setError("Sva polja su obavezna");
        return;
    }
    if (password !== password_confirmation) {
        setError("Lozinke se ne poklapaju");
        return;
    }


    try {
      const data = await register(name, email, password, password_confirmation);      
      console.log("Registracija uspešna:", data);
      setError("");
      setSuccess("Uspešna registracija! Možete se prijaviti.");
      
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Registracija neuspešna. Proverite podatke.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Kreiranje naloga</h2>
        <p className="subtitle">Popunite polja da biste se registrovali</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>Ime:</label>
          <input
            type="text"
            placeholder="Unesite ime..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <label>Potvrdi lozinku:</label>
          <input
            type="password"
            placeholder="Ponovo unesite lozinku..."
            value={password_confirmation}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit" className="login-btn">
            Registruj se
          </button>
        </form>

        <div className="login-footer">
          <p>Već imate nalog? <a href="/login">Prijavite se</a></p>
        </div>
      </div>
    </div>
  );
}
