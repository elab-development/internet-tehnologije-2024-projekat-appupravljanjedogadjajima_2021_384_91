import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./HomePage.css";

export default function HomePage() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect – poruka pri učitavanju
  useEffect(() => {
    console.log("✅ Početna stranica učitana - dobrodošli na Eventify!");

    // povlačenje podataka sa API-ja
    fetch("https://raw.githubusercontent.com/Hipo/university-domains-list/refs/heads/master/world_universities_and_domains.json")
      .then((res) => {
        if (!res.ok) throw new Error("Greška pri učitavanju podataka!");
        return res.json();
      })
      .then((data) => {
        setUniversities(data.slice(7536, 7544)); // uzimamo samo 8
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Greška:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <h1>
          Dobrodošao na <span className="blue">Eventify</span> platformu
        </h1>
        <p>
          Tvoj lični sistem za praćenje, planiranje i organizovanje događaja.
          Pregledaj kalendar, dodaj sopstvene događaje i izvezi ih u iCal format.
        </p>

        <div className="hero-buttons">
          <Link to="/login" className="hero-btn primary">
            Prijavi se
          </Link>
          <Link to="/calendar" className="hero-btn secondary">
            Pogledaj kalendar
          </Link>
          <Link to="/events" className="hero-btn secondary">
            Moji događaji
          </Link>
        </div>
      </section>

      <section className="examples">
        <h2>Predstojeći događaji (API podaci)</h2>

        {loading && <p>⏳ Učitavanje događaja...</p>}
        {error && <p style={{ color: "red" }}>❌ {error}</p>}

        <div className="event-cards">
          {universities.map((uni, index) => (
            <div
              key={index}
              className="event-card clickable"
              onClick={() => setSelectedEvent(uni)}
            >
              <h3>{uni.name}</h3>
              <p>Država: {uni.country}</p>
              {uni.web_pages && (
                <small>
                  🌐{" "}
                  <a
                    href={uni.web_pages[0]}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {uni.web_pages[0]}
                  </a>
                </small>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Modal sa detaljima */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-btn"
              onClick={() => setSelectedEvent(null)}
            >
              ×
            </button>
            <h3>{selectedEvent.name}</h3>
            <p><strong>Država:</strong> {selectedEvent.country}</p>
            {selectedEvent.web_pages && (
              <p>
                <strong>Web sajt:</strong>{" "}
                <a
                  href={selectedEvent.web_pages[0]}
                  target="_blank"
                  rel="noreferrer"
                >
                  {selectedEvent.web_pages[0]}
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
