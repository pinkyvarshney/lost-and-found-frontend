import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/auth/login",
        {
          email: email,
          password: password,
        }
      );

      console.log("LOGIN RESPONSE:", res.data);

      // Token save
      localStorage.setItem("token", res.data.token);

      // Direct Home page
      navigate("/home");

    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);

      // Stylish error message
      setError("Incorrect email or password ❌");
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
          width: "350px",
          maxWidth: "100%",
          padding: "35px",
          borderRadius: "20px",
          background: "white",
          boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            marginBottom: "10px",
            color: "#333",
          }}
        >
          Lost & Found 🔍
        </h1>

        <p
          style={{
            color: "#777",
            marginBottom: "25px",
          }}
        >
          Login to continue
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="📧 Enter Email"
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

        {/* Password */}
        <input
          type="password"
          placeholder="🔒 Enter Password"
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

        {/* Error */}
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

        {/* Login Button */}
        <button
          onClick={handleLogin}
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
          Login →
        </button>
      </div>
    </div>
  );
}

export default Login;