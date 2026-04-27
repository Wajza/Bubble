import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bubble7 from "../assets/bubble7.png";
import bubble8 from "../assets/bubble8.png";

function SignIn() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (!form.username.trim() || !form.password.trim() || !form.confirm.trim()) {
      setError("Please fill all fields");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    const usernameExists = users.some(
      (user) => user.username.toLowerCase() === form.username.trim().toLowerCase()
    );

    if (usernameExists) {
      setError("Username already exists");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: form.username.trim(),
      username: form.username.trim(),
      password: form.password,
      role: "user",
      email: "",
    };

    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    navigate("/");
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
          Sign in
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

        <div style={{ marginBottom: "16px" }}>
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

        <div style={{ marginBottom: "10px" }}>
          <label style={labelStyle}>Confirm</label>
          <div style={{ position: "relative" }}>
            <input
              type={showConfirm ? "text" : "password"}
              name="confirm"
              placeholder="Confirm"
              value={form.confirm}
              onChange={handleChange}
              style={{ ...inputStyle, paddingRight: "40px" }}
            />
            <span
              onClick={() => setShowConfirm((prev) => !prev)}
              style={eyeStyle}
            >
              {showConfirm ? "🙈" : "👁"}
            </span>
          </div>
        </div>

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

        <button onClick={handleRegister} style={mainButtonStyle}>
          Sign in
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
          or{" "}
          <span
            onClick={() => navigate("/")}
            style={{
              cursor: "pointer",
              fontWeight: "700",
              color: "#2e3d4c",
            }}
          >
            Login
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

export default SignIn;