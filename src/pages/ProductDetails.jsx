import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentUserId, getCurrentUser } from "../utils/auth";
import Button from "../components/Button";
import bubble7 from "../assets/bubble7.png";
import bubble8 from "../assets/bubble8.png";
import heart from "../assets/heart.png";
import heartFilled from "../assets/heart-filled.png";

// Profile Icon SVG (same as navbar)
const ProfileIcon = ({ color = "#333", hoverColor = "#8f4bd8" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const strokeColor = isHovered ? hoverColor : color;
  
  return (
    <svg 
      width="28" 
      height="28" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={strokeColor}
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
      style={{ cursor: "pointer", transition: "all 0.3s ease" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
};

function ProductDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const userId = getCurrentUserId();
    const currentUser = getCurrentUser();
    const isLoggedIn = !!userId;

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [addedToCart, setAddedToCart] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [liked, setLiked] = useState(false);

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
                    borderColor: "rgba(168, 139, 216, 0.3)",
                    cardBg: "rgba(255,255,255,0.12)",
                    labelColor: "#7a58b8",
                    valueColor: "#2e3d4c",
                    reviewBg: "rgba(255,255,255,0.08)",
                    reviewBorder: "rgba(168, 139, 216, 0.3)",
                    bubbleOpacity: 0.12,
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
                    borderColor: "rgba(232, 212, 122, 0.3)",
                    cardBg: "rgba(255,255,255,0.12)",
                    labelColor: "#b8942a",
                    valueColor: "#5c4a1e",
                    reviewBg: "rgba(255,255,255,0.08)",
                    reviewBorder: "rgba(232, 212, 122, 0.3)",
                    bubbleOpacity: 0.15,
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
                    borderColor: "rgba(126, 203, 161, 0.3)",
                    cardBg: "rgba(255,255,255,0.12)",
                    labelColor: "#2d6b46",
                    valueColor: "#1a4d2e",
                    reviewBg: "rgba(255,255,255,0.08)",
                    reviewBorder: "rgba(126, 203, 161, 0.3)",
                    bubbleOpacity: 0.12,
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
                    borderColor: "rgba(124, 184, 212, 0.3)",
                    cardBg: "rgba(255,255,255,0.12)",
                    labelColor: "#2d6182",
                    valueColor: "#1a3a4d",
                    reviewBg: "rgba(255,255,255,0.08)",
                    reviewBorder: "rgba(124, 184, 212, 0.3)",
                    bubbleOpacity: 0.12,
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
                    borderColor: "rgba(216, 160, 170, 0.3)",
                    cardBg: "rgba(255,255,255,0.12)",
                    labelColor: "#b84a57",
                    valueColor: "#5a2d36",
                    reviewBg: "rgba(255,255,255,0.08)",
                    reviewBorder: "rgba(216, 160, 170, 0.3)",
                    bubbleOpacity: 0.18,
                    iconColor: "#5a2d36",
                    iconHoverColor: "#9e3f4a"
                };
        }
    };

    const [themeColors, setThemeColors] = useState(getThemeColors('pink'));

    // Handle screen resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Product data
    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:5000/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setThemeColors(getThemeColors(data.theme));
                const storedReviews = JSON.parse(localStorage.getItem(`reviews_${id}`)) || data.reviews || [];
                setReviews(storedReviews);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        if (!userId || !id) return;
        
        const checkWishlist = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/wishlist/${userId}`);
                const data = await response.json();
                const exists = data.some((item) => item.productId?._id === id);
                setLiked(exists);
            } catch (error) {
                console.error(error);
            }
        };

        checkWishlist();
        window.addEventListener("wishlistUpdated", checkWishlist);
        return () => window.removeEventListener("wishlistUpdated", checkWishlist);
    }, [userId, id]);

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: themeColors.background }}>
                Loading product...
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: themeColors.background }}>
                Product not available
            </div>
        );
    }

    // Add product to cart
    const handleAddToCart = async () => {
        setAddedToCart(false);

        if (!isLoggedIn) {
            alert("Please login first");
            navigate("/");
            return;
        }

        if (product.stock <= 0) {
            alert("Out of stock");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    productId: product._id,
                    quantity: 1,
                }),
            });

            if (!response.ok) throw new Error("Failed to add to cart");

            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 3000);
        } catch (error) {
            console.error(error);
            alert("Failed to add to cart");
        }
    };

    // Toggle wishlist
    const handleWishlistClick = async () => {
        if (!isLoggedIn) {
            alert("Please login first");
            navigate("/");
            return;
        }

        try {
            if (liked) {
                const response = await fetch(`http://localhost:5000/api/wishlist/${userId}`);
                const data = await response.json();
                const wishlistItem = data.find(
                    (item) => item.productId?._id === product._id
                );
                if (wishlistItem) {
                    await fetch(`http://localhost:5000/api/wishlist/${wishlistItem._id}`, {
                        method: "DELETE",
                    });
                }
                setLiked(false);
            } else {
                await fetch("http://localhost:5000/api/wishlist", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: userId,
                        productId: product._id,
                        quantity: 1,
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

    // Add new review
    const handleSendReview = () => {
        if (!isLoggedIn) {
            alert("Please login first");
            return;
        }

        if (!reviewText.trim()) return;

        const newReview = {
            id: Date.now(),
            text: reviewText,
            userName: currentUser?.fullName || "User",
            userEmail: currentUser?.email || "",
            date: new Date().toLocaleDateString(),
        };

        const updatedReviews = [...reviews, newReview];
        setReviews(updatedReviews);
        
        localStorage.setItem(`reviews_${id}`, JSON.stringify(updatedReviews));
        
        setReviewText("");
        
        const successMsg = document.createElement("div");
        successMsg.textContent = "Review added!";
        successMsg.style.cssText = `position:fixed;bottom:20px;right:20px;background:${themeColors.buttonColor};color:white;padding:10px 20px;border-radius:10px;z-index:1000`;
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 2000);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                position: "relative",
                overflow: "hidden",
                background: themeColors.background,
                padding: isMobile ? "20px 16px 30px" : "30px 48px 24px",
                boxSizing: "border-box",
                transition: "background 0.5s ease-in-out",
            }}
        >
            {/* Decorative bubbles */}
            <img
                src={bubble7}
                alt="bubble left"
                style={{
                    position: "absolute",
                    left: isMobile ? "-50px" : "-10px",
                    bottom: "0",
                    width: isMobile ? "220px" : "360px",
                    opacity: themeColors.bubbleOpacity,
                    zIndex: 0,
                    pointerEvents: "none",
                    transition: "opacity 0.5s ease-in-out",
                }}
            />

            <img
                src={bubble8}
                alt="bubble right"
                style={{
                    position: "absolute",
                    right: isMobile ? "-40px" : "0",
                    top: "0",
                    width: isMobile ? "220px" : "360px",
                    opacity: themeColors.bubbleOpacity,
                    zIndex: 0,
                    pointerEvents: "none",
                    transition: "opacity 0.5s ease-in-out",
                }}
            />
            
            {/* Go back button */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    padding: isMobile ? "12px 28px" : "14px 36px",
                    borderRadius: "30px",
                    border: `1px solid ${themeColors.borderColor}`,
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                    color: themeColors.textColor,
                    fontSize: isMobile ? "16px" : "18px",
                    fontFamily: "Josefin Sans, sans-serif",
                    cursor: "pointer",
                    marginBottom: "18px",
                    position: "relative",
                    zIndex: 2,
                    transition: "all 0.3s ease",
                }}
            >
                ← Back
            </button>

            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? "18px" : "42px",
                    alignItems: isMobile ? "stretch" : "flex-start",
                }}
            >
                {/* Product Image */}
                <div
                    style={{
                        flex: 1,
                        minHeight: isMobile ? "auto" : "620px",
                        display: "flex",
                        alignItems: isMobile ? "center" : "flex-start",
                        justifyContent: "center",
                        position: "relative",
                        paddingTop: isMobile ? "0" : "25px",
                        order: isMobile ? 1 : 0,
                    }}
                >
                    <img
                        src={
                            product.image?.startsWith("http")
                                ? product.image
                                : new URL(`../assets/${product.image}`, import.meta.url).href
                        }
                        alt={product.name}
                        style={{
                            width: "100%",
                            maxWidth: isMobile ? "320px" : "650px",
                            objectFit: "contain",
                            filter: "drop-shadow(0px 24px 40px rgba(0,0,0,0.16))",
                            display: "block",
                        }}
                    />
                </div>

                {/* Product Info */}
                <div
                    style={{
                        width: isMobile ? "100%" : "390px",
                        maxWidth: isMobile ? "100%" : "390px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                        marginTop: isMobile ? "0" : "22px",
                        order: isMobile ? 2 : 0,
                    }}
                >
                    {/* Description */}
                    <div style={box(isMobile, themeColors)}>
                        <p style={labelStyle(isMobile, themeColors)}>Description</p>
                        <p style={valueStyle(isMobile, themeColors)}>{product.description}</p>
                    </div>

                    {/* Price */}
                    <div style={box(isMobile, themeColors)}>
                        <p style={labelStyle(isMobile, themeColors)}>Price</p>
                        <p style={priceStyle(isMobile, themeColors)}>${product.price.toFixed(2)}</p>
                    </div>

                    {/* Ingredients */}
                    <div style={box(isMobile, themeColors)}>
                        <p style={labelStyle(isMobile, themeColors)}>Ingredients</p>
                        <p style={valueStyle(isMobile, themeColors)}>{product.ingredients?.join(", ")}</p>
                    </div>

                    {/* Stock */}
                    <div style={box(isMobile, themeColors)}>
                        <p style={labelStyle(isMobile, themeColors)}>
                            {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
                        </p>
                    </div>

                    {/* Actions */}
                    <div
                        style={{
                            ...box(isMobile, themeColors),
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "12px",
                            paddingTop: "16px",
                            paddingBottom: "14px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "14px",
                                flexWrap: "wrap",
                                width: "100%",
                            }}
                        >
                            <Button
                                text="Add to Cart"
                                variant={product.stock > 0 ? "primary" : "purpleDisabled"}
                                disabled={product.stock <= 0}
                                style={{
                                    width: "170px",
                                    borderRadius: "14px",
                                    background: themeColors.buttonColor,
                                    transition: "all 0.3s ease"
                                }}
                                onMouseEnter={(e) => {
                                    if (product.stock > 0) {
                                        e.currentTarget.style.background = themeColors.buttonHover;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (product.stock > 0) {
                                        e.currentTarget.style.background = themeColors.buttonColor;
                                    }
                                }}
                                onClick={handleAddToCart}
                            />

                            <img
                                src={liked ? heartFilled : heart}
                                alt="wishlist"
                                onClick={handleWishlistClick}
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    cursor: "pointer",
                                    opacity: 0.8,
                                    transition: "all 0.2s ease",
                                    transform: liked ? "scale(1.2)" : "scale(1)",
                                }}
                            />
                        </div>

                        {addedToCart && (
                            <p
                                style={{
                                    margin: 0,
                                    textAlign: "center",
                                    color: "#39a86f",
                                    fontSize: "15px",
                                    fontWeight: "500",
                                }}
                            >
                                Item added successfully
                            </p>
                        )}

                        {product.stock <= 0 && (
                            <p
                                style={{
                                    margin: 0,
                                    textAlign: "center",
                                    color: "#ff4d3d",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                }}
                            >
                                Out of stock
                            </p>
                        )}
                    </div>

                    {/* Reviews */}
                    <div style={{ ...box(isMobile, themeColors), paddingTop: "14px", paddingBottom: "14px" }}>
                        <p style={labelStyle(isMobile, themeColors)}>Reviews ({reviews.length})</p>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                marginBottom: "12px",
                            }}
                        >
                            <ProfileIcon color={themeColors.iconColor} hoverColor={themeColors.iconHoverColor} />

                            <input
                                type="text"
                                placeholder="Write your review..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: "11px 14px",
                                    borderRadius: "18px",
                                    background: themeColors.reviewBg,
                                    border: `1px solid ${themeColors.reviewBorder}`,
                                    color: themeColors.valueColor,
                                    fontSize: "14px",
                                    fontFamily: "Josefin Sans, sans-serif",
                                    outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />

                            <button
                                onClick={handleSendReview}
                                disabled={!reviewText.trim()}
                                style={{
                                    padding: isMobile ? "10px 12px" : "10px 14px",
                                    borderRadius: "12px",
                                    border: "none",
                                    background: reviewText.trim() ? themeColors.buttonColor : "#ccc",
                                    color: "white",
                                    cursor: reviewText.trim() ? "pointer" : "not-allowed",
                                    fontFamily: "Josefin Sans, sans-serif",
                                    opacity: reviewText.trim() ? 1 : 0.6,
                                    transition: "all 0.3s ease",
                                }}
                            >
                                Send
                            </button>
                        </div>

                        {!isLoggedIn && (
                            <p
                                style={{
                                    color: "#ff4d3d",
                                    fontSize: "13px",
                                    textAlign: "center",
                                    marginTop: 0,
                                    marginBottom: "10px",
                                }}
                            >
                                Please login to leave a review
                            </p>
                        )}
                        
                        {/* Display reviews */}
                        {reviews.length > 0 ? (
                            reviews.map((review, index) => (
                                <div key={review.id || index} style={reviewStyle(isMobile, themeColors)}>
                                    <ProfileIcon color={themeColors.iconColor} hoverColor={themeColors.iconHoverColor} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px", flexWrap: "wrap", gap: "5px" }}>
                                            <strong style={{ fontSize: "13px", color: themeColors.labelColor }}>
                                                {review.userName || "Anonymous"}
                                            </strong>
                                            {review.date && (
                                                <span style={{ fontSize: "10px", color: "#999" }}>{review.date}</span>
                                            )}
                                        </div>
                                        <span style={{ fontSize: "14px", color: themeColors.valueColor }}>{review.text || review}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>
                                No reviews yet. Be the first to review this product!
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Styled components that change with theme
const box = (isMobile, themeColors) => ({
    background: themeColors.cardBg,
    border: `1px solid ${themeColors.borderColor}`,
    borderRadius: isMobile ? "22px" : "24px",
    padding: isMobile ? "14px 16px" : "16px 18px",
    backdropFilter: "blur(12px)",
    boxSizing: "border-box",
    transition: "all 0.3s ease",
});

const labelStyle = (isMobile, themeColors) => ({
    margin: "0 0 8px 0",
    color: themeColors.labelColor,
    fontSize: isMobile ? "17px" : "18px",
    fontWeight: "600",
    textAlign: "center",
});

const valueStyle = (isMobile, themeColors) => ({
    margin: 0,
    color: themeColors.valueColor,
    fontSize: "15px",
    textAlign: "center",
    lineHeight: 1.5,
});

const priceStyle = (isMobile, themeColors) => ({
    margin: 0,
    color: themeColors.valueColor,
    fontSize: isMobile ? "20px" : "24px",
    textAlign: "center",
    fontWeight: "700",
});

const reviewStyle = (isMobile, themeColors) => ({
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: isMobile ? "10px 12px" : "11px 13px",
    borderRadius: "18px",
    background: themeColors.reviewBg,
    border: `1px solid ${themeColors.reviewBorder}`,
    color: themeColors.valueColor,
    fontSize: "14px",
    marginBottom: "10px",
    wordBreak: "break-word",
    transition: "all 0.3s ease",
});

export default ProductDetails;