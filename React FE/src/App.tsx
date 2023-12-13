import "./index.css"
import Login from "./pages/Login";
import InsertCar from "./pages/InsertCar";
import CarDashboard from "./pages/CarDashboard";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/insert-car" element={<InsertCar />} />
      <Route path="/dashboard" element={<CarDashboard />} />
    </Routes>
  );
}

export default App;
