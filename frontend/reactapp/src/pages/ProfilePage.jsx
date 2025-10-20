import { useEffect, useState } from "react";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user", {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Greška pri učitavanju korisnika.");

        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  if (loading) return <p style={{ textAlign: "center" }}>Učitavanje profila...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Profil korisnika</h2>
        <p><strong>Ime:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Uloga:</strong> {user.role}</p>

        {user.created_at && (
          <p><strong>Registrovan:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
        )}

        <hr />
        <button onClick={() => (window.location.href = "/change-password")}className="change-pass-btn">Promeni lozinku</button>

        <p style={{ color: "#666", fontSize: "0.9rem" }}>
          Podaci se automatski učitavaju iz baze.
        </p>
        
      </div>
    </div>
  );
}