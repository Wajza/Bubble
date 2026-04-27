import { useState } from "react";
import rose from "../assets/rose.png";
import rosemary from "../assets/rosemary.png";
import AdminSidebar from "../components/AdminSidebar";
import "../styles/orderManagement.css";

function OrderManagement() {
  const [orders, setOrders] = useState([
    {
      id: "#1024",
      customer: "User 1",
      amount: "$6.00",
      status: "Pending",
      date: "14-02-2026",
      items: [
        { name: "Rosemary Bliss", price: "$3.00", qty: 1, image: rosemary },
        { name: "Sakura Bliss", price: "$3.00", qty: 1, image: rose },
      ],
    },
    {
      id: "#9867",
      customer: "User 2",
      amount: "$32.96",
      status: "Shipped",
      date: "14-02-2026",
      items: [{ name: "Rosemary Bliss", price: "$16.48", qty: 2, image: rosemary }],
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");

  const handleSelect = (order) => {
    setSelectedOrder(order);
    setStatus(order.status);
  };

  const handleUpdate = () => {
    if (!selectedOrder) return;

    const updatedOrders = orders.map((order) =>
      order.id === selectedOrder.id ? { ...order, status } : order
    );

    setOrders(updatedOrders);

    const updatedSelectedOrder = updatedOrders.find(
      (order) => order.id === selectedOrder.id
    );

    setSelectedOrder(updatedSelectedOrder);
  };

  return (
    <div className="purple-page order-page">
      <div className="order-layout">
        <AdminSidebar activePage="orders" />

        <div className="order-main">
          <div className="orders-panel">
            <h2>Orders</h2>

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
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => handleSelect(order)}
                    className={selectedOrder?.id === order.id ? "selected" : ""}
                  >
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.amount}</td>
                    <td>
                      <span className={`status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="details-panel">
            <h2>Details</h2>

            {selectedOrder ? (
              <>
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
                    {selectedOrder.items.map((item, i) => (
                      <tr key={i}>
                        <td className="product-cell">
                          <img src={item.image} alt={item.name} />
                          {item.name}
                        </td>
                        <td>{item.price}</td>
                        <td>{item.qty}</td>
                        <td>{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="update-section">
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option>Pending</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                  </select>

                  <button className="update-btn" onClick={handleUpdate}>
                    Update
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