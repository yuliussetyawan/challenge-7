import "./index.css"
import Login from "./pages/Login";
import CreateCar from "./pages/InsertCar";
import Dashboard from "./pages/CarDashboard";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/create-car" element={<CreateCar />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
