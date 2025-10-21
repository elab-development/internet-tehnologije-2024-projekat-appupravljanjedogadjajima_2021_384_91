import { useState, useEffect} from "react";
import "./EventsPage.css";
import { useLocation } from "react-router-dom";

export default function EventsPage() {
  const [categories, setCategories] = useState([]);

  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]); // filtrirani događaji
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ title: "", desc: "", date: "", location: "", category: "" });
  const [categoryFilter, setCategoryFilter] = useState("sve");
  const [searchText, setSearchText] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const locationParam = params.get("location");

    if (locationParam) {
      setSearchText(locationParam);
      setCategoryFilter("sve");
      setDateFrom("");
      setDateTo("");

      setTimeout(() => {
        applyFilters();
      }, 200);
    }
  }, [location]);

  useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const [eventsRes, categoriesRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/events", {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }),
        fetch("http://127.0.0.1:8000/api/categories", {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }),
      ]);

      const eventsData = await eventsRes.json();
      const categoriesData = await categoriesRes.json();

      if (!eventsRes.ok) throw new Error(eventsData.message || "Greška pri učitavanju događaja.");
      if (!categoriesRes.ok) throw new Error(categoriesData.message || "Greška pri učitavanju kategorija.");

      const formattedEvents = (eventsData.events || []).map((e) => ({
        id: e.id,
        title: e.title,
        desc: e.description || "",
        date: e.start_time ? e.start_time.substring(0, 10) : "",
        category: e.category_id,
      }));

      setEvents(formattedEvents);
      setFiltered(formattedEvents);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Greška pri učitavanju:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.date || !form.category || !form.location) {
      alert("Popunite sva obavezna polja!");
      return;
    }

    if (!["admin", "organizer"].includes(user?.role)) {
      alert("Samo admini i organizatori mogu dodavati događaje.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.desc,
          location: form.location,
          category_id: parseInt(form.category),
          start_time: form.date + " 10:00:00",
          end_time: form.date + " 11:00:00",
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Greška pri dodavanju događaja.");

      alert("Događaj uspešno dodat!");

      const newEvent = {
        id: data.event.id,
        title: data.event.title,
        desc: data.event.description,
        location:data.event.location,
        date: data.event.start_time.substring(0, 10),
        category: data.event.category_id,
      };

      setEvents((prev) => [newEvent, ...prev]);
      setFiltered((prev) => [newEvent, ...prev]);
      setForm({ title: "", desc: "", date: "", category: "" });
      setPage(1);
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const applyFilters = () => {
    let data = [...events];

    if (categoryFilter !== "sve") {
      const cid = parseInt(categoryFilter);
      data = data.filter((e) => e.category === cid);
    }

    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      data = data.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.desc || "").toLowerCase().includes(q) ||
          (e.location || "").toLowerCase().includes(q)
      );
    }

    if (dateFrom) data = data.filter((e) => e.date >= dateFrom);
    if (dateTo) data = data.filter((e) => e.date <= dateTo);

    data.sort((a, b) => (a.date < b.date ? 1 : -1));
    setFiltered(data);
    setPage(1);
  };

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageData = filtered.slice(start, end);

  const exportToICS = () => {
    if (filtered.length === 0) {
      alert("Nema događaja za izvoz!");
      return;
    }

    const icsEvents = filtered
      .map((e) => {
        const [year, month, day] = e.date.split("-").map(Number);
        const startDate = `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}T100000Z`;
        const endDate = `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}T110000Z`;
        return [
          "BEGIN:VEVENT",
          `SUMMARY:${e.title}`,
          `DESCRIPTION:${e.desc}`,
          `DTSTART:${startDate}`,
          `DTEND:${endDate}`,
          "END:VEVENT",
        ].join("\r\n");
      })
      .join("\r\n");

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "CALSCALE:GREGORIAN",
      "PRODID:-//Eventify//EN",
      icsEvents,
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dogadjaji.ics";
    link.click();
    URL.revokeObjectURL(url);
  };

const openEditModal = (event) => {
  if (!event) return;
    setEditEvent(event);
    setIsEditOpen(true);
};

const closeEditModal = () => {
  setIsEditOpen(false);
  setEditEvent(null);
};

