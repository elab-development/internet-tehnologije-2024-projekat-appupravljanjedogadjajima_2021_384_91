import { useState } from "react";
import "./ChangePassword.css";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Sva polja su obavezna.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Nove lozinke se ne poklapaju.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Greška pri promeni lozinke.");

      setMessage("Lozinka je uspešno promenjena!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Promena lozinke</h2>
        <p className="subtitle">Unesite staru i novu lozinku</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label>Trenutna lozinka:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Unesite trenutnu lozinku..."
          />

          <label>Nova lozinka:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Unesite novu lozinku..."
          />

          <label>Potvrdite novu lozinku:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ponovo unesite novu lozinku..."
          />

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          <button type="submit" className="login-btn">
            Sačuvaj promene
          </button>
        </form>
      </div>
    </div>
  );
}
