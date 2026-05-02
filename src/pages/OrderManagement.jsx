import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/orderManagement.css";
import { getAuthToken } from "../utils/auth";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = getAuthToken();
        
        const res = await fetch("http://localhost:5000/api/admin/orders", {
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          }
        });
        
        const data = await res.json();

        setOrders(data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSelect = (order) => {
    setSelectedOrder(order);
    setStatus(order.status || "Processing");
    setMessage("");
  };

  const handleUpdate = async () => {
    if (!selectedOrder) return;

    try {
      const token = getAuthToken();
      
      const res = await fetch(
        `http://localhost:5000/api/admin/orders/${selectedOrder._id}/status`,
        {
          method: "PUT",
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update order");
      }

      const updatedOrder = await res.json();

      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );

      setSelectedOrder(updatedOrder);
      setMessage("Order status updated!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Failed to update order status");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-GB");
  };

  const formatMoney = (value) => {
    return `$${Number(value || 0).toFixed(2)}`;
  };

  const getCustomerName = (order) => {
    // Try to get customer name from different possible fields
    if (order.customer?.fullName) return order.customer.fullName;
    if (order.customer?.name) return order.customer.name;
    if (order.user?.fullName) return order.user.fullName;
    if (order.user?.name) return order.user.name;
    if (order.userId) {
      // If userId is available, show it with @ symbol
      return `User #${order.userId.slice(-6)}`;
    }
    return "Guest User";
  };

  const getCustomerEmail = (order) => {
    if (order.customer?.email) return order.customer.email;
    if (order.user?.email) return order.user.email;
    return "No email";
  };

  const getCustomerPhone = (order) => {
    if (order.customer?.phone) return order.customer.phone;
    if (order.user?.phone) return order.user.phone;
    return "No phone";
  };

  const getCustomerAddress = (order) => {
    if (order.customer?.address) return order.customer.address;
    if (order.customer?.location) return order.customer.location;
    if (order.user?.address) return order.user.address;
    return "No address";
  };

  if (loading) {
    return (
      <div className="purple-page order-page">
        <div className="order-layout">
          <AdminSidebar activePage="orders" />
          <div className="order-main">
            <div style={{ textAlign: "center", padding: "50px" }}>
              Loading orders...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="purple-page order-page">
      <div className="order-layout">
        <AdminSidebar activePage="orders" />

        <div className="order-main">
          <div className="orders-panel">
            <h2>Orders</h2>

            {message && (
              <p
                style={{
                  color: message.includes("success") ? "#39a86f" : "#ff4d6d",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                {message}
              </p>
            )}

            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      onClick={() => handleSelect(order)}
                      className={
                        selectedOrder?._id === order._id ? "selected" : ""
                      }
                    >
                      <td>#{order._id?.slice(-6) || "N/A"}</td>
                      <td>{getCustomerName(order)}</td>
                      <td>{formatMoney(order.totalPrice)}</td>
                      <td>
                        <span
                          className={`status ${(
                            order.status || "Processing"
                          ).toLowerCase()}`}
                        >
                          {order.status || "Processing"}
                        </span>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="details-panel">
            <h2>Order Details</h2>

            {selectedOrder ? (
              <>
                {/* Customer Information Section */}
                <div style={{ 
                  marginBottom: "20px", 
                  padding: "15px", 
                  background: "rgba(255,255,255,0.1)", 
                  borderRadius: "16px" 
                }}>
                  <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>Customer Information</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <strong>Name:</strong> {getCustomerName(selectedOrder)}
                    </div>
                    <div>
                      <strong>Email:</strong> {getCustomerEmail(selectedOrder)}
                    </div>
                    <div>
                      <strong>Phone:</strong> {getCustomerPhone(selectedOrder)}
                    </div>
                    <div>
                      <strong>Address:</strong> {getCustomerAddress(selectedOrder)}
                    </div>
                  </div>
                </div>

                {/* Order Items Section */}
                <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>Order Items</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedOrder.items?.length > 0 ? (
                      selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="product-cell">
                            {item.name || "Product"}
                          </td>
                          <td>{formatMoney(item.price)}</td>
                          <td>{item.quantity || 1}</td>
                          <td>
                            {formatMoney(
                              Number(item.price || 0) *
                                Number(item.quantity || 1)
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center" }}>
                          No items in this order.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  
                  {/* Order Total */}
                  <tfoot>
                    <tr style={{ background: "rgba(255,255,255,0.2)" }}>
                      <td colSpan="3" style={{ textAlign: "right", fontWeight: "bold" }}>
                        Total:
                      </td>
                      <td style={{ fontWeight: "bold" }}>
                        {formatMoney(selectedOrder.totalPrice)}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                <div className="update-section">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button className="update-btn" onClick={handleUpdate}>
                    Update Status
                  </button>
                </div>
              </>
            ) : (
              <p>Select an order to see details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderManagement;