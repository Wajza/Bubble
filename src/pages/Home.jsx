import Navbar from "../components/Navbar";
import Button from "../components/Button";
import bubble7 from "../assets/bubble7.png";
import bubble8 from "../assets/bubble8.png";
import heart from "../assets/heart.png";
import heartFilled from "../assets/heart-filled.png";
import logo from "../assets/bubble-logo.png";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId } from "../utils/auth";

const slideAnimation = `
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(30px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0px)  scale(1);    }
  }
`;

function Home() {
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const isLoggedIn = !!userId;

  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [liked, setLiked] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const intervalRef = useRef(null);

  const product = products[currentIndex] || null;

  // Get theme-based colors
  const getThemeColors = (theme) => {
    switch(theme) {
      case 'purple':
        return {
          background: "linear-gradient(135deg, #cbb7e6, #a88bd8)",
          buttonColor: "#8f4bd8",
          buttonHover: "#7a3fc2",
          secondaryButtonColor: "#b99af1",
          textColor: "#2e3d4c",
          accentColor: "#b99af1",
          dotActiveColor: "#7a3fc2",
          dotInactiveColor: "rgba(120, 70, 200, 0.3)",
          bubbleOpacity: 0.12,
          pageClass: "purple-page",
          navBackground: "rgba(168, 139, 216, 0.3)",
          iconColor: "#2e3d4c",
          iconHoverColor: "#7a3fc2"
        };
      case 'yellow':
        return {
          background: "linear-gradient(135deg, #f5e6a3, #e8d47a)",
          buttonColor: "#d4a843",
          buttonHover: "#c29738",
          secondaryButtonColor: "#f0dc82",
          textColor: "#5c4a1e",
          accentColor: "#f0dc82",
          dotActiveColor: "#c29738",
          dotInactiveColor: "rgba(200, 150, 50, 0.3)",
          bubbleOpacity: 0.15,
          pageClass: "yellow-page",
          navBackground: "rgba(232, 212, 122, 0.3)",
          iconColor: "#5c4a1e",
          iconHoverColor: "#c29738"
        };
      case 'green':
        return {
          background: "linear-gradient(135deg, #a8e6cf, #7ecba1)",
          buttonColor: "#3d8f5e",
          buttonHover: "#2d6b46",
          secondaryButtonColor: "#9ed6b0",
          textColor: "#1a4d2e",
          accentColor: "#9ed6b0",
          dotActiveColor: "#2d6b46",
          dotInactiveColor: "rgba(50, 140, 80, 0.3)",
          bubbleOpacity: 0.12,
          pageClass: "green-page",
          navBackground: "rgba(126, 203, 161, 0.3)",
          iconColor: "#1a4d2e",
          iconHoverColor: "#2d6b46"
        };
      case 'blue':
        return {
          background: "linear-gradient(135deg, #a8d8ea, #7cb8d4)",
          buttonColor: "#3a7ca5",
          buttonHover: "#2d6182",
          secondaryButtonColor: "#9cc9e0",
          textColor: "#1a3a4d",
          accentColor: "#9cc9e0",
          dotActiveColor: "#2d6182",
          dotInactiveColor: "rgba(50, 100, 150, 0.3)",
          bubbleOpacity: 0.12,
          pageClass: "blue-page",
          navBackground: "rgba(124, 184, 212, 0.3)",
          iconColor: "#1a3a4d",
          iconHoverColor: "#2d6182"
        };
      default: // pink
        return {
          background: "linear-gradient(135deg, #b45f69, #d8a0aa)",
          buttonColor: "#b84a57",
          buttonHover: "#9e3f4a",
          secondaryButtonColor: "#d99aa5",
          textColor: "#5a2d36",
          accentColor: "#d99aa5",
          dotActiveColor: "#8B3A52",
          dotInactiveColor: "rgba(139,58,82,0.3)",
          bubbleOpacity: 0.18,
          pageClass: "pink-page",
          navBackground: "rgba(216, 160, 170, 0.3)",
          iconColor: "#5a2d36",
          iconHoverColor: "#9e3f4a"
        };
    }
  };

  const themeColors = getThemeColors(product?.theme);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const normal = data.filter((item) => !item.isCustomizable);
        setProducts(normal);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (products.length < 2) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
      setAnimKey((k) => k + 1);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [products]);

  useEffect(() => {
    if (!userId || !product) return;
    
    const checkWishlist = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/wishlist/${userId}`);
        const data = await response.json();
        setLiked(data.some((item) => item.productId?._id === product._id));
      } catch (error) { 
        console.error(error); 
      }
    };
    
    checkWishlist();
    window.addEventListener("wishlistUpdated", checkWishlist);
    return () => window.removeEventListener("wishlistUpdated", checkWishlist);
  }, [userId, product]);

  const handleWishlist = async () => {
    if (!isLoggedIn) { 
      navigate("/"); 
      return; 
    }
    if (!product) return;
    
    try {
      if (liked) {
        const response = await fetch(`http://localhost:5000/api/wishlist/${userId}`);
        const data = await response.json();
        const wishlistItem = data.find((item) => item.productId?._id === product._id);
        if (wishlistItem) {
          await fetch(`http://localhost:5000/api/wishlist/${wishlistItem._id}`, { 
            method: "DELETE" 
          });
        }
        setLiked(false);
      } else {
        await fetch("http://localhost:5000/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            userId: userId,
            productId: product._id, 
            quantity: 1 
          }),
        });
        setLiked(true);
      }
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) { 
      console.error(error); 
      alert("Failed to update wishlist"); 
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) { 
      navigate("/"); 
      return; 
    }
    if (!product) return;
    
    try {
      const response = await fetch("http://localhost:5000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          productId: product._id,
          quantity: 1,
        }),
      });

      if (!response.ok) throw new Error("Failed to add to cart");

      setCartMessage("Added to cart");
      setTimeout(() => setCartMessage(""), 2000);
    } catch (error) {
      console.error(error);
      alert("Failed to add product to cart");
    }
  };

  const handleMoreDetails = () => {
    if (!isLoggedIn) { 
      navigate("/"); 
      return; 
    }
    if (!product) return;
    navigate(`/product-details/${product._id}`);
  };

  const goTo = (index) => {
    clearInterval(intervalRef.current);
    setCurrentIndex(index);
    setAnimKey((k) => k + 1);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
      setAnimKey((k) => k + 1);
    }, 5000);
  };

  // Cart Icon SVG
  const CartIcon = ({ color, hoverColor }) => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="cart-icon"
      style={{ cursor: "pointer", transition: "all 0.3s ease" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.stroke = hoverColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.stroke = color;
      }}
    >
      <circle cx="9" cy="21" r="1" fill={color} stroke={color}/>
      <circle cx="20" cy="21" r="1" fill={color} stroke={color}/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );

  // Profile Icon SVG
  const ProfileIcon = ({ color, hoverColor }) => (
    <svg 
      width="28" 
      height="28" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="profile-icon"
      style={{ cursor: "pointer", transition: "all 0.3s ease" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.stroke = hoverColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.stroke = color;
      }}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );

  return (
    <div 
      className={themeColors.pageClass}
      style={{ 
        minHeight: "100vh", 
        position: "relative", 
        overflow: "hidden",
        background: themeColors.background,
        transition: "background 0.5s ease-in-out"
      }}
    >
      <style>{slideAnimation}</style>
      
      {/* Custom Navbar with theme colors */}
      <nav
        style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: "1000px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 22px",
          background: themeColors.navBackground,
          backdropFilter: "blur(12px)",
          borderRadius: "30px",
          border: "1px solid rgba(255,255,255,0.25)",
          zIndex: 100,
        }}
      >
        {/* Original Bubble Logo - Keep as is */}
        <img 
          src={logo} 
          alt="Bubble Logo" 
          style={{ width: "95px", cursor: "pointer" }}
          onClick={() => navigate("/home")}
        />
        
        <div style={{ display: "flex", gap: "30px", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          <span 
            style={{ cursor: "pointer", color: themeColors.textColor, transition: "0.3s" }}
            onClick={() => navigate("/home")}
            onMouseEnter={(e) => e.target.style.opacity = "0.7"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
          >
            Home
          </span>
          <span 
            style={{ cursor: "pointer", color: themeColors.textColor, transition: "0.3s" }}
            onClick={() => navigate("/products")}
            onMouseEnter={(e) => e.target.style.opacity = "0.7"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
          >
            Products
          </span>
          <span 
            style={{ cursor: "pointer", color: themeColors.textColor, transition: "0.3s" }}
            onClick={() => navigate("/contact")}
            onMouseEnter={(e) => e.target.style.opacity = "0.7"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
          >
            Contact Us
          </span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <CartIcon color={themeColors.iconColor} hoverColor={themeColors.iconHoverColor} />
          <ProfileIcon color={themeColors.iconColor} hoverColor={themeColors.iconHoverColor} />
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/");
            }}
            style={{
              padding: "10px 24px",
              borderRadius: "30px",
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              color: themeColors.textColor,
              fontSize: "16px",
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

      {/* Decorative bubbles with theme-based opacity */}
      <img 
        src={bubble7} 
        alt="bubble left"
        style={{ 
          position: "absolute", 
          left: "5px", 
          bottom: "20px", 
          width: "500px", 
          opacity: themeColors.bubbleOpacity, 
          zIndex: 0, 
          pointerEvents: "none",
          transition: "opacity 0.5s ease-in-out"
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
          opacity: themeColors.bubbleOpacity, 
          zIndex: 0, 
          pointerEvents: "none",
          transition: "opacity 0.5s ease-in-out"
        }} 
      />

      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center",
        paddingTop: "40px", 
        position: "relative", 
        zIndex: 2 
      }}>

        {product && (
          <>
            <img
              key={animKey}
              src={product.image}
              alt={product.name}
              style={{
                width: "560px", 
                maxWidth: "100%",
                filter: "drop-shadow(0px 20px 40px rgba(0,0,0,0.18))",
                marginBottom: "10px", 
                pointerEvents: "none",
                animation: "slideIn 0.6s cubic-bezier(0.22,1,0.36,1) both",
              }}
            />

            {/* Product Name */}
            <h2
              style={{
                color: themeColors.textColor,
                fontSize: "32px",
                marginTop: "20px",
                marginBottom: "10px",
                fontWeight: "600",
                textAlign: "center",
                textShadow: "0 2px 4px rgba(255,255,255,0.3)"
              }}
            >
              {product.name}
            </h2>

            {/* Product Price */}
            <p
              style={{
                color: themeColors.textColor,
                fontSize: "24px",
                marginBottom: "20px",
                fontWeight: "500"
              }}
            >
              ${product.price.toFixed(2)}
            </p>
          </>
        )}

        {/* Buttons */}
        <div style={{
          display: "flex", 
          alignItems: "center", 
          gap: "12px",
          flexWrap: "wrap", 
          justifyContent: "center",
          position: "absolute", 
          bottom: "80px"
        }}>
          <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Button 
              text="Add to Cart" 
              variant="primary" 
              onClick={handleAddToCart}
              style={{
                background: themeColors.buttonColor,
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = themeColors.buttonHover}
              onMouseLeave={(e) => e.currentTarget.style.background = themeColors.buttonColor}
            />
            {cartMessage && (
              <span style={{ 
                position: "absolute", 
                top: "110%", 
                color: "#226944",
                fontSize: "14px", 
                fontWeight: "500", 
                whiteSpace: "nowrap" 
              }}>
                {cartMessage}
              </span>
            )}
          </div>
          <Button 
            text="More Details" 
            variant="secondary" 
            onClick={handleMoreDetails}
            style={{
              background: themeColors.accentColor,
              color: themeColors.textColor,
              transition: "all 0.3s ease"
            }}
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
              filter: liked ? "drop-shadow(0 0 4px rgba(255,0,0,0.5))" : "none"
            }} 
          />
        </div>

        {/* Dots */}
        {products.length > 1 && (
          <div style={{
            display: "flex", 
            gap: "8px",
            position: "absolute", 
            bottom: "40px"
          }}>
            {products.map((_, i) => (
              <button 
                key={i} 
                onClick={() => goTo(i)}
                style={{
                  width: i === currentIndex ? "24px" : "8px",
                  height: "8px", 
                  borderRadius: "4px", 
                  border: "none",
                  background: i === currentIndex ? themeColors.dotActiveColor : themeColors.dotInactiveColor,
                  cursor: "pointer", 
                  padding: 0,
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;