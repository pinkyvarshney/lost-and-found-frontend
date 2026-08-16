import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const BASE_URL = "http://localhost:8080";

function Home() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [searched, setSearched] = useState(false);

  const navigate = useNavigate();

  // Check login
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  // 🔍 Search
  const handleSearch = async () => {
    if (search.trim() === "") {
      alert("Please enter item name");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);

      const res = await axios.get(
        `${BASE_URL}/items/search?itemName=${encodeURIComponent(search.trim())}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("SEARCH RESPONSE:", res.data);

      setItems(res.data);
      setSearched(true);
    } catch (error) {
      console.log("SEARCH STATUS:", error.response?.status);
      console.log("SEARCH ERROR:", error.response?.data);

      setItems([]);
      setSearched(true);
    }
  };

  // Enter key se search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Post Lost Item
  const handleLostPost = () => {
    navigate("/add-item", {
      state: { type: "lost" },
    });
  };

  // Post Found Item
  const handleFoundPost = () => {
    navigate("/add-item", {
      state: { type: "found" },
    });
  };

  return (
    <div className="home-container">

      {/* ================= NAVBAR ================= */}
      <div className="top-navbar">

        <h2>🔍 Lost & Found</h2>

        {!window.location.pathname.includes("/login") && (
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}

      </div>


      {/* ================= MAIN CONTENT ================= */}
      <div className="home-content">

        {/* ================= SEARCH ================= */}
        <div className="search-section">

          <div className="search-box">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search for misplaced item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <button
              className="search-button"
              onClick={handleSearch}
            >
              Search
            </button>

          </div>

        </div>


        {/* ================= LOST / FOUND CARDS ================= */}
        <div className="post-section">

          {/* LOST CARD */}
          <div className="post-card lost-card">

            <div className="post-icon">
              😟
            </div>

            <div className="post-content">

              <h2>Lost an Item?</h2>

              <p>
                You can post a lost item here
                for easy recovery.
              </p>

            </div>

            <button
              className="post-btn lost-btn"
              onClick={handleLostPost}
            >
              Post It
            </button>

          </div>


          {/* FOUND CARD */}
          <div className="post-card found-card">

            <div className="post-icon">
              🤝
            </div>

            <div className="post-content">

              <h2>Found an Item?</h2>

              <p>
                Post a found item here for
                easy search by the owner.
              </p>

            </div>

            <button
              className="post-btn found-btn"
              onClick={handleFoundPost}
            >
              Post It
            </button>

          </div>

        </div>


        {/* ================= SEARCH RESULTS ================= */}
        <div className="results-section">

          {searched && (
            <div className="results-heading">

              <h2>
                Search Results
              </h2>

              <span>
                {items.length} item(s) found
              </span>

            </div>
          )}


          {/* No result */}
          {searched && items.length === 0 && (
            <div className="no-result">
              <div>🔎</div>

              <h3>
                No items found
              </h3>

              <p>
                Try searching with another item name.
              </p>
            </div>
          )}


          {/* Results */}
          <div className="items-grid">

            {items.map((item) => (
  <div
    key={item.itemId || item.id}
    style={{
      background: "white",
      margin: "15px auto",
      padding: "20px",
      borderRadius: "15px",
      maxWidth: "350px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
      cursor: "pointer",
      transition: "0.3s",
    }}
    onClick={() =>
      navigate(`/items/${item.itemId || item.id}`)
    }
  >
    {/* Item Icon */}
    <div
      style={{
        height: "120px",
        background: "#f1f1f1",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "55px",
      }}
    >
      📦
    </div>

    {/* Item Information */}
    <h2 style={{ marginBottom: "5px" }}>
      {item.itemName}
    </h2>

    <p style={{ color: "#666" }}>
      {item.description || "No description available"}
    </p>

    <p>
      👤 <b>User:</b> {item.userId}
    </p>

    <p>
      📌 <b>Type:</b> {item.title}
    </p>

    {/* Middle Button */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/items/${item.itemId || item.id}`);
      }}
      style={{
        display: "block",
        margin: "15px auto 0",
        padding: "10px 25px",
        border: "none",
        borderRadius: "20px",
        background: "linear-gradient(135deg, #5f2c82, #49a09d)",
        color: "white",
        fontSize: "15px",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      View Details 👁️
    </button>
  </div>
))}

          </div>

        </div>

      </div>


      {/* ================= BOTTOM NAVIGATION ================= */}
      <div className="bottom-nav">

        <div
          className="nav-item active"
          onClick={() => navigate("/home")}
        >
          <span>🏠</span>
          <p>Home</p>
        </div>


        <div
          className="nav-item"
          onClick={() => navigate("/my-items")}
        >
          <span>📦</span>
          <p>My Items</p>
        </div>


        <div
          className="nav-item"
          onClick={() => navigate("/add-item")}
        >
          <span>➕</span>
          <p>Add Item</p>
        </div>

      </div>

    </div>
  );
}

export default Home;