import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function AddItem() {
  const location = useLocation();
  const navigate = useNavigate();

  // Home se aaya hua type
  const selectedType = location.state?.type || "found";

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [date, setDate] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login check
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Validation
    if (!itemName.trim()) {
      setError("Please enter item name.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter item description.");
      return;
    }

    if (!locationName.trim()) {
      setError("Please enter location.");
      return;
    }

    if (!date) {
      setError("Please select date.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const itemData = {
        itemName: itemName,
        description: description,
        location: locationName,
        date: date,
        title: selectedType
      };

      console.log("ITEM DATA:", itemData);

      const response = await axios.post(
        "http://10.112.160.122:8080/items",
        itemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("ADD ITEM RESPONSE:", response.data);

      setMessage("Item added successfully ✅");

      // Form clear
      setItemName("");
      setDescription("");
      setLocationName("");
      setDate("");

      // 1.5 sec baad Home
      setTimeout(() => {
        navigate("/home");
      }, 1500);

    } catch (err) {
      console.log("ADD ITEM STATUS:", err.response?.status);
      console.log("ADD ITEM ERROR:", err.response?.data);

      setError(
        err.response?.data?.message ||
        "Unable to add item. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        padding: "30px 20px 90px",
        boxSizing: "border-box"
      }}
    >

      {/* Header */}
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto 25px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white"
        }}
      >
        <h1 style={{ margin: 0 }}>
          {selectedType === "lost"
            ? "😟 Post Lost Item"
            : "🤝 Post Found Item"}
        </h1>

        <button
          onClick={() => navigate("/home")}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: "10px",
            background: "white",
            color: "#1e3c72",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          ← Back
        </button>
      </div>

      {/* Form Card */}
      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "white",
          padding: "35px",
          borderRadius: "25px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.25)"
        }}
      >

        {/* Type */}
        <div
          style={{
            padding: "15px",
            marginBottom: "25px",
            borderRadius: "12px",
            background:
              selectedType === "lost"
                ? "#fff0f0"
                : "#fffbea",
            textAlign: "center"
          }}
        >
          <h2 style={{ margin: "0 0 5px" }}>
            {selectedType === "lost"
              ? "😟 Lost Item"
              : "🤝 Found Item"}
          </h2>

          <p style={{ margin: 0, color: "#666" }}>
            Fill the information below
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Item Name */}
          <label style={labelStyle}>
            Item Name
          </label>

          <input
            type="text"
            placeholder="e.g. Mobile Phone, Bag, Wallet"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            style={inputStyle}
          />

          {/* Description */}
          <label style={labelStyle}>
            Description
          </label>

          <textarea
            placeholder="Enter item details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{
              ...inputStyle,
              resize: "vertical"
            }}
          />

          {/* Location */}
          <label style={labelStyle}>
            Location
          </label>

          <input
            type="text"
            placeholder="Where was it lost/found?"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            style={inputStyle}
          />

          {/* Date */}
          <label style={labelStyle}>
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />

          {/* Success */}
          {message && (
            <div
              style={{
                marginTop: "20px",
                padding: "13px",
                borderRadius: "10px",
                background: "#e8f8ee",
                color: "#16803c",
                textAlign: "center",
                fontWeight: "bold"
              }}
            >
              {message}
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              style={{
                marginTop: "20px",
                padding: "13px",
                borderRadius: "10px",
                background: "#ffe8e8",
                color: "#d00000",
                textAlign: "center",
                fontWeight: "bold"
              }}
            >
              ❌ {error}
            </div>
          )}

          {/* Add Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "25px",
              padding: "15px",
              border: "none",
              borderRadius: "12px",
              background:
                selectedType === "lost"
                  ? "linear-gradient(135deg, #ff6b6b, #ee5253)"
                  : "linear-gradient(135deg, #20bf6b, #0fb9b1)",
              color: "white",
              fontSize: "17px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {loading
              ? "Adding Item..."
              : selectedType === "lost"
              ? "Post Lost Item 📤"
              : "Post Found Item 📤"}
          </button>

        </form>
      </div>

      {/* Bottom Navigation */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "65px",
          background: "#111",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          color: "white",
          zIndex: 10
        }}
      >
        <div
          onClick={() => navigate("/home")}
          style={navStyle}
        >
          <span>🏠</span>
          <small>Home</small>
        </div>

        <div
          onClick={() => navigate("/my-items")}
          style={navStyle}
        >
          <span>📦</span>
          <small>My Items</small>
        </div>

        <div style={{ ...navStyle, color: "#4dabf7" }}>
          <span>➕</span>
          <small>Add Item</small>
        </div>
      </div>

    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  marginTop: "18px",
  fontWeight: "bold",
  color: "#333"
};

const inputStyle = {
  width: "100%",
  padding: "13px",
  boxSizing: "border-box",
  border: "1px solid #ddd",
  borderRadius: "10px",
  fontSize: "15px",
  outline: "none"
};

const navStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "3px",
  cursor: "pointer"
};

export default AddItem;