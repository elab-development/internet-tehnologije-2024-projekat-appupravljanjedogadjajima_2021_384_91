import { useMemo, useState } from "react";
import "./EventsPage.css";

export default function EventsPage() {
  // KATEGORIJE (primer, bez backenda)
  const [categories] = useState([
    { id: 1, name: "Ispiti", color: "#ef4444" },
    { id: 2, name: "Predavanja", color: "#3b82f6" },
    { id: 3, name: "Projekti", color: "#22c55e" },
  ]);

  // DOGAĐAJI (primer, bez backenda)
  const [events, setEvents] = useState([
    { id: 1, title: "Ispit iz Ekonomije", desc: "U amfiteatru", date: "2025-10-20", category: 1 },
    { id: 2, title: "Prezentacija projekta", desc: "Softversko inženjerstvo", date: "2025-10-23", category: 3 },
    { id: 3, title: "Gostujuće predavanje", desc: "Industrijski ekspert", date: "2025-10-25", category: 2 },
    { id: 4, title: "Rok za projekat", desc: "Predaja repoa", date: "2025-10-26", category: 3 },
    { id: 5, title: "Ispit iz Matematike", desc: "A1 sala", date: "2025-10-27", category: 1 },
    { id: 6, title: "Vežbe", desc: "Dodatne konsultacije", date: "2025-10-28", category: 2 },
    { id: 7, title: "Kolokvijum", desc: "Teorija", date: "2025-10-29", category: 1 },
    { id: 8, title: "Demo dan", desc: "Prezentacije timova", date: "2025-11-01", category: 3 },
    { id: 9, title: "Predavanje 12", desc: "SPA i routing", date: "2025-11-02", category: 2 },
    { id: 10, title: "Ispit iz OS", desc: "Kernel & IPC", date: "2025-11-03", category: 1 },
  ]);

  // FORM + FILTERI
  const [form, setForm] = useState({ title: "", desc: "", date: "", category: 1 });
  const [categoryFilter, setCategoryFilter] = useState("sve");
  const [searchText, setSearchText] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // PAGINACIJA
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Dodavanje događaja
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;

    const newEvent = {
      id: Math.max(0, ...events.map((e) => e.id)) + 1,
      title: form.title,
      desc: form.desc,
      date: form.date,
      category: parseInt(form.category),
    };

    setEvents([newEvent, ...events]);
    setForm({ title: "", desc: "", date: "", category: 1 });
    setPage(1); // vrati na prvu stranicu da se vidi novi unos
  };

  // PRIMENA FILTERA (kategorija + pretraga + opseg datuma)
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

    if (dateFrom) {
      data = data.filter((e) => e.date >= dateFrom);
    }
    if (dateTo) {
      data = data.filter((e) => e.date <= dateTo);
    }

    // sortiraj opadajuće po datumu (noviji prvi)
    data.sort((a, b) => (a.date < b.date ? 1 : -1));
    return data;
  }, [events, categoryFilter, searchText, dateFrom, dateTo]);

  // STRANICENJE (PAGE -> slice)
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageData = filtered.slice(start, end);

  // ICS export (ostaje isto)
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

     {/* FILTERI */}
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


      {/* LISTA + PAGINACIJA */}
      <ul className="event-list">
        {pageData.length === 0 ? (
          <p>Nema događaja za prikaz.</p>
        ) : (
          pageData.map((e) => {
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

      <div className="pagination">
        <div className="page-size">
          <label>Po stranici: </label>
          <select value={pageSize} onChange={(e) => { setPageSize(parseInt(e.target.value)); setPage(1); }}>
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
