import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import rose from "../assets/rose.png";
import lavender from "../assets/lavender.png";
import rosemary from "../assets/rosemary.png";
import soap from "../assets/soap-bliss.png";
import bubble8 from "../assets/bubble8.png";

function Checkout() {
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;

  const allProducts = [
    {
      id: 1,
      name: "Sakura Bliss",
      price: 30,
      image: rose,
      stock: 10,
      inStock: true,
    },
    {
      id: 2,
      name: "Lavender Bliss",
      price: 30,
      image: lavender,
      stock: 0,
      inStock: false,
    },
    {
      id: 3,
      name: "Rosemary Bliss",
      price: 50,
      image: rosemary,
      stock: 10,
      inStock: true,
    },
    {
      id: 4,
      name: "Soap Bliss",
      price: 7,
      image: soap,
      stock: 10,
      inStock: true,
    },
  ];

  const [cartItems, setCartItems] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountMessage, setDiscountMessage] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
  });

  const [formError, setFormError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [orderMessage, setOrderMessage] = useState("");
  const [orderError, setOrderError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];

    const savedProfile =
      JSON.parse(localStorage.getItem("checkoutProfile")) ||
      JSON.parse(localStorage.getItem("profileData")) || {
        fullName: "",
        email: "",
        phone: "",
        location: "",
      };

    setCartItems(storedCart);
    setForm(savedProfile);
  }, []);

  const cartWithDetails = cartItems
    .map((item) => {
      const product = allProducts.find((p) => p.id === item.id);
      if (!product) return null;

      return {
        ...item,
        name: product.name,
        price: product.price,
        image: product.image,
      };
    })
    .filter(Boolean);

  const subtotal = cartWithDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = Math.max(subtotal - discountAmount, 0);

  const handleDiscountApply = () => {
    setDiscountMessage("");
    setDiscountError("");

    const code = discountCode.trim().toLowerCase();

    if (!code) {
      setDiscountError("Invalid discount code");
      setDiscountAmount(0);
      return;
    }

    const storedPromos =
      JSON.parse(localStorage.getItem("promoCodes")) || [];

    const promo = storedPromos.find((p) => p.code === code);

    if (!promo) {
      setDiscountError("Invalid discount code");
      setDiscountAmount(0);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiryDate = new Date(promo.expiry);
    expiryDate.setHours(0, 0, 0, 0);

    if (expiryDate < today) {
      setDiscountError("Promo code expired");
      setDiscountAmount(0);
      return;
    }

    const percent = parseFloat(String(promo.value).replace("%", ""));

    if (isNaN(percent) || percent <= 0) {
      setDiscountError("Invalid discount value");
      setDiscountAmount(0);
      return;
    }

    const amount = subtotal * (percent / 100);

    setDiscountAmount(amount);
    setDiscountMessage("Discount applied successfully");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaveMessage("");
    setFormError("");
    setOrderError("");

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (value && !emailRegex.test(value)) {
        setEmailError("Invalid email address");
      } else {
        setEmailError("");
      }
    }

    if (name === "phone") {
      const phoneRegex = /^\d{10}$/;

      if (value && !phoneRegex.test(value)) {
        setPhoneError("Invalid phone number");
      } else {
        setPhoneError("");
      }
    }
  };

  const getLocation = () => {
    setSaveMessage("");
    setFormError("");

    if (!navigator.geolocation) {
      setFormError("Location is not supported on this device");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const locationValue = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

        setForm((prev) => ({
          ...prev,
          location: locationValue,
        }));

        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
        setFormError("Unable to retrieve location");
      }
    );
  };

  const handleSave = () => {
    setSaveMessage("");
    setFormError("");
    setEmailError("");
    setPhoneError("");

    if (!form.fullName || !form.email || !form.phone || !form.location) {
      setFormError("Please fill all shipping information");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setEmailError("Invalid email address");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      setPhoneError("Invalid phone number");
      return;
    }

    localStorage.setItem("checkoutProfile", JSON.stringify(form));
    localStorage.setItem("profileData", JSON.stringify(form));
    setSaveMessage("Saved!");
  };

  const generateOrderId = () => {
    return `#${Math.floor(1000 + Math.random() * 9000)}`;
  };

