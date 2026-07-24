import Navbar from "../components/Navbar";

export function Requests() {
  const requests = [
    { id: 1, name: "John", message: "This is mine" },
  ];

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h2>Claim Requests</h2>

        {requests.map((req) => (
          <div key={req.id} className="border p-2 mb-2">
            <p>{req.name}</p>
            <p>{req.message}</p>

            <button className="bg-green-500 text-white p-1 mr-2">
              Accept
            </button>
            <button className="bg-red-500 text-white p-1">
              Reject
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Requests;