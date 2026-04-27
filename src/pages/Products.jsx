// Products page - shows all products with filters
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Button from "../components/Button";

function Products() {
  // List of all products
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        const customSoap = {
          _id: "custom-soap",
          name: "Custom Soap",
          price: null,
          image: null,
          scent: "Custom",
          skinType: "Sensitive",
          stock: 1,
          customizable: true
        };

        setAllProducts([...data, customSoap]);
        setFilteredProducts([...data, customSoap]);
      })
      .catch(err => console.log(err));
  }, []);

  // Filter states
  const [selectedScents, setSelectedScents] = useState([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100);

  // Simulated login state (change for testing)
  const isLoggedIn = true;

  // Handle checkbox selection (add/remove)
  const handleCheckboxChange = (value, selectedValues, setSelectedValues) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  // Apply filters to products
  const applyFilters = () => {
    // Check if price range is valid
    if (minPrice !== "" && maxPrice !== "" && Number(minPrice) > Number(maxPrice)) {
      alert("Invalid price range");
      return;
    }

    // Filter products based on selected options
    const result = allProducts.filter((product) => {
      const matchesPrice =
        product.price == null ||
        (product.price >= Number(minPrice) && product.price <= Number(maxPrice));

      const matchesScent =
        selectedScents.length === 0 || selectedScents.includes(product.scent);

      const matchesSkinType =
        selectedSkinTypes.length === 0 ||
        selectedSkinTypes.includes(product.skinType);

      return matchesPrice && matchesScent && matchesSkinType;
    });

    // Update displayed products
    setFilteredProducts(result);
  };

  // Handle wishlist button click
  const handleWishlistClick = () => {
    if (!isLoggedIn) {
      alert("Please login first");
    } else {
      alert("Added to your wishlist");
    }
  };

  return (
    <div className="purple-page">
      <div
        style={{
          position: "relative",
          zIndex: 2,
          paddingTop: "90px",
          width: "90%",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <Navbar />

        <div
          style={{
            display: "flex",
            gap: "18px",
            alignItems: "stretch",
            flexWrap: "nowrap",
            marginTop: "30px",
          }}
        >
          {/* Filter Sidebar */}
          <div
            style={{
              width: "240px",
              minHeight: "500px",
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "28px",
              padding: "16px 14px",
              backdropFilter: "blur(14px)",
              boxSizing: "border-box",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "18px",
                fontSize: "34px",
                fontWeight: "500",
                color: "#2f2f2f",
              }}
            >
              Filter
            </h2>

            <div style={{ marginBottom: "18px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  color: "#444",
                  fontSize: "16px",
                }}
              >
                <span>${minPrice || 0}</span>
                <span>${maxPrice || 100}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  style={{
                    width: "50%",
                    padding: "8px",
                    borderRadius: "10px",
                    border: "1px solid #d6d6d6",
                    outline: "none",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />

                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="100"
                  style={{
                    width: "50%",
                    padding: "8px",
                    borderRadius: "10px",
                    border: "1px solid #d6d6d6",
                    outline: "none",
                    fontSize: "14px",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {Number(minPrice) > Number(maxPrice) && (
                <p
                  style={{
                    color: "#e74c3c",
                    fontSize: "12px",
                    marginTop: "4px",
                    marginBottom: "8px",
                  }}
                >
                  Invalid price range
                </p>
              )}

              <Button
                text="Apply Filters"
                variant="purple"
                style={{ width: "100%", margin: 0 }}
                onClick={applyFilters}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "500",
                  marginBottom: "10px",
                  color: "#2f2f2f",
                }}
              >
                Scent
              </h3>

              {["Lavender", "Sakura", "Coconut", "Unscented", "Rose", "Honey"].map(
                (scent) => (
                  <label
                    key={scent}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "10px",
                      fontSize: "16px",
                      color: "#3f3f3f",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedScents.includes(scent)}
                      onChange={() =>
                        handleCheckboxChange(
                          scent,
                          selectedScents,
                          setSelectedScents
                        )
                      }
                    />
                    {scent}
                  </label>
                )
              )}
            </div>

            <div>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "500",
                  marginBottom: "10px",
                  color: "#2f2f2f",
                }}
              >
                Skin Type
              </h3>

              {["Normal", "Dry", "Oily", "Sensitive"].map((type) => (
                <label
                  key={type}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "10px",
                    fontSize: "16px",
                    color: "#3f3f3f",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedSkinTypes.includes(type)}
                    onChange={() =>
                      handleCheckboxChange(
                        type,
                        selectedSkinTypes,
                        setSelectedSkinTypes
                      )
                    }
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Products Area */}
          <div
            style={{
              flex: 1,
              minWidth: "300px",
              minHeight: "500px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "28px",
              padding: "18px",
              backdropFilter: "blur(14px)",
              boxSizing: "border-box",
            }}
          >
            <h1
              style={{
                fontSize: "34px",
                fontWeight: "500",
                color: "#2f2f2f",
                marginTop: 0,
                marginBottom: "20px",
              }}
            >
              Products
            </h1>

            {filteredProducts.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 220px))",
                  justifyContent: "center",
                  gap: "20px",
                  paddingRight: "4px",
                }}
              >
                {/* Render each product card */}
                {filteredProducts.map((product) => (
                  <Card
                    key={product._id}
                    product={product}
                    onWishlistClick={handleWishlistClick}
                  />
                ))}
              </div>
            ) : (
              <p
                style={{
                  color: "#ff4d3d",
                  fontSize: "24px",
                  textAlign: "center",
                  marginTop: "140px",
                  fontWeight: "500",
                }}
              >
                No products match your filters
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;