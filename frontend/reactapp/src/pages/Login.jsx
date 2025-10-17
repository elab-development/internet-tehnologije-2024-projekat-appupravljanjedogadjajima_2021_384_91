import { useState } from "react";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // simulacija logovanja
    if (email === "admin@eventify.com" && password === "1234") {
      setMessage("Uspešno ste se prijavili!");
    } else {
      setMessage("Pogrešan email ili lozinka!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Prijava na Eventify</h2>

        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Unesite email"
            required
          />

          <label>Lozinka:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Unesite lozinku"
            required
          />

          <button type="submit" className="login-btn">
            Prijavi se
          </button>
        </form>

        {message && (
          <p
            className={`login-message ${
              message.includes("Uspešno") ? "success" : "error"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
