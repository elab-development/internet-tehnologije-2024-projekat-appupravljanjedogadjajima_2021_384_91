import NavBar from "./components/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CalendarPage from "./pages/CalendarPage";
import AdminPage from "./pages/AdminPage";
import EventsPage from "./pages/EventsPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <div style={{ padding: "24px" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/events" element={<EventsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
