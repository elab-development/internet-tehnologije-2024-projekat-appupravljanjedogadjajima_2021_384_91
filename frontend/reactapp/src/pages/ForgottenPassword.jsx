import { useState } from "react";
import "./ForgottenPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.status || "Ako nalog postoji, link je poslat na email.");
    } catch {
      setMessage("Došlo je do greške. Pokušajte ponovo.");
    }
  };

  return (
    <div className="password-container">
      <div className="password-card">
        <h2>Zaboravljena lozinka</h2>
        <form onSubmit={handleSubmit} className="password-form">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Unesite email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="password-btn">Pošalji link za reset</button>
        </form>
        {message && <p className="success-message">{message}</p>}
      </div>
    </div>
  );
}
