import { useState } from "react";
import rose from "../assets/rose.png";
import lavender from "../assets/lavender.png";
import rosemary from "../assets/rosemary.png";
import soap from "../assets/soap-bliss.png";
import userProfile from "../assets/profile-picture.png";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/reviewManagement.css";

function ReviewManagement() {
  const products = [
    { id: 1, name: "Sakura Bliss", image: rose },
    { id: 2, name: "Lavender Bliss", image: lavender },
    { id: 3, name: "Rosemary Bliss", image: rosemary },
    { id: 4, name: "Soap Bliss", image: soap },
  ];

  const [reviewsData, setReviewsData] = useState({
    1: [
      { user: "Lana", text: "Amazing soap, I really loved the smell." },
      { user: "Sara", text: "Very soft on the skin and looks beautiful." },
      { user: "Nora", text: "Would definitely buy it again." },
    ],
    2: [
      { user: "Maha", text: "The lavender scent is very relaxing." },
      { user: "Reem", text: "Good product for daily use." },
      { user: "Huda", text: "I liked it, but I wish the scent lasted longer." },
    ],
    3: [
      { user: "Raghad", text: "Very refreshing and unique." },
      { user: "Noor", text: "The rosemary smell feels natural and clean." },
      { user: "Abeer", text: "One of my favorite products." },
    ],
    4: [
      { user: "Dalal", text: "Simple and cute customizable soap." },
      { user: "Jawaher", text: "Nice idea for gifts." },
      { user: "Abrar", text: "I enjoyed choosing my own ingredients." },
    ],
  });

  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  // --- Modal States ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const triggerDelete = (productId, reviewIndex) => {
    setReviewToDelete({ productId, reviewIndex });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (reviewToDelete) {
      const { productId, reviewIndex } = reviewToDelete;
      setReviewsData((prev) => ({
        ...prev,
        [productId]: prev[productId].filter((_, index) => index !== reviewIndex),
      }));
    }
    setShowDeleteModal(false);
    setReviewToDelete(null);
  };

  const selectedReviews = reviewsData[selectedProduct.id] || [];

  return (
    <div className="purple-page review-page">
      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-card">
            <h3 className="msg-red">Delete Review?</h3>
            <p>Are you sure you want to delete this review? This action cannot be undone.</p>
            <div className="modal-actions-split">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="delete-btn-final" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="review-layout">
        <AdminSidebar activePage="reviews" />

        <div className="review-main">
          <div className="products-panel">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>

                <button
                  className={
                    selectedProduct.id === product.id
                      ? "reviews-btn active-review-btn"
                      : "reviews-btn"
                  }
                  onClick={() => setSelectedProduct(product)}
                >
                  Reviews
                </button>
              </div>
            ))}
          </div>

          <div className="reviews-panel">
            <h2>{selectedProduct.name} Reviews</h2>

            {selectedReviews.length > 0 ? (
              selectedReviews.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-left">
                    <img
                      src={userProfile}
                      alt={review.user}
                      className="review-user-img"
                    />

                    <div className="review-text-box">
                      <span className="review-user-name">{review.user}</span>
                      <p>{review.text}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => triggerDelete(selectedProduct.id, index)}
                    className="delete-review-btn"
                  >
                    🗑
                  </button>
                </div>
              ))
            ) : (
              <div className="empty">No reviews found for this product.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewManagement;