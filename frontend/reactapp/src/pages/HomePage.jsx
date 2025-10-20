import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./HomePage.css";
import useFetch from "../hooks/useFetch";

export default function HomePage() {
  const { data: universities, loading, error, refetch } = useFetch(
    "https://raw.githubusercontent.com/hipo/university-domains-list/refs/heads/master/world_universities_and_domains.json"
  );

  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("✅ Početna stranica učitana - dobrodošli na Eventify!");
  }, []);

  // 🔹 Funkcija: klik na univerzitet -> preusmeri na stranicu događaja
  const handleUniversityClick = (uni) => {
    navigate(`/events?location=${encodeURIComponent(uni.name)}`);
  };

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
        <h2>Univerziteti u Srbiji (eksterni API)</h2>

        <button onClick={refetch} className="refresh-btn">
          🔄 Osveži podatke
        </button>

        {loading && <p>⏳ Učitavanje univerziteta...</p>}
        {error && <p style={{ color: "red" }}>❌ {error}</p>}

        <div className="event-cards">
          {Array.isArray(universities) && universities.length > 0 ? (
            universities
              .filter((u) => u.country === "Serbia")
              .slice(0, 8) 
              .map((uni, index) => (
                <div
                  key={index}
                  className="event-card clickable"
                  onClick={() => handleUniversityClick(uni)}
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
            <p>Nema univerziteta za prikaz.</p>
          ) : null}
        </div>
      </section>

      
    </div>
  );
}
