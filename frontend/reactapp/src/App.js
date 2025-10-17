import NavBar from "./components/NavBar";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div>
        <NavBar />
        <div style={{ padding: "24px" }}>
          <h1>Dobrodošao na Eventify platformu</h1>
          <p>Ovde će kasnije biti prikaz kalendara i događaja.</p>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
