import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  matchPath,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Verify from "./pages/verify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Order from "./pages/Order";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./admin/AdminDashboard";
import "./index.css";
import AddProduct from "./admin/AddProduct";
import ManageProducts from "./admin/ManageProducts";
import ManageUser from './admin/ManageUsers';
import ManageOrders from "./admin/ManageOrders";
import AboutPage from "./pages/about";
import UpdatePassword from "./users/UpdatePassword";
import Settings from './admin/Setting';
import AdminNavbar from "./admin/AdminNavbar";
import OrderConfirm from "./pages/OrderConfirm"; // ✅ Ensure this file exists
import MyOrders from "./pages/MyOrders";
import PageNotFound from "./pages/PageNotFound";

// Array of all admin routes
const adminRoutes = [
  "/admin-dashboard",
  "/admin/add-product",
  "/admin/products",
  "/admin/users",
  "/admin/orders",
  "/admin/settings"
];

function AppLayout() {
  const location = useLocation();
  
  // Check if current route is an admin route
  const isAdminRoute = adminRoutes.some(path => 
    matchPath({ path, end: false }, location.pathname)
  );

  // Routes where we want to hide both navbars and footer
  const hideAllLayoutRoutes = ["/login", "/register", "/verify"];

  const shouldHideAllLayout = hideAllLayoutRoutes.some(path =>
    matchPath({ path, end: true }, location.pathname)
  );

  return (
    <>
      {/* Show AdminNavbar for admin routes, regular Navbar for others */}
      {!shouldHideAllLayout && (
        isAdminRoute ? <AdminNavbar /> : <Navbar />
      )}
      
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/order" element={<Order />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/order-confirm" element={<OrderConfirm />} /> {/* ✅ FIXED LINE */}
        <Route path='/my-orders' element={<MyOrders/>} />
        <Route path="*" element={<PageNotFound/>} />
        
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/users" element={<ManageUser />} />
        <Route path="/admin/orders" element={<ManageOrders />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Routes>
      
      {/* Don't show footer for admin routes or hidden layout routes */}
      {!shouldHideAllLayout && !isAdminRoute && <Footer />}
    </>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AppLayout />
  </BrowserRouter>
);
