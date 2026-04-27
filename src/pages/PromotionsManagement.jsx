import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/promotionsManagement.css";

function PromotionsManagement() {
  const [form, setForm] = useState({
    code: "",
    expiry: "",
    type: "",
    value: "",
  });

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSaved(false);
    setError("");
  };

  const handleCreate = () => {
    setSaved(false);
    setError("");

    const code = form.code.trim().toLowerCase();
    const expiry = form.expiry;
    const type = form.type;
    const value = form.value.trim();

    if (!code || !expiry || !type || !value) {
      setError("Please fill in all fields.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiryDate = new Date(expiry);
    if (Number.isNaN(expiryDate.getTime())) {
      setError("Please enter a valid expiry date.");
      return;
    }

    expiryDate.setHours(0, 0, 0, 0);

    if (expiryDate < today) {
      setError("Expiry date must be today or later.");
      return;
    }

    const percent = parseFloat(value.replace("%", ""));
    if (Number.isNaN(percent) || percent <= 0) {
      setError("Discount value must be a valid positive percentage, like 10%.");
      return;
    }

    const existingPromos =
      JSON.parse(localStorage.getItem("promoCodes")) || [];

    const exists = existingPromos.some(
      (promo) => String(promo.code).trim().toLowerCase() === code
    );

    if (exists) {
      setError("Promo code already exists.");
      return;
    }

    const newPromo = {
      code,
      expiry,
      type,
      value: value.includes("%") ? value : `${value}%`,
    };

    localStorage.setItem(
      "promoCodes",
      JSON.stringify([...existingPromos, newPromo])
    );

    setSaved(true);
    setForm({
      code: "",
      expiry: "",
      type: "",
      value: "",
    });
  };

  return (
    <div className="purple-page promo-page">
      <div className="promo-layout">
        <AdminSidebar activePage="promotions" />

        <div className="promo-main">
          <div className="promo-panel">
            <h2>Create Promo Code</h2>

            <div className="promo-form-grid">
              <div className="promo-field">
                <label>Promo Code</label>
                <input
                  type="text"
                  name="code"
                  placeholder="Enter promo code"
                  value={form.code}
                  onChange={handleChange}
                />
              </div>

              <div className="promo-field">
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiry"
                  value={form.expiry}
                  onChange={handleChange}
                />
              </div>

              <div className="promo-field">
                <label>Discount Type</label>
                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="All Products">All Products</option>
                  <option value="Specific Product">Specific Product</option>
                  <option value="Category">Category</option>
                  <option value="Minimum Order">Minimum Order</option>
                </select>
              </div>

              <div className="promo-field">
                <label>Discount Value</label>
                <input
                  type="text"
                  name="value"
                  placeholder="e.g. 25%"
                  value={form.value}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="promo-actions">
              <button className="promo-create-btn" onClick={handleCreate}>
                Create
              </button>

              {saved && (
                <span className="promo-saved-text">
                  Promo code created successfully!
                </span>
              )}

              {error && (
                <span
                  className="promo-saved-text"
                  style={{ color: "#ff4d6d" }}
                >
                  {error}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromotionsManagement;