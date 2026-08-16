import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./ItemDetails.css";

export function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [claimLoading, setClaimLoading] = useState(false);
  const [error, setError] = useState("");

  const decodeJwtPayload = (token) => {
    try {
      const base64Payload = token.split(".")[1];
      if (!base64Payload) return {};

      const normalized = base64Payload
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
      return JSON.parse(atob(padded));
    } catch (error) {
      console.error("JWT decode failed:", error);
      return {};
    }
  };

  const fetchCurrentUserId = async (token) => {
    const endpoints = [
      "http://localhost:8080/auth/me",
      "http://localhost:8080/users/me",
      "http://localhost:8080/profile",
      "http://localhost:8080/user/me",
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) continue;

        const data = await response.json();
        const userId =
          data?.userId ||
          data?.id ||
          data?.user?.id ||
          data?.user_id ||
          data?._id ||
          data?.user?.userId;

        if (userId) {
          localStorage.setItem("userId", String(userId));
          return userId;
        }
      } catch (error) {
        console.warn(`User profile endpoint failed: ${endpoint}`, error);
      }
    }

    return null;
  };

  // ================= GET ITEM DETAILS =================
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/");
          return;
        }

        const response = await fetch(
          `http://localhost:8080/items/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load item");
        }

        const data = await response.json();

        console.log("ITEM DETAILS:", data);

        setItem(data);

      } catch (error) {
        console.error("ITEM ERROR:", error);
        setError("Unable to load item details");
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, navigate]);


  // ================= SEND CLAIM =================
  const handleSubmit = async () => {

    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }

    try {
      setClaimLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        navigate("/");
        return;
      }

      // ================= JWT PAYLOAD =================

      const payload = decodeJwtPayload(token);
      console.log("JWT PAYLOAD:", payload);

      const savedUserId = localStorage.getItem("userId");
      let requesterId =
        savedUserId ||
        payload.userId ||
        payload.id ||
        payload.user_id ||
        payload.sub ||
        payload.user?.id ||
        payload.user?.userId;

      if (!requesterId) {
        requesterId = await fetchCurrentUserId(token);
      }

      if (!requesterId) {
        console.error(
          "Requester ID not found in JWT, saved user data, or current user profile:",
          payload
        );

        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        alert("User ID not found in token. Please login again.");
        navigate("/");
        return;
      }


      // ================= CLAIM API =================

      const response = await fetch(
        "http://localhost:8080/claims",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            itemId: Number(id),
            requesterId: Number(requesterId),
            message: message.trim(),
          }),
        }
      );


      // Response ko safely handle karo
      const contentType =
        response.headers.get("content-type");

      let data;

      if (
        contentType &&
        contentType.includes("application/json")
      ) {
        data = await response.json();
      } else {
        data = await response.text();
      }


      console.log("CLAIM STATUS:", response.status);
      console.log("CLAIM RESPONSE:", data);


      // ================= ERROR =================

      if (!response.ok) {

        let errorMessage = "Failed to send claim";

        if (typeof data === "string") {
          errorMessage = data;
        } else if (data?.message) {
          errorMessage = data.message;
        }

        throw new Error(errorMessage);
      }


      // ================= SUCCESS =================

      alert("✅ Claim sent successfully!");

      setShowModal(false);
      setMessage("");

    } catch (error) {

      console.error("CLAIM ERROR:", error);

      alert(
        "❌ " +
        (error.message || "Error sending claim")
      );

    } finally {

      setClaimLoading(false);

    }
  };


  // ================= LOADING =================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="details-page">
          <div className="loading-card">
            <div className="loading-icon">📦</div>

            <h2>Loading item...</h2>

            <p>
              Please wait while we fetch the item
              details.
            </p>
          </div>
        </div>
      </>
    );
  }


  // ================= ERROR =================

  if (error || !item) {
    return (
      <>
        <Navbar />

        <div className="details-page">

          <div className="error-card">

            <div className="error-icon">
              ❌
            </div>

            <h2>
              Unable to Load Item
            </h2>

            <p>
              {error || "Item not found"}
            </p>

            <button
              className="back-btn"
              onClick={() => navigate("/home")}
            >
              ← Back to Home
            </button>

          </div>

        </div>
      </>
    );
  }


  // ================= MAIN UI =================

  return (
    <>
      <Navbar />

      <div className="details-page">

        {/* ================= BACK BUTTON ================= */}

        <button
          className="back-btn"
          onClick={() => navigate("/home")}
        >
          ← Back to Items
        </button>


        {/* ================= MAIN CARD ================= */}

        <div className="details-card">


          {/* ================= ITEM IMAGE ================= */}

          <div className="item-image">
            📦
          </div>


          {/* ================= ITEM TYPE ================= */}

          <div
            className={`item-type ${
              item.title === "found"
                ? "found-type"
                : "lost-type"
            }`}
          >
            {item.title === "found"
              ? "🟢 FOUND ITEM"
              : "🔴 LOST ITEM"}
          </div>


          {/* ================= ITEM NAME ================= */}

          <h1 className="item-name">
            {item.itemName || "Unnamed Item"}
          </h1>


          {/* ================= DESCRIPTION ================= */}

          <div className="detail-row">

            <span className="detail-icon">
              📝
            </span>

            <div className="detail-info">

              <small>
                Description
              </small>

              <p>
                {item.description ||
                  "No description available"}
              </p>

            </div>

          </div>


          {/* ================= LOCATION ================= */}

          <div className="detail-row">

            <span className="detail-icon">
              📍
            </span>

            <div className="detail-info">

              <small>
                Location
              </small>

              <p>
                {item.location ||
                  "Not specified"}
              </p>

            </div>

          </div>


          {/* ================= DATE ================= */}

          <div className="detail-row">

            <span className="detail-icon">
              📅
            </span>

            <div className="detail-info">

              <small>
                Date
              </small>

              <p>
                {item.date ||
                  "Not specified"}
              </p>

            </div>

          </div>


          {/* ================= USER ================= */}

          <div className="detail-row">

            <span className="detail-icon">
              👤
            </span>

            <div className="detail-info">

              <small>
                Posted By
              </small>

              <p>
                User{" "}
                {item.userId ||
                  "Unknown"}
              </p>

            </div>

          </div>


          {/* ================= STATUS ================= */}

          <div className="status-box">

            <span>
              📌 Status
            </span>

            <strong>
              {item.title || "Unknown"}
            </strong>

          </div>


          {/* ================= CLAIM SECTION ================= */}

          {item.title === "lost" && (

            <div className="claim-section">

              <div className="claim-content">

                <div className="claim-icon-small">
                  🤝
                </div>

                <div>

                  <h2>
                    Is this your item?
                  </h2>

                  <p>
                    If you believe this item
                    belongs to you, send a
                    claim request to the
                    person who posted it.
                  </p>

                </div>

              </div>


              <button
                className="claim-btn"
                onClick={() =>
                  setShowModal(true)
                }
              >
                🤝 This is Mine
              </button>

            </div>

          )}


          {/* ================= FOUND ITEM MESSAGE ================= */}

          {item.title === "found" && (

            <div className="found-message">

              <div className="found-message-icon">
                🔎
              </div>

              <div>

                <h3>
                  Looking for this item?
                </h3>

                <p>
                  If you think this is your
                  lost item, you can contact
                  the person who found it.
                </p>

              </div>

            </div>

          )}

        </div>


        {/* ================================================= */}
        {/* ================= CLAIM MODAL =================== */}
        {/* ================================================= */}

        {showModal && (

          <div
            className="modal-overlay"
            onClick={() =>
              !claimLoading &&
              setShowModal(false)
            }
          >

            <div
              className="claim-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >


              {/* CLOSE BUTTON */}

              <button
                className="close-btn"
                onClick={() =>
                  !claimLoading &&
                  setShowModal(false)
                }
                disabled={claimLoading}
              >
                ✕
              </button>


              {/* CLAIM ICON */}

              <div className="claim-icon">
                🤝
              </div>


              {/* TITLE */}

              <h2>
                Claim This Item
              </h2>


              <p className="modal-description">

                Tell the owner why you believe
                this item belongs to you.

              </p>


              {/* ITEM PREVIEW */}

              <div className="claim-item-preview">

                <span>
                  📦
                </span>

                <div>

                  <strong>
                    {item.itemName ||
                      "Unnamed Item"}
                  </strong>

                  <small>
                    {item.location ||
                      "Location not specified"}
                  </small>

                </div>

              </div>


              {/* MESSAGE */}

              <label className="message-label">
                Your Message
              </label>

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder="Example: This is my wallet. It contains my ID card..."
                rows="5"
                disabled={claimLoading}
              />


              {/* CHARACTER COUNT */}

              <div className="character-count">
                {message.length}/500
              </div>


              {/* BUTTONS */}

              <div className="modal-buttons">

                <button
                  className="cancel-btn"
                  onClick={() =>
                    setShowModal(false)
                  }
                  disabled={claimLoading}
                >
                  Cancel
                </button>


                <button
                  className="send-claim-btn"
                  onClick={handleSubmit}
                  disabled={claimLoading}
                >

                  {claimLoading
                    ? "Sending..."
                    : "Send Claim 🚀"}

                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    </>
  );
}

export default ItemDetails;