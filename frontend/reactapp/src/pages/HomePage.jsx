import { Link } from "react-router-dom";
import { useState } from "react";
import "./HomePage.css";

export default function HomePage() {
  const exampleEvents = [
    {
      id: 1,
      title: "Prezentacija projekta",
      desc: "Studenti predstavljaju projekte iz predmeta Softversko inženjerstvo.",
      date: "2025-10-23",
      location: "FON - učionica 309",
    },
    {
      id: 2,
      title: "Ispit iz ekonomije",
      desc: "Redovan rok, amfiteatar 1, početak u 9h.",
      date: "2025-10-21",
      location: "FON - amfiteatar 1",
    },
    {
      id: 3,
      title: "FON konferencija",
      desc: "Događaj na kome predavači iz industrije dele iskustva i savete studentima.",
      date: "2025-11-05",
      location: "Kampus FON - velika sala",
    },
  ];

  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="home-page">
      <section className="hero">
        <h1>
          Dobrodošao na <span className="blue">Eventify</span> platformu
        </h1>
        <p>
          Tvoj lični sistem za praćenje, planiranje i organizovanje događaja.
          Pregledaj kalendar, dodaj sopstvene događaje i izvozi ih u iCal format.
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
        <h2>Predstojeći događaji</h2>
        <div className="event-cards">
          {exampleEvents.map((e) => (
            <div
              key={e.id}
              className="event-card clickable"
              onClick={() => setSelectedEvent(e)} // 👈 klik otvara modal
            >
              <h3>{e.title}</h3>
              <p>{e.desc}</p>
              <small>📅 {e.date}</small>
            </div>
          ))}
        </div>
      </section>

      {/* 👇 Modal za detalje događaja */}
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
            <h3>{selectedEvent.title}</h3>
            <p><strong>Opis:</strong> {selectedEvent.desc}</p>
            <p><strong>Datum:</strong> {selectedEvent.date}</p>
            <p><strong>Lokacija:</strong> {selectedEvent.location}</p>
          </div>
        </div>
      )}
    </div>
  );
}
