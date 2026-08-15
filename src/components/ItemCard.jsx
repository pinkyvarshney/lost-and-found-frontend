import { useNavigate } from "react-router-dom";

function ItemCard({ item }) {
  const navigate = useNavigate();

  return (
    <div className="border p-4 mb-2 shadow">
      <h2 className="font-bold">{item.title}</h2>
      <p>{item.location}</p>
      <p>Status: {item.status}</p>

      <button
        className="bg-green-500 text-white px-3 py-1 mt-2"
        onClick={() => navigate(`/items/${item.id}`)}
      >
        View Details
      </button>
    </div>
  );
}

export default ItemCard;