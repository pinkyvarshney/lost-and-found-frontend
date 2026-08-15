import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ItemDetails from "./pages/ItemDetails";
import AddItem from "./pages/AddItem";
import MyItems from "./pages/MyItems";
import Requests from "./pages/Requests";
import Navbar from "./components/Navbar"; // 👈 new

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* 👈 always visible */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/my-items" element={<MyItems />} />
        <Route path="/items/:id/requests" element={<Requests />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;