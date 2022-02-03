import './App.css';
import Api from './Components/Api';
import Addq from './Components/Addq';
import Edit from './Components/Edit';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Api />} />
          <Route path="/Addq" element={<Addq />} />
          <Route path="/Edit" element={<Edit />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
