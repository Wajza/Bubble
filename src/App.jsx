import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Customize from "./pages/Customize";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import AdminDashboard from "./pages/AdminDashboard";
import ProductManagement from "./pages/ProductManagement";
import InventoryManagement from "./pages/InventoryManagement";
import ReviewManagement from "./pages/ReviewManagement";
import OrderManagement from "./pages/OrderManagement";
import PromotionsManagement from "./pages/PromotionsManagement";
import TicketManagement from "./pages/TicketManagement";
import FAQTemplates from "./pages/FAQTemplates";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<ProductManagement />} />
        <Route path="/admin/inventory" element={<InventoryManagement />} />
        <Route path="/admin/reviews" element={<ReviewManagement />} />
        <Route path="/admin/orders" element={<OrderManagement />} />
        <Route path="/admin/promotions" element={<PromotionsManagement />} />
        <Route path="/customer-service/tickets" element={<TicketManagement />} />
        <Route path="/customer-service/faqs" element={<FAQTemplates />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;