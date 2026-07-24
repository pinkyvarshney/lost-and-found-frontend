import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export function MyItems() {
  const navigate = useNavigate();

  const items = [
    { id: 1, title: "Wallet", status: "Available" },
  ];

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h2>My Items</h2>

        {items.map((item) => (
          <div key={item.id} className="border p-2 mb-2">
            <h3>{item.title}</h3>
            <p>{item.status}</p>
            <button
              className="bg-blue-500 text-white p-1"
              onClick={() => navigate(`/items/${item.id}/requests`)}
            >
              View Requests
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default MyItems;