import { Link } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const exampleEvents = [
    {
      id: 1,
      title: "Prezentacija projekta",
      desc: "Studenti predstavljaju projekte iz predmeta Softversko inženjerstvo.",
      date: "2025-10-23",
    },
    {
      id: 2,
      title: "Ispit iz ekonomije",
      desc: "Redovan rok, amfiteatar A2, početak u 9h.",
      date: "2025-10-21",
    },
    {
      id: 3,
      title: "FON konferencija",
      desc: "Događaj na kome predavači iz industrije dele iskustva.",
      date: "2025-11-05",
    },
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Dobrodošao na <span className="blue">Eventify</span> platformu</h1>
        <p>
          Tvoj lični sistem za praćenje, planiranje i organizovanje događaja.
          Pregledaj kalendar, dodaj sopstvene događaje i izvezi ih u iCal format.
        </p>

        <div className="hero-buttons">
          <Link to="/login" className="hero-btn primary">Prijavi se</Link>
          <Link to="/calendar" className="hero-btn secondary">Pogledaj kalendar</Link>
          <Link to="/events" className="hero-btn secondary">Moji događaji</Link>
        </div>
      </section>

      <section className="examples">
        <h2>Predstojeći događaji</h2>
        <div className="event-cards">
          {exampleEvents.map((e) => (
            <div key={e.id} className="event-card">
              <h3>{e.title}</h3>
              <p>{e.desc}</p>
              <small>📅 {e.date}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
