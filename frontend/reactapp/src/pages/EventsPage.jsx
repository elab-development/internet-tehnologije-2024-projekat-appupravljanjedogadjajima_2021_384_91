import { useState } from "react";
import { createEvents } from "ics";
import "./EventsPage.css";

export default function EventsPage() {
  const [categories] = useState([
    { id: 1, name: "Ispiti", color: "#ef4444" },
    { id: 2, name: "Predavanja", color: "#3b82f6" },
    { id: 3, name: "Projekti", color: "#22c55e" },
  ]);

  const [events, setEvents] = useState([
    { id: 1, title: "Ispit iz Ekonomije", desc: "U amfiteatru", date: "2025-10-20", category: 1 },
    { id: 2, title: "Prezentacija projekta", desc: "Softversko inženjerstvo", date: "2025-10-23", category: 3 },
  ]);

  const [filter, setFilter] = useState("sve");
  const [form, setForm] = useState({ title: "", desc: "", date: "", category: 1 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const newEvent = {
      id: Math.max(0, ...events.map((e) => e.id)) + 1,
      title: form.title,
      desc: form.desc,
      date: form.date,
      category: parseInt(form.category),
    };

    setEvents([...events, newEvent]);
    setForm({ title: "", desc: "", date: "", category: 1 });
  };

  const filteredEvents =
    filter === "sve"
      ? events
      : events.filter((e) => e.category === parseInt(filter));

  const exportToICS = () => {
    if (events.length === 0) {
      alert("Nema događaja za izvoz!");
      return;
    }

    const icsEvents = events.map((e) => {
      const [year, month, day] = e.date.split("-").map(Number);
      return {
        title: e.title,
        description: e.desc,
        start: [year, month, day, 10, 0],
        duration: { hours: 1 },
      };
    });

    const { error, value } = createEvents(icsEvents);

    if (error) {
      console.error(error);
      alert("Greška pri kreiranju .ics fajla!");
      return;
    }

    const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dogadjaji.ics";
    link.click();
  };

  return (
    <div className="events-page">
      <h2>Moji događaji</h2>

      {/* Forma za dodavanje */}
      <form className="event-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Naziv događaja"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Opis događaja"
          value={form.desc}
          onChange={(e) => setForm({ ...form, desc: e.target.value })}
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button type="submit" className="add-btn">Dodaj događaj</button>
      </form>

      {/* Filter */}
      <div className="filter-bar">
        <label>Filtriraj po kategoriji: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="sve">Sve</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Dugme za izvoz */}
      <div className="export-section">
        <button onClick={exportToICS} className="export-btn">📅 Izvezi događaje u iCal (.ics)</button>
      </div>

      {/* Lista događaja */}
      <ul className="event-list">
        {filteredEvents.length === 0 ? (
          <p>Nema događaja za prikaz.</p>
        ) : (
          filteredEvents.map((e) => {
            const category = categories.find((c) => c.id === e.category);
            return (
              <li key={e.id} style={{ borderLeft: `6px solid ${category.color}` }}>
                <div>
                  <h4>{e.title}</h4>
                  <p>{e.desc}</p>
                  <small>{e.date}</small>
                </div>
                <span className="event-category">{category.name}</span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