const handleUpdateEvent = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/events/${editEvent?.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: editEvent?.title,
        description: editEvent?.desc,
        category_id: parseInt(editEvent?.category),
        start_time: editEvent?.date + " 10:00:00",
        end_time: editEvent?.date + " 11:00:00",
      }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Greška pri ažuriranju događaja.");

    alert("Događaj uspešno izmenjen!");

    setEvents((prev) =>
      prev.map((ev) => (ev.id === editEvent?.id ? editEvent : ev))
    );
    setFiltered((prev) =>
      prev.map((ev) => (ev.id === editEvent?.id ? editEvent : ev))
    );

    closeEditModal();
  } catch (err) {
    alert("❌ " + err.message);
  }
};

  const handleDeleteEvent = async () => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovaj događaj?")) return;

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/events/${editEvent?.id}`, {
          method: "DELETE",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Greška pri brisanju događaja.");

        alert("Događaj uspešno obrisan!");

        setEvents((prev) => prev.filter((ev) => ev.id !== editEvent?.id));
        setFiltered((prev) => prev.filter((ev) => ev.id !== editEvent?.id));

        closeEditModal();
        } catch (err) {
        alert("❌ " + err.message);
      }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Učitavanje događaja...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div className="events-page">
      {["admin", "organizer"].includes(user?.role) && (
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
            type="text"
            placeholder="Lokacija događaja"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            required
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <select
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: parseInt(e.target.value) })
            }
            required
          >
            <option value="">Izaberi kategoriju</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
            ))}
          </select>

          <button type="submit" className="add-btn">Dodaj događaj</button>
        </form>
      )}
      <h2>Događaji</h2>

      <div className="filter-bar">
        <div className="filter-row-top">
          <label>Kategorija: </label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="sve">Sve</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <label>Pretraga: </label>
          <input
            type="text"
            placeholder="Naslov / opis…"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <button className="search-btn" onClick={applyFilters}>
            🔍 Pretraži
          </button>
        </div>

        <div className="filter-row-bottom">
          <label>Od datuma: </label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />

          <label>Do datuma: </label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />

          <button onClick={exportToICS} className="export-btn">
            Izvezi u iCal (.ics)
          </button>
        </div>
      </div>

      <ul className="event-list">
        {pageData.length === 0 ? (
          <p>Nema događaja za prikaz.</p>
        ) : (
          pageData.map((e) => {
            const category = categories.find((c) => c.id === e.category);
            return (
              <li key={e.id} style={{ borderLeft: `6px solid ${category?.color || "#ccc"}` }}>
                <div>
                  <h4>{e.title}</h4>
                  <p>{e.desc}</p>
                  <small>{e.date}</small>
                  </div>
                  <span className="event-category">{category?.name || "Nepoznato"}</span>
                  {user?.role === "admin" && (
                  <button
                  className="edit-btn"
                  onClick={() => openEditModal(e)}
                  title="Izmeni događaj"
                  >
                  ✏️
                  </button>
                  )}
                  </li>
            );
          })
        )}
      </ul>

      <div className="pagination">
        <div className="page-size">
          <label>Po stranici: </label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(parseInt(e.target.value));
              setPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={8}>8</option>
            <option value={10}>10</option>
          </select>
        </div>

        <div className="page-controls">
          <button
            className="page-btn"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ◀ Prethodna
          </button>

          <span className="page-indicator">
            Strana {currentPage} / {totalPages} ({total} ukupno)
          </span>

          <button
            className="page-btn"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Sledeća ▶
          </button>
        </div>
      </div>
      {isEditOpen && editEvent && (
  <div className="modal-overlay" onClick={closeEditModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={closeEditModal}>×</button>
      <h3>Izmeni događaj</h3>

      <form onSubmit={handleUpdateEvent} className="edit-form">
        <label>Naziv:</label>
        <input
          type="text"
          value={editEvent?.title || ""}
          onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
        />

        <label>Opis:</label>
        <input
          type="text"
          value={editEvent?.desc || ""}
          onChange={(e) => setEditEvent({ ...editEvent, desc: e.target.value })}
        />

        <label>Datum:</label>
        <input
          type="date"
          value={editEvent?.date || ""}
          onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })}
        />

        <label>Kategorija:</label>
        <select
          value={editEvent?.category || ""}
          onChange={(e) =>
            setEditEvent({ ...editEvent, category: parseInt(e.target.value) })
          }
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button type="submit" className="save-btn">Sačuvaj izmene</button>

        {user?.role === "admin" && (
          <button
            type="button"
            className="delete-btn"
            onClick={handleDeleteEvent}
          >
            Obriši događaj
          </button>
        )}
      </form>
    </div>
  </div>
)}


    </div>
  );
}
