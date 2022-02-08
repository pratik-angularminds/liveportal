import "./App.css";
import Api from "./Components/Api";
import Addq from "./Components/Addq";
import Edit from "./Components/Edit";
import Login from "./Components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/api" element={<Api />} />
          <Route path="/api/Addq" element={<Addq />} />
          <Route path="/api/Edit" element={<Edit />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
