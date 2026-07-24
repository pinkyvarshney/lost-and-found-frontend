import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ItemDetails from "./pages/ItemDetails";
import AddItem from "./pages/AddItem";
import MyItems from "./pages/MyItems";
import Requests from "./pages/Requests";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/my-items" element={<MyItems />} />
        <Route path="/items/:id/requests" element={<Requests />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;