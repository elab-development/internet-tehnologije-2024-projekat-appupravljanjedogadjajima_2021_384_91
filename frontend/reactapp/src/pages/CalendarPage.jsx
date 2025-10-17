import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./CalendarPage.css";

export default function CalendarPage() {
  // statički događaji za prikaz
  const events = [
    { id: 1, title: "Ispit iz matematike", start: "2025-10-21T09:00:00", end: "2025-10-21T11:00:00" },
    { id: 2, title: "Prezentacija projekta", start: "2025-10-24T13:00:00", end: "2025-10-24T14:00:00" },
    { id: 3, title: "FON događaj", start: "2025-10-28", allDay: true },
  ];

  const handleDateClick = (info) => {
    alert(`Kliknut datum: ${info.dateStr}`);
  };

  const handleEventClick = (info) => {
    alert(`Događaj: ${info.event.title}`);
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
        eventClick={handleEventClick}
      />
    </div>
  );
}
