import Navbar from "../components/Navbar";
import Button from "../components/Button";
import rose from "../assets/rose.png";
import bubble7 from "../assets/bubble7.png";
import bubble8 from "../assets/bubble8.png";
import heart from "../assets/heart.png";
import heartFilled from "../assets/heart-filled.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const isLoggedIn = !!currentUser;

  const product = {
    id: 1,
    name: "Sakura Bliss",
  };

  const [liked, setLiked] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      setLiked(false);
      return;
    }

    const storedWishlist =
      JSON.parse(localStorage.getItem("wishlistItems")) || [];

    const isLiked = storedWishlist.some((item) => item.id === product.id);
    setLiked(isLiked);
  }, [isLoggedIn, product.id]);

  const handleWishlist = () => {
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    let storedWishlist =
      JSON.parse(localStorage.getItem("wishlistItems")) || [];

    const exists = storedWishlist.find((item) => item.id === product.id);

    if (exists) {
      storedWishlist = storedWishlist.filter((item) => item.id !== product.id);
      setLiked(false);
    } else {
      storedWishlist.push({
        id: product.id,
        quantity: 1,
      });
      setLiked(true);
    }

    localStorage.setItem("wishlistItems", JSON.stringify(storedWishlist));
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    let storedCart =
      JSON.parse(localStorage.getItem("cartItems")) || [];

    const existingItem = storedCart.find(
      (item) => item.id === product.id
    );

    if (existingItem) {
      storedCart = storedCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      storedCart.push({
        id: product.id,
        quantity: 1,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(storedCart));

    setCartMessage("Added to cart");

    setTimeout(() => {
      setCartMessage("");
    }, 2000);
  };

  const handleMoreDetails = () => {
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    navigate("/product-details/1");
  };

  return (
    <div
      className="pink-page"
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Navbar />

      <img
        src={bubble7}
        alt="bubble left"
        style={{
          position: "absolute",
          left: "5px",
          bottom: "20px",
          width: "500px",
          opacity: 0.9,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <img
        src={bubble8}
        alt="bubble right"
        style={{
          position: "absolute",
          right: "2px",
          top: "20px",
          width: "500px",
          opacity: 0.9,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          paddingTop: "40px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <img
          src={rose}
          alt="Bubble Soap"
          style={{
            width: "560px",
            maxWidth: "100%",
            filter: "drop-shadow(0px 20px 40px rgba(0,0,0,0.18))",
            marginBottom: "10px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "-50px",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              text="Add to Cart"
              variant="primary"
              onClick={handleAddToCart}
            />

            {cartMessage && (
              <span
                style={{
                  position: "absolute",
                  top: "110%",
                  color: "#226944",
                  fontSize: "14px",
                  fontWeight: "500",
                  whiteSpace: "nowrap",
                }}
              >
                {cartMessage}
              </span>
            )}
          </div>

          <Button
            text="More Details"
            variant="secondary"
            onClick={handleMoreDetails}
          />

          <img
            src={liked ? heartFilled : heart}
            alt="wishlist"
            onClick={handleWishlist}
            style={{
              width: "22px",
              height: "22px",
              cursor: "pointer",
              transition: "0.3s",
              transform: liked ? "scale(1.2)" : "scale(1)",
              opacity: liked ? 1 : 0.7,
              marginTop: "12px",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;