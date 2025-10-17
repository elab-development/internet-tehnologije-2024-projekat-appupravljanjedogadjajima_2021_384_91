import NavBar from "./components/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <div style={{ padding: "24px" }}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h1>Dobrodošao na Eventify platformu</h1>
                  <p>Ovde će kasnije biti prikaz kalendara i događaja.</p>
                </>
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
