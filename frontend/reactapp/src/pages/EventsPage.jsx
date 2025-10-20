import { useMemo, useState, useEffect } from "react";
import "./EventsPage.css";

export default function EventsPage() {
  // KATEGORIJE (možemo ih kasnije povlačiti iz backenda, zasad statično)
  const [categories, setCategories] = useState([
    { id: 1, name: "Konferencija", color: "#ef4444" },
    { id: 2, name: "Ispit", color: "#3b82f6" },
    { id: 3, name: "Radionica", color: "#22c55e" },
    { id: 4, name: "Projekat", color: "#ba22c5ff" },
    { id: 5, name: "Plenum", color: "#50c522ff" },
  ]);

  // DOGAĐAJI (sada se povlače iz backenda)
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FORM + FILTERI
  const [form, setForm] = useState({ title: "", desc: "", date: "", category: 1 });
  const [categoryFilter, setCategoryFilter] = useState("sve");
  const [searchText, setSearchText] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // PAGINACIJA
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // 🔹 1. POVLAČENJE DOGAĐAJA IZ BAZE
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await fetch("http://127.0.0.1:8000/api/events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Greška pri učitavanju događaja.");
        }

        // Backend vraća Event objekte (sa start_time, end_time, category, user_id itd.)
        const formatted = data.events.map((e) => ({
          id: e.id,
          title: e.title,
          desc: e.description || "",
          date: e.start_time ? e.start_time.substring(0, 10) : "", // uzimamo samo YYYY-MM-DD
          category: e.category_id || 1,
        }));

        setEvents(formatted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // 🔹 2. DODAVANJE DOGAĐAJA (radi samo lokalno za sad)
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.title.trim() || !form.date) return;

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // samo admin i organizator mogu kreirati događaj
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
        location: "Nepoznata lokacija",
        category_id: parseInt(form.category),
        start_time: form.date + " 10:00:00",
        end_time: form.date + " 11:00:00",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Greška pri dodavanju događaja.");
    }

    alert("✅ Događaj uspešno dodat!");

    setEvents((prev) => [
      {
        id: data.event.id,
        title: data.event.title,
        desc: data.event.description,
        date: data.event.start_time.substring(0, 10),
        category: data.event.category_id,
      },
      ...prev,
      ]);

      setForm({ title: "", desc: "", date: "", category: 1 });
      setPage(1);
      } catch (err) {
      alert("❌ " + err.message);
    }
  };


  // 🔹 3. FILTRI + SORTIRANJE (isto kao pre)
  const filtered = useMemo(() => {
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
          (e.desc || "").toLowerCase().includes(q)
      );
    }

    if (dateFrom) data = data.filter((e) => e.date >= dateFrom);
    if (dateTo) data = data.filter((e) => e.date <= dateTo);

    data.sort((a, b) => (a.date < b.date ? 1 : -1));
    return data;
  }, [events, categoryFilter, searchText, dateFrom, dateTo]);

  // 🔹 4. PAGINACIJA
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageData = filtered.slice(start, end);

  // 🔹 5. ICS Export ostaje isti
  const exportToICS = () => {
    if (filtered.length === 0) {
      alert("Nema događaja za izvoz!");
      return;
    }

    let icsContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\nPRODID:-//Eventify//React App//EN\r\n`;
    filtered.forEach((e) => {
      const [year, month, day] = e.date.split("-").map(Number);
      const startDate = `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}T100000Z`;
      const endDate = `${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}T110000Z`;
      icsContent += `BEGIN:VEVENT\r\nSUMMARY:${e.title}\r\nDESCRIPTION:${e.desc}\r\nDTSTART:${startDate}\r\nDTEND:${endDate}\r\nEND:VEVENT\r\n`;
    });
    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dogadjaji.ics";
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p style={{ textAlign: "center" }}>Učitavanje događaja...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div className="events-page">
      <h2>Događaji</h2>

      {/* Forma za dodavanje */}
      {["admin", "organizer"].includes(JSON.parse(localStorage.getItem("user"))?.role) && (
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
      )}
      {/* Filteri */}
      <div className="filter-bar">
        <div className="filter-row-top">
          <label>Kategorija: </label>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="sve">Sve</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <label>Pretraga: </label>
          <input
            type="text"
            placeholder="Naslov / opis…"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="filter-row-bottom">
          <label>Od datuma: </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
          />

          <label>Do datuma: </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="export-section">
          <button onClick={exportToICS} className="export-btn">
            📅 Izvezi filtrirane u iCal (.ics)
          </button>
        </div>
      </div>

      {/* Lista događaja */}
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
              </li>
            );
          })
        )}
      </ul>

      {/* Paginacija */}
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
    </div>
  );
}
