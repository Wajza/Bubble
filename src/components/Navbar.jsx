// frontend/src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/api";
import { useTheme } from "../context/ThemeContext";
import { CartIcon, ProfileIcon, MenuIcon, CloseIcon, LogoutIcon } from "./DynamicIcons";
import logo from "../assets/bubble-logo.png";

function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const { themeData } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const handleChange = () => {
      setIsMobile(media.matches);
      if (!media.matches) setMenuOpen(false);
    };
    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const links = [
    { name: "Home", path: "/home" },
    { name: "Products", path: "/products" },
    { name: "Contact Us", path: "/contact" },
  ];

  if (currentUser?.role === "admin") {
    links.push({ name: "Admin", path: "/admin-dashboard" });
  } else if (currentUser?.role === "customer-service") {
    links.push({ name: "Support", path: "/customer-service/tickets" });
  }

  return (
    <>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "clamp(6px, 2vw, 10px) clamp(10px, 3vw, 22px)",
          margin: "clamp(6px, 2vw, 16px) auto",
          maxWidth: "1000px",
          width: "90%",
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          background: themeData.cardBg,
          border: `1px solid ${themeData.borderColor}`,
          borderRadius: "clamp(16px, 4vw, 30px)",
          backdropFilter: "blur(12px)",
          zIndex: 100,
          transition: "all 0.3s ease",
        }}
      >
        {/* Logo */}
        <img
          src={logo}
          alt="Bubble Logo"
          style={{
            width: "clamp(55px, 12vw, 95px)",
            cursor: "pointer",
          }}
          onClick={() => navigate("/home")}
        />

        {/* Desktop links */}
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
                  color: isActive ? themeData.primary : themeData.textColor,
                  fontWeight: isActive ? 700 : 400,
                  textDecoration: isActive ? "underline" : "none",
                  transition: "all 0.3s ease",
                  fontSize: "15px",
                })}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        )}

        {/* Right side icons */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "12px" : "16px" }}>
          
          {/* Mobile menu icon */}
          {isMobile && (
            <div onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
            </div>
          )}

          {/* Cart Icon */}
          <CartIcon size={22} onClick={() => navigate("/cart")} />

          {/* Profile Icon */}
          <ProfileIcon size={24} onClick={() => navigate("/profile")} />

          {/* Logout Button with Icon */}
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "clamp(5px, 1.5vw, 8px) clamp(10px, 3vw, 16px)",
              borderRadius: "30px",
              border: `1px solid ${themeData.borderColor}`,
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              color: themeData.textColor,
              fontSize: isMobile ? "12px" : "14px",
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
            <LogoutIcon size={16} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {isMobile && menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "65px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            background: themeData.cardBg,
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            textAlign: "center",
            zIndex: 99,
            border: `1px solid ${themeData.borderColor}`,
          }}
        >
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                cursor: "pointer",
                color: isActive ? themeData.primary : themeData.textColor,
                fontWeight: isActive ? 700 : 400,
                textDecoration: "none",
                fontSize: "14px",
                padding: "8px",
              })}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}

export default Navbar;