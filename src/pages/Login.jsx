import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import bubble7 from "../assets/bubble7.png";
import bubble8 from "../assets/bubble8.png";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useMemo(() => {
    const users = JSON.parse(localStorage.getItem("users"));

    if (!users || users.length === 0) {
      const defaultUsers = [
        {
          id: 1,
          name: "Admin",
          username: "admin",
          password: "admin123",
          role: "admin",
          email: "admin@gmail.com",
        },
        {
          id: 2,
          name: "User",
          username: "User",
          password: "User123",
          role: "user",
          email: "user@gmail.com",
        },
        {
          id: 3,
          name: "customer service",
          username: "customerservice",
          password: "customer123",
          role: "customer-service",
          email: "customerservice@gmail.com",
        },
      ];

      localStorage.setItem("users", JSON.stringify(defaultUsers));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const matchedUser = users.find(
      (user) =>
        user.username.trim().toLowerCase() === form.username.trim().toLowerCase() &&
        user.password === form.password
    );

    if (!matchedUser) {
      setError("Invalid username or password");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(matchedUser));

    if (matchedUser.role === "admin") {
      navigate("/admin-dashboard");
    } else if (matchedUser.role === "customer-service") {
      navigate("/customer-service/tickets");
    } else {
      navigate("/home");
    }
  };

  return (
    <div
      className="purple-page"
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <img
        src={bubble7}
        alt="bubble"
        style={{
          position: "absolute",
          top: "40px",
          right: "40px",
          width: "430px",
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />

      <img
        src={bubble8}
        alt="bubble"
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "100px",
          width: "360px",
          opacity: 0.2,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "80px",
          left: "70px",
          width: "110px",
          height: "110px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.18)",
          opacity: 0.5,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "170px",
          left: "40px",
          width: "55px",
          height: "55px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          opacity: 0.5,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "45px",
          left: "360px",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.18)",
          border: "2px solid rgba(140,120,180,0.18)",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(255,255,255,0.12)",
          border: "1px solid rgba(255,255,255,0.35)",
          borderRadius: "28px",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: "38px 42px 28px",
          boxSizing: "border-box",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <h1
          style={{
            margin: "0 0 18px",
            fontSize: "24px",
            color: "#2e3d4c",
            fontWeight: "700",
          }}
        >
          Login
        </h1>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              style={{ ...inputStyle, paddingRight: "40px" }}
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              style={eyeStyle}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>
        </div>

        <p
          style={{
            margin: "0 0 10px",
            fontSize: "11px",
            color: "#4b5563",
            cursor: "pointer",
            width: "fit-content",
          }}
        >
          Forgot Password?
        </p>

        {error && (
          <p
            style={{
              margin: "0 0 10px",
              color: "#ff3d5a",
              fontSize: "12px",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            {error}
          </p>
        )}

        <button onClick={handleLogin} style={mainButtonStyle}>
          Log in
        </button>

        <button
          onClick={() => navigate("/home")}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "10px",
            borderRadius: "8px",
            border: "2px solid #bb5bb9",
            background: "rgba(255,255,255,0.4)",
            color: "#bb5bb9",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Continue as Guest
        </button>

        <p
          style={{
            textAlign: "center",
            margin: "18px 0 16px",
            color: "#6b7280",
            fontSize: "12px",
          }}
        >
          or continue with
        </p>

        <button style={googleButtonStyle}>
          <span style={{ fontSize: "28px", lineHeight: 1 }}>G</span>
        </button>

        <p
          style={{
            margin: "16px 0 0",
            textAlign: "center",
            fontSize: "12px",
            color: "#4b5563",
          }}
        >
          Don&apos;t have an account yet?{" "}
          <span
            onClick={() => navigate("/signin")}
            style={{
              cursor: "pointer",
              fontWeight: "700",
              color: "#2e3d4c",
            }}
          >
            Register for free
          </span>
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontSize: "14px",
  color: "#394150",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid #8d8d8d",
  outline: "none",
  fontSize: "14px",
  fontFamily: "Josefin Sans, sans-serif",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.95)",
};

const eyeStyle = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "14px",
};

const mainButtonStyle = {
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  background: "#bb5bb9",
  color: "#fff",
  fontSize: "18px",
  fontWeight: "600",
  fontFamily: "Josefin Sans, sans-serif",
  cursor: "pointer",
};

const googleButtonStyle = {
  display: "block",
  margin: "0 auto",
  width: "92px",
  height: "34px",
  borderRadius: "8px",
  border: "1px solid rgba(0,0,0,0.12)",
  background: "white",
  cursor: "pointer",
};

export default Login;