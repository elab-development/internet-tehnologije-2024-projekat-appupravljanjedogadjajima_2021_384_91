import NavBar from "./components/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CalendarPage from "./pages/CalendarPage";
import AdminPage from "./pages/AdminPage";
import EventsPage from "./pages/EventsPage";
import HomePage from "./pages/HomePage";
import Breadcrumbs from "./components/Breadcrumbs";
import { useEffect } from "react";
import { getEvents } from "./api";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgottenPassword";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import ProfilePage from "./pages/ProfilePage";
import ChangePassword from "./pages/ChangePassword";

function App() {
  useEffect(() => {
    getEvents();
  }, []);
  
  return (
    <BrowserRouter>
      <div style={{ color: "black", padding: "50px" }}>
        <NavBar />
        <Breadcrumbs />
        <div style={{ padding: "24px" }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/calendar" element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
             <Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminPage /></PrivateRoute>}/>
            <Route path="/events" element={<PrivateRoute><EventsPage /></PrivateRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>}/>
            <Route path="/forgot-password" element={<ForgotPassword />}/>
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/change-password" element={<ChangePassword />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
    
  );
}

export default App;
