import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import rose from "../assets/rose.png";
import lavender from "../assets/lavender.png";
import rosemary from "../assets/rosemary.png";
import soap from "../assets/soap-bliss.png";
import AdminSidebar from "../components/AdminSidebar";


function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [salesFilter, setSalesFilter] = useState("all");

  const allProducts = [
    { id: 1, name: "Sakura Bliss", price: 30, image: rose },
    { id: 2, name: "Lavender Bliss", price: 30, image: lavender },
    { id: 3, name: "Rosemary Bliss", price: 50, image: rosemary },
    { id: 4, name: "Soap Bliss", price: 7, image: soap },
  ];

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];

    setUsers(storedUsers);
    setOrders(storedOrders);
  }, []);

  const totalSales = useMemo(() => {
    return orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  }, [orders]);

  const totalOrders = orders.length;

  const totalCustomers = useMemo(() => {
    const uniqueCustomers = new Set(
      orders
        .map((order) => order.customer?.email || order.customer?.fullName)
        .filter(Boolean)
    );
    return uniqueCustomers.size;
  }, [orders]);

  const totalProducts = allProducts.length;

  const recentOrders = useMemo(() => {
    return [...orders].slice(0, 5);
  }, [orders]);

  const topProducts = useMemo(() => {
    const counts = {};

    orders.forEach((order) => {
      const itemName = order.item || "Unknown Item";
      counts[itemName] = (counts[itemName] || 0) + (order.quantity || 1);
    });

    const ranked = Object.entries(counts)
      .map(([name, quantity]) => {
        const product = allProducts.find((p) => p.name === name);
        return {
          name,
          quantity,
          price: product?.price || Number(orders.find((o) => o.item === name)?.total || 0),
          image: product?.image || rose,
        };
      })
      .sort((a, b) => b.quantity - a.quantity);

    if (ranked.length > 0) return ranked.slice(0, 4);

    return allProducts.slice(0, 1).map((product) => ({
      name: product.name,
      quantity: 0,
      price: product.price,
      image: product.image,
    }));
  }, [orders]);

  const salesChartData = useMemo(() => {
    // Determine the date range based on filter
    let filteredOrders = orders;
    if (salesFilter === "last6" || salesFilter === "last3") {
      const now = new Date();
      const monthsBack = salesFilter === "last6" ? 6 : 3;
      const fromDate = new Date(now.getFullYear(), now.getMonth() - monthsBack + 1, 1);
      filteredOrders = orders.filter((order) => {
        if (!order.date) return false;
        const d = new Date(order.date);
        return !Number.isNaN(d.getTime()) && d >= fromDate && d <= now;
      });
    }

    const monthlyMap = {};
    filteredOrders.forEach((order) => {
      const rawDate = order.date ? new Date(order.date) : null;
      if (!rawDate || Number.isNaN(rawDate.getTime())) return;
      const monthKey = rawDate.toLocaleDateString("en-US", { month: "short" });
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + Number(order.total || 0);
    });

    const monthOrder = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    // If filtering, only show the last N months
    let monthsToShow = monthOrder;
    if (salesFilter === "last6") {
      const nowIdx = new Date().getMonth();
      monthsToShow = [];
      for (let i = 5; i >= 0; i--) {
        monthsToShow.push(monthOrder[(nowIdx - i + 12) % 12]);
      }
    } else if (salesFilter === "last3") {
      const nowIdx = new Date().getMonth();
      monthsToShow = [];
      for (let i = 2; i >= 0; i--) {
        monthsToShow.push(monthOrder[(nowIdx - i + 12) % 12]);
      }
    }

    return monthsToShow.map((month) => ({
      month,
      sales: monthlyMap[month] || 0,
    }));
  }, [orders, salesFilter]);

  const activityData = useMemo(() => {
    const customers = users.filter((user) => user.role === "user").length;
    const customerservice = users.filter((user) => user.role === "customer-service").length;
    const admins = users.filter((user) => user.role === "admin").length;

    const total = customers + customerservice + admins;

    return [
      {
        name: "Customers",
        value: customers,
        percent: total ? Math.round((customers / total) * 100) : 0,
        color: "#5b2ff5",
      },
      {
        name: "customer-service",
        value: customerservice,
        percent: total ? Math.round((customerservice / total) * 100) : 0,
        color: "#8e3fd6",
      },
      {
        name: "Admin",
        value: admins,
        percent: total ? Math.round((admins / total) * 100) : 0,
        color: "#c45cc9",
      },
    ];
  }, [users]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-GB");
  };

  return (
    <div
      className="purple-page"
      style={{
        minHeight: "100vh",
        padding: "26px 24px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="admin-dashboard-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "200px 1fr",
          gap: "16px",
        }}
      >
        <AdminSidebar activePage="dashboard" />

        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          <div
            className="admin-top-cards"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
            }}
          >
            <StatCard
              title="Total Sales"
              value={`$${totalSales.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              change="▲ dynamic from orders"
              changeColor="#3ea85b"
            />
            <StatCard
              title="Orders"
              value={totalOrders.toString()}
              change="▲ based on placed orders"
              changeColor="#3ea85b"
            />
            <StatCard
              title="Customers"
              value={totalCustomers.toString()}
              change="▼ unique customer count"
              changeColor="#e76b4f"
            />
            <StatCard title="Products" value={totalProducts.toString()} />
          </div>

          <div
            className="admin-middle-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.45fr 1fr",
              gap: "16px",
            }}
          >
            <div style={panelStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <h2 style={panelTitleStyle}>Sales Overview</h2>
                <select
                  style={selectStyle}
                  value={salesFilter}
                  onChange={e => setSalesFilter(e.target.value)}
                >
                  <option value="all">All Months</option>
                  <option value="last6">Last 6 Months</option>
                  <option value="last3">Last 3 Months</option>
                </select>
              </div>

              <div style={{ width: "100%", height: "180px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesChartData}>
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#8f4bd8"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={panelStyle}>
              <h2 style={panelTitleStyle}>Recent Orders</h2>

              <div style={{ overflowX: "auto", borderRadius: "14px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "rgba(255,255,255,0.32)",
                    borderRadius: "14px",
                    overflow: "hidden",
                  }}
                >
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.45)" }}>
                      <th style={thStyle}>Order ID.</th>
                      <th style={thStyle}>Customer</th>
                      <th style={thStyle}>Amount</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order, index) => (
                        <tr key={order.id || index}>
                          <td style={tdStyle}>{order.id || `#${1000 + index}`}</td>
                          <td style={tdStyle}>{order.customer?.fullName || "User"}</td>
                          <td style={tdStyle}>
                            $
                            {Number(order.total || 0).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td style={tdStyle}>
                            <span
                              style={{
                                ...statusStyle,
                                background:
                                  order.status === "Shipped" ? "#b4e6b7" : "#ffd7a6",
                                color:
                                  order.status === "Shipped" ? "#2f9a3b" : "#d87017",
                              }}
                            >
                              {order.status || "Pending"}
                            </span>
                          </td>
                          <td style={tdStyle}>{formatDate(order.date)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={emptyCellStyle}>
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div
            className="admin-bottom-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.45fr 1fr",
              gap: "16px",
            }}
          >
            <div style={panelStyle}>
              <h2 style={panelTitleStyle}>Top Products</h2>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                {topProducts.map((product, index) => (
                  <div
                    key={`${product.name}-${index}`}
                    style={{
                      width: "145px",
                      background: "rgba(255,255,255,0.16)",
                      border: "1px solid rgba(255,255,255,0.35)",
                      borderRadius: "22px",
                      padding: "16px 12px 12px",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: "78px",
                        height: "78px",
                        objectFit: "contain",
                        marginBottom: "10px",
                      }}
                    />
                    <h3
                      style={{
                        margin: "0 0 6px",
                        fontSize: "22px",
                        color: "#2e3d4c",
                        fontWeight: "500",
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      style={{
                        margin: "0 0 10px",
                        fontSize: "18px",
                        color: "#2e3d4c",
                      }}
                    >
                      ${product.price.toFixed(2)}
                    </p>
                    <button
                      style={{
                        background: "#8f4bd8",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        padding: "8px 14px",
                        fontFamily: "Josefin Sans, sans-serif",
                        cursor: "pointer",
                      }}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={panelStyle}>
              <h2 style={panelTitleStyle}>Activity</h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "170px 1fr",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div style={{ width: "100%", height: "180px" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activityData}
                        dataKey="value"
                        innerRadius={42}
                        outerRadius={62}
                        paddingAngle={2}
                      >
                        {activityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  {activityData.map((item) => (
                    <div
                      key={item.name}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            background: item.color,
                            display: "inline-block",
                          }}
                        />
                        <span style={{ color: "#2e3d4c", fontSize: "16px" }}>
                          {item.name}
                        </span>
                      </div>
                      <span style={{ color: "#2e3d4c", fontSize: "14px" }}>
                        {item.percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 1100px) {
            .admin-dashboard-layout {
              grid-template-columns: 1fr !important;
            }

            .admin-top-cards,
            .admin-middle-grid,
            .admin-bottom-grid {
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

function StatCard({ title, value, change, changeColor }) {
  return (
    <div style={statCardStyle}>
      <p style={{ margin: "0 0 8px", color: "#3c4352", fontSize: "16px" }}>{title}</p>
      <h3
        style={{
          margin: "0 0 8px",
          color: "#222",
          fontSize: "34px",
          fontWeight: "700",
        }}
      >
        {value}
      </h3>
      {change && (
        <p style={{ margin: 0, color: changeColor || "#3ea85b", fontSize: "13px" }}>
          {change}
        </p>
      )}
    </div>
  );
}

const panelStyle = {
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.35)",
  borderRadius: "28px",
  backdropFilter: "blur(14px)",
  padding: "14px 16px 16px",
  boxSizing: "border-box",
};

const panelTitleStyle = {
  margin: "0 0 8px",
  fontSize: "24px",
  color: "#2e3d4c",
  fontWeight: "700",
};

const statCardStyle = {
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.35)",
  borderRadius: "24px",
  backdropFilter: "blur(14px)",
  padding: "14px 18px",
};

const selectStyle = {
  borderRadius: "8px",
  border: "1px solid rgba(0,0,0,0.12)",
  padding: "4px 8px",
  fontFamily: "Josefin Sans, sans-serif",
};

const thStyle = {
  padding: "12px 10px",
  textAlign: "left",
  color: "#3c4352",
  fontSize: "13px",
};

const tdStyle = {
  padding: "14px 10px",
  color: "#2e3d4c",
  fontSize: "13px",
  borderTop: "1px solid rgba(0,0,0,0.05)",
};

const statusStyle = {
  display: "inline-block",
  padding: "5px 10px",
  borderRadius: "8px",
  fontSize: "12px",
  fontWeight: "600",
};

const emptyCellStyle = {
  padding: "18px 10px",
  textAlign: "center",
  color: "#4b5563",
};

export default AdminDashboard;