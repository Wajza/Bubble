// Navigation bar component
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/bubble-logo.png";
import cart from "../assets/cart.png";
import profile from "../assets/profile-picture.png";

function Navbar() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [
    { name: "Home", path: "/home" },
    { name: "Products", path: "/products" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "8px 14px" : "10px 22px",
          margin: isMobile ? "10px auto" : "16px auto",
          maxWidth: isMobile ? "95%" : "1000px",
          width: isMobile ? "95%" : "90%",
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(255, 255, 255, 0.12)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: isMobile ? "22px" : "30px",
          backdropFilter: "blur(12px)",
          zIndex: 100,
        }}
      >
        <img
          src={logo}
          alt="Bubble Logo"
          style={{
            width: isMobile ? "70px" : "95px",
          }}
        />

        {!isMobile && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "30px",
            }}
          >
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                style={({ isActive }) => ({
                  cursor: "pointer",
                  color: isActive ? "#fff" : "#333",
                  fontWeight: isActive ? 700 : 400,
                  textDecoration: isActive ? "underline" : "none",
                  transition: "all 0.3s ease",
                })}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {isMobile && (
            <div
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                fontSize: "22px",
                cursor: "pointer",
                color: "#333",
              }}
            >
              ☰
            </div>
          )}

          <img
            src={cart}
            alt="Cart"
            onClick={() => navigate("/cart")}
            style={{
              width: isMobile ? "20px" : "24px",
              objectFit: "contain",
              cursor: "pointer",
            }}
          />

          <img
            src={profile}
            alt="Profile"
            onClick={() => navigate("/profile")}
            style={{
              width: isMobile ? "26px" : "34px",
              height: isMobile ? "26px" : "34px",
              borderRadius: "50%",
              objectFit: "cover",
              cursor: "pointer",
            }}
          />

          <button
            onClick={handleLogout}
            style={{
              padding: isMobile ? "8px 18px" : "10px 24px",
              borderRadius: "30px",
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              color: "#3b3b3b",
              fontSize: isMobile ? "14px" : "16px",
              fontFamily: "Josefin Sans, sans-serif",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,255,255,0.16)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255,255,255,0.08)";
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {isMobile && menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "70px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            borderRadius: "20px",
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            textAlign: "center",
            zIndex: 99,
          }}
        >
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                cursor: "pointer",
                color: isActive ? "#fff" : "#2e3d4c",
                fontWeight: isActive ? 700 : 400,
                textDecoration: "none",
                transition: "all 0.3s ease",
              })}
            >
              {link.name}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              borderRadius: "30px",
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              color: "#3b3b3b",
              fontSize: "15px",
              fontFamily: "Josefin Sans, sans-serif",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}

export default Navbar;