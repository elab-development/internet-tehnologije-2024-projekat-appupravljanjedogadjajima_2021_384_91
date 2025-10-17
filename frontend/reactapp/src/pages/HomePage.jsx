import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./HomePage.css";
import useFetch from "../hooks/useFetch";

export default function HomePage() {
  const { data: universities, loading, error, refetch } = useFetch(
    "https://raw.githubusercontent.com/hipo/university-domains-list/refs/heads/master/world_universities_and_domains.json"
  );

  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    console.log("✅ Početna stranica učitana - dobrodošli na Eventify!");
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

      <button onClick={refetch} className="refresh-btn">
            🔄 Osveži podatke
      </button>

        {loading && <p>⏳ Učitavanje događaja...</p>}
        {error && <p style={{ color: "red" }}>❌ {error}</p>}

        <div className="event-cards">
  {Array.isArray(universities) && universities.length > 0 ? (
    universities.slice(7536, 7544).map((uni, index) => ( //uzimamo samo 8
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
  ))
) : !loading && !error ? (
  <p>Nema dostupnih događaja za prikaz.</p>
) : null}

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
