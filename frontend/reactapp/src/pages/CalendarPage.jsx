import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./CalendarPage.css";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [modalDate, setModalDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // 🔹 Učitaj događaje iz baze
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/events", {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Greška pri učitavanju događaja.");

        const formatted = data.events.map((e) => ({
          id: e.id,
          title: e.title,
          start: e.start_time,
          end: e.end_time,
          backgroundColor:
            e.category_id === 1 ? "#ef4444" :
            e.category_id === 2 ? "#3b82f6" :
            e.category_id === 3 ? "#22c55e" :
            e.category_id === 4 ? "#ba22c5" :
            "#50c522",
          allDay: !e.start_time, 
        }));

        setEvents(formatted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  // 🔹 Klik na datum – samo admini i organizatori mogu dodavati
  const handleDateClick = (info) => {
    if (user?.role === "admin" || user?.role === "organizer") {
      setModalDate(info.dateStr);
    } else {
      alert("Samo admini i organizatori mogu dodavati događaje.");
    }
  };

  const handleCloseModal = () => setModalDate(null);

  // 🔹 Potvrda dodavanja događaja
  const handleConfirmAdd = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: "Novi događaj",
          description: "Dodat iz kalendara",
          location: "FON",
          category_id: 1,
          start_time: modalDate + " 10:00:00",
          end_time: modalDate + " 11:00:00",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Greška pri dodavanju događaja.");

      // Dodaj odmah novi događaj na kalendar
      setEvents((prev) => [
        ...prev,
        {
          id: data.event.id,
          title: data.event.title,
          start: data.event.start_time,
          end: data.event.end_time,
          allDay: false,
        },
      ]);

      alert("✅ Događaj dodat!");
      setModalDate(null);
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Učitavanje kalendara...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div className="calendar-page">
      <h2>Kalendar događaja</h2>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={events}

        eventColor="#2563eb"
        eventTextColor="white"
        displayEventTime={false}
        eventDisplay="block"             
        eventMaxStack={3}                
        moreLinkClick="popover"          
        aspectRatio={1.3}                
        dayMaxEventRows={3}             
        eventClassNames="calendar-event"
        dateClick={handleDateClick}/>

      {/* Modal za potvrdu dodavanja događaja */}
      {modalDate && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseModal}>×</button>
            <h3>Novi događaj</h3>
            <p>Želite li da dodate događaj za datum <strong>{modalDate}</strong>?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleConfirmAdd}>Da</button>
              <button className="cancel-btn" onClick={handleCloseModal}>Ne</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
