import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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

const getUserIdFromResponse = (resData) => {
  return (
    resData?.user?.id ||
    resData?.user?.userId ||
    resData?.id ||
    resData?.userId ||
    resData?.user_id ||
    null
  );
};

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

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

      const token = res.data?.token || res.data?.accessToken;

      if (!token) {
        throw new Error("No token returned from backend");
      }

      const payload = decodeJwtPayload(token);
      const responseUserId = getUserIdFromResponse(res.data);
      const userId =
        responseUserId ||
        payload.userId ||
        payload.id ||
        payload.user_id ||
        payload.sub ||
        payload.user?.id ||
        payload.user?.userId;

      localStorage.setItem("token", token);

      if (userId) {
        localStorage.setItem("userId", String(userId));
      }

      navigate("/home", { replace: true });
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
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

        <p style={{ marginTop: "18px", color: "#555", fontSize: "14px" }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#5f2c82", fontWeight: "bold" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;