const handlePayConfirm = () => {
  setOrderMessage("");
  setOrderError("");
  setFormError("");
  setEmailError("");
  setPhoneError("");

  if (cartWithDetails.length === 0) {
    setOrderError("Cart is empty");
    return;
  }

  if (!form.fullName || !form.email || !form.phone || !form.location) {
    setFormError("Please fill all shipping information");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    setEmailError("Invalid email address");
    return;
  }

  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(form.phone)) {
    setPhoneError("Invalid phone number");
    return;
  }

  const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

  const newOrder = {
    id: generateOrderId(),
    date: new Date().toISOString(),
    items: cartWithDetails.map((item) => ({
      productId: item.id,
      item: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      subtotal: item.price * item.quantity,
    })),
    subtotal,
    discountAmount,
    total,
    status: "Shipped",
    customer: {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      location: form.location,
    },
  };

  localStorage.setItem(
    "orders",
    JSON.stringify([newOrder, ...existingOrders])
  );

  localStorage.setItem("checkoutProfile", JSON.stringify(form));
  localStorage.setItem("profileData", JSON.stringify(form));
  localStorage.removeItem("cartItems");

  setCartItems([]);
  setDiscountCode("");
  setDiscountAmount(0);
  setDiscountMessage("");
  setDiscountError("");
  setOrderMessage("Order placed successfully");
};

  return (
    <div
      className="purple-page"
      style={{
        minHeight: "100vh",
        padding: isMobile ? "20px 14px 30px" : "46px 40px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src={bubble8}
        alt="bubble"
        style={{
          position: "absolute",
          left: isMobile ? "-80px" : "-30px",
          top: isMobile ? "120px" : "20px",
          width: isMobile ? "220px" : "320px",
          opacity: 0.18,
          pointerEvents: "none",
        }}
      />

      <button
        onClick={() => navigate(-1)}
        style={{
          padding: isMobile ? "12px 22px" : "14px 30px",
          borderRadius: "26px",
          border: "1px solid rgba(255,255,255,0.35)",
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(12px)",
          color: "#3b3b3b",
          fontSize: isMobile ? "15px" : "16px",
          fontFamily: "Josefin Sans, sans-serif",
          cursor: "pointer",
          marginBottom: "18px",
          position: "relative",
          zIndex: 2,
        }}
      >
        ← Back
      </button>

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "18px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: isMobile ? "100%" : "235px",
            minWidth: isMobile ? "100%" : "235px",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "28px",
            padding: "18px 16px",
            backdropFilter: "blur(14px)",
            boxSizing: "border-box",
            alignSelf: isMobile ? "stretch" : "flex-start",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "10px",
              fontSize: isMobile ? "24px" : "22px",
              color: "#333",
            }}
          >
            Order Summary
          </h2>

          <p style={{ margin: "0 0 8px 0", color: "#444", fontSize: "14px" }}>
            Discount
          </p>

          <input
            type="text"
            placeholder="Discount Code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            style={inputStyle}
          />

          <Button
            text="Apply"
            variant="purple"
            style={{
              width: "100%",
              marginTop: "10px",
              marginBottom: "8px",
            }}
            onClick={handleDiscountApply}
          />

          {discountMessage && (
            <p style={{ ...successStyle, marginBottom: "4px" }}>
              {discountMessage}
            </p>
          )}

          {discountError && (
            <p style={{ ...errorStyle, marginBottom: "10px" }}>
              {discountError}
            </p>
          )}

          <div style={summaryRow}>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div style={summaryRow}>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={glassBox}>
            <h1
              style={{
                marginTop: 0,
                marginBottom: "18px",
                fontSize: isMobile ? "28px" : "30px",
                color: "#333",
              }}
            >
              Checkout
            </h1>

            <div style={tableWrapper}>
              <table style={tableStyle}>
                <thead>
                  <tr style={tableHeadRow}>
                    <th style={thStyle}>Product</th>
                    <th style={thStyle}>Price</th>
                    <th style={thStyle}>Quantity</th>
                    <th style={thStyle}>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {cartWithDetails.length > 0 ? (
                    cartWithDetails.map((item) => (
                      <tr key={item.id}>
                        <td style={tdStyle}>
                          <div style={productCell}>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={productImageStyle}
                            />
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td style={tdStyle}>${item.price.toFixed(2)}</td>
                        <td style={tdStyle}>{item.quantity}</td>
                        <td style={tdStyle}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={tdStyle}>
                        Your cart is empty
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={glassBox}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: isMobile ? "flex-start" : "center",
                flexDirection: isMobile ? "column" : "row",
                gap: "10px",
                marginBottom: "12px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: isMobile ? "28px" : "30px",
                  color: "#333",
                }}
              >
                Profile Information
              </h2>

              {formError && <p style={{ ...errorStyle, margin: 0 }}>{formError}</p>}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "22px 28px",
              }}
            >
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Username"
                  value={form.fullName}
                  onChange={handleChange}
                  style={inputStyleWide}
                />
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="username123@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyleWide}
                />
                {emailError && (
                  <p style={{ ...errorStyle, marginTop: "6px" }}>{emailError}</p>
                )}
              </div>

              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="1231231231"
                  value={form.phone}
                  onChange={handleChange}
                  style={inputStyleWide}
                />
                {phoneError && (
                  <p style={{ ...errorStyle, marginTop: "6px" }}>{phoneError}</p>
                )}
              </div>

              <div>
                <label style={labelStyle}>Location</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    name="location"
                    placeholder="Tap location icon"
                    value={form.location}
                    onChange={handleChange}
                    style={{ ...inputStyleWide, paddingRight: "42px" }}
                  />
                  <span
                    onClick={getLocation}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#555",
                      fontSize: "18px",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    title="Use current location"
                  >
                    📍
                  </span>
                </div>
                {locationLoading && (
                  <p style={{ ...successStyle, marginTop: "6px" }}>
                    Getting location...
                  </p>
                )}
              </div>
            </div>

            <div
              style={{
                marginTop: "22px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <Button
                text="Save"
                variant="purple"
                style={{ width: "120px" }}
                onClick={handleSave}
              />
              {saveMessage && (
                <p style={{ ...successStyle, margin: 0 }}>{saveMessage}</p>
              )}
            </div>

            <div
              style={{
                marginTop: "28px",
                display: "flex",
                alignItems: "center",
                gap: "18px",
                flexWrap: "wrap",
              }}
            >
              <Button
                text="Pay & Confirm"
                variant="purple"
                style={{ width: "170px" }}
                onClick={handlePayConfirm}
              />
              {orderMessage && (
                <p style={{ ...successStyle, margin: 0 }}>{orderMessage}</p>
              )}
              {orderError && <p style={{ ...errorStyle, margin: 0 }}>{orderError}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const glassBox = {
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: "28px",
  padding: "18px",
  backdropFilter: "blur(14px)",
  boxSizing: "border-box",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #777",
  outline: "none",
  fontSize: "14px",
  fontFamily: "Josefin Sans, sans-serif",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.92)",
};

const inputStyleWide = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid #777",
  outline: "none",
  fontSize: "14px",
  fontFamily: "Josefin Sans, sans-serif",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.92)",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#444",
  fontSize: "15px",
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
  color: "#444",
  fontWeight: "500",
};

const tableWrapper = {
  overflowX: "auto",
  borderRadius: "14px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "540px",
  background: "rgba(255,255,255,0.22)",
  borderRadius: "14px",
  overflow: "hidden",
};

const tableHeadRow = {
  background: "rgba(255,255,255,0.45)",
};

const thStyle = {
  padding: "14px 12px",
  textAlign: "center",
  fontWeight: "600",
  color: "#333",
  fontSize: "15px",
};

const tdStyle = {
  padding: "14px 12px",
  textAlign: "center",
  color: "#444",
  borderTop: "1px solid rgba(0,0,0,0.06)",
  fontSize: "14px",
  verticalAlign: "middle",
};

const productCell = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const productImageStyle = {
  width: "56px",
  height: "56px",
  objectFit: "contain",
};

const successStyle = {
  color: "#39a86f",
  fontSize: "14px",
  fontWeight: "500",
};

const errorStyle = {
  color: "#ff3d2e",
  fontSize: "13px",
  fontWeight: "500",
};

export default Checkout;