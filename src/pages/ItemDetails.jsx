import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";

export function ItemDetails() {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h1 className="text-xl font-bold">Item {id}</h1>
        <p>Description: Lost wallet</p>
        <p>Location: Library</p>

        <button
          className="bg-blue-500 text-white p-2 mt-4"
          onClick={() => setShowModal(true)}
        >
          This is mine
        </button>

        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4">
              <h2>Claim Item</h2>
              <textarea
                className="border w-full p-2"
                placeholder="Enter message"
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="bg-green-500 text-white p-2 mt-2">
                Submit
              </button>
              <button
                className="ml-2"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ItemDetails;