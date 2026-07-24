import React from "react";

function Home() {
  const items = [
    { title: "Lost Phone", desc: "Black iPhone lost near library" },
    { title: "Found Wallet", desc: "Brown wallet found in canteen" },
    { title: "Lost Keys", desc: "Bike keys with red keychain" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e3c72, #2a5298)" }}>
      
      {/* Navbar */}
      <div
        style={{
          padding: "15px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          background: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2>🔍 Lost & Found</h2>
        <button
          style={{
            padding: "8px 15px",
            borderRadius: "8px",
            border: "none",
            background: "#ff758c",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "30px" }}>
        <h2 style={{ color: "white", marginBottom: "20px" }}>
          Recent Posts
        </h2>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                padding: "20px",
                borderRadius: "15px",
                background: "white",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                transition: "0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <h3>{item.title}</h3>
              <p style={{ color: "gray" }}>{item.desc}</p>

              <button
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "8px",
                  background: "linear-gradient(45deg, #ff758c, #ff7eb3)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;