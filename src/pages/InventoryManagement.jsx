import { useEffect, useMemo, useState } from "react";
import rose from "../assets/rose.png";
import lavender from "../assets/lavender.png";
import rosemary from "../assets/rosemary.png";
import soap from "../assets/soap-bliss.png";
import AdminSidebar from "../components/AdminSidebar";

function InventoryManagement() {
  const defaultProducts = useMemo(
    () => [
      {
        id: 1,
        name: "Sakura Bliss",
        description: "A unique soap, please buy from us :)",
        price: 3,
        ingredients: "Sugar, Sakura, love, Milk, Other stuff, xxxx",
        stock: 10,
        image: rose,
      },
      {
        id: 2,
        name: "Lavender Bliss",
        description: "A relaxing lavender soap for daily use.",
        price: 3,
        ingredients: "Lavender, Milk, Oils, Soft fragrance",
        stock: 0,
        image: lavender,
      },
      {
        id: 3,
        name: "Rosemary Bliss",
        description: "Fresh herbal soap with rosemary extract.",
        price: 3,
        ingredients: "Rosemary, Olive oil, Milk, Herbs",
        stock: 5,
        image: rosemary,
      },
      {
        id: 4,
        name: "Soap Bliss",
        description: "Simple handmade soap bar.",
        price: 3,
        ingredients: "Soap base, Oils, Fragrance",
        stock: 12,
        image: soap,
      },
    ],
    []
  );

  const [products, setProducts] = useState([]);
  const [stockValues, setStockValues] = useState({});
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products"));

    const initialProducts =
      storedProducts && storedProducts.length > 0 ? storedProducts : defaultProducts;

    setProducts(initialProducts);
    localStorage.setItem("products", JSON.stringify(initialProducts));

    const stockMap = {};
    initialProducts.forEach((product) => {
      stockMap[product.id] = product.stock;
    });
    setStockValues(stockMap);
  }, [defaultProducts]);

  const handleStockChange = (productId, value) => {
    setStockValues((prev) => ({
      ...prev,
      [productId]: value === "" ? "" : Number(value),
    }));
    setSavedMessage("");
  };

  const handleUpdate = () => {
    const updatedProducts = products.map((product) => ({
      ...product,
      stock:
        stockValues[product.id] === "" || Number(stockValues[product.id]) < 0
          ? 0
          : Number(stockValues[product.id]),
    }));

    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setSavedMessage("Saved !");
  };

  return (
    <div
      className="purple-page"
      style={{
        minHeight: "100vh",
        padding: "18px 24px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="inventory-management-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: "18px",
        }}
      >
        <AdminSidebar activePage="inventory" />

        <div style={mainPanelStyle}>
          {savedMessage && (
            <p
              style={{
                margin: "0 0 16px",
                color: "#ff4d6d",
                fontSize: "13px",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              {savedMessage}
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "18px",
            }}
          >
            <button style={updateButtonStyle} onClick={handleUpdate}>
              Update
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "22px",
              alignItems: "flex-start",
            }}
          >
            {products.map((product) => (
              <div key={product.id} style={inventoryCardStyle}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "170px",
                    height: "170px",
                    objectFit: "contain",
                    marginBottom: "18px",
                  }}
                />

                <h3
                  style={{
                    margin: "0 0 56px",
                    fontSize: "18px",
                    color: "#2e3d4c",
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  {product.name}
                </h3>

                <input
                  type="number"
                  min="0"
                  value={stockValues[product.id] ?? product.stock}
                  onChange={(e) => handleStockChange(product.id, e.target.value)}
                  style={stockInputStyle}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 1100px) {
            .inventory-management-layout {
              grid-template-columns: 1fr !important;
            }
          }

          .sidebar {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .sidebar button {
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.35);
            border-radius: 18px;
            padding: 14px 12px;
            font-family: Josefin Sans, sans-serif;
            font-size: 18px;
            color: #2e3d4c;
            cursor: pointer;
          }

          .sidebar .active {
            font-weight: 700;
          }

          .logo-card {
            background: rgba(255,255,255,0.12);
            border: 1px solid rgba(255,255,255,0.35);
            border-radius: 24px;
            backdrop-filter: blur(14px);
            padding: 16px;
            text-align: center;
          }

          .logo-card img {
            width: 100%;
            max-width: 120px;
            object-fit: contain;
            display: block;
            margin: 0 auto;
          }

          .spacer {
            flex: 1;
          }
        `}
      </style>
    </div>
  );
}

const mainPanelStyle = {
  background: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.35)",
  borderRadius: "28px",
  backdropFilter: "blur(14px)",
  padding: "22px",
  minHeight: "560px",
  boxSizing: "border-box",
};

const inventoryCardStyle = {
  width: "200px",
  background: "rgba(255,255,255,0.22)",
  border: "1px solid rgba(255,255,255,0.35)",
  borderRadius: "18px",
  padding: "18px 16px 40px",
  textAlign: "center",
};

const stockInputStyle = {
  width: "56px",
  padding: "4px 6px",
  borderRadius: "8px",
  border: "1px solid #8f8f8f",
  outline: "none",
  fontSize: "22px",
  fontFamily: "Josefin Sans, sans-serif",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.95)",
  textAlign: "center",
  color: "#2e3d4c",
};

const updateButtonStyle = {
  background: "#8f42d9",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "10px 16px",
  fontFamily: "Josefin Sans, sans-serif",
  fontWeight: "600",
  cursor: "pointer",
  width: "110px",
};

export default InventoryManagement;