import './App.css';
import NavBar from './components/NavBar';
import Products from "./components/Products"


function App() {
  const prom = <h3>Cao svima!</h3>

  return <div className="App">
    <NavBar></NavBar> 
    {prom}
    <Products/> 
    </div>
}

export default App;
