import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./CalendarPage.css";

export default function CalendarPage() {
  const [modalDate, setModalDate] = useState(null); //  datum za modal
  const [events] = useState([
    { id: 1, title: "Ispit iz matematike", start: "2025-10-21T09:00:00", end: "2025-10-21T11:00:00" },
    { id: 2, title: "Prezentacija projekta", start: "2025-10-24T13:00:00", end: "2025-10-24T14:00:00" },
    { id: 3, title: "FON događaj", start: "2025-10-28", allDay: true },
  ]);

  const handleDateClick = (info) => {
    setModalDate(info.dateStr); //  otvori modal sa kliknutim datumom
  };

  const handleCloseModal = () => {
    setModalDate(null);
  };

  const handleConfirmAdd = () => {
    alert(`(Simulacija) Novi događaj biće dodat za datum ${modalDate}`);
    setModalDate(null);
  };

  return (
    <div className="calendar-page">
      <h2>Kalendar događaja</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={events}
        dateClick={handleDateClick}
      />

      {/*  Modal prozor za dodavanje događaja */}
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
