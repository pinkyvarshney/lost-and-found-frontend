import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      const token = res.data?.token || res.data?.accessToken;

      if (token) {
        localStorage.setItem("token", token);
      }

      setSuccess("Account created successfully ✅");
      setTimeout(() => navigate("/home", { replace: true }), 800);
    } catch (err) {
      console.error("REGISTER ERROR:", err.response?.data || err.message);
      setError(
        err.response?.data?.message ||
          "Unable to create account. Please try again."
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #5f2c82, #49a09d)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "380px",
          maxWidth: "100%",
          padding: "35px",
          borderRadius: "20px",
          background: "white",
          boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "10px", color: "#333" }}>Create Account</h1>
        <p style={{ color: "#777", marginBottom: "25px" }}>
          Sign up to continue
        </p>

        <input
          type="text"
          placeholder="👤 Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "13px",
            marginBottom: "15px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "15px",
          }}
        />

        <input
          type="email"
          placeholder="📧 Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "13px",
            marginBottom: "15px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "15px",
          }}
        />

        <input
          type="password"
          placeholder="🔒 Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "13px",
            marginBottom: "15px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            outline: "none",
            fontSize: "15px",
          }}
        />

        {error && (
          <div
            style={{
              background: "#ffe6e6",
              color: "#d32f2f",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#e6f7e6",
              color: "#2e7d32",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {success}
          </div>
        )}

        <button
          onClick={handleRegister}
          style={{
            width: "100%",
            padding: "13px",
            border: "none",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #5f2c82, #49a09d)",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Create Account
        </button>

        <p style={{ marginTop: "18px", color: "#555", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#5f2c82", fontWeight: "bold" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
