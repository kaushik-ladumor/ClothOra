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
import ManageUser from "./admin/ManageUsers";
import ManageOrders from "./admin/ManageOrders";
import AboutPage from "./pages/about";
import UpdatePassword from "./users/UpdatePassword";
import Settings from "./admin/Setting";
import AdminNavbar from "./admin/AdminNavbar";
import OrderConfirm from "./pages/OrderConfirm";
import MyOrders from "./pages/MyOrders";
import PageNotFound from "./pages/PageNotFound";
import PrivateRoute from "./components/PrivateRoute"; // ✅ Import this

// Array of all admin routes
const adminRoutes = [
  "/admin-dashboard",
  "/admin/add-product",
  "/admin/products",
  "/admin/users",
  "/admin/orders",
  "/admin/settings",
];

function AppLayout() {
  const location = useLocation();

  const isAdminRoute = adminRoutes.some((path) =>
    matchPath({ path, end: false }, location.pathname)
  );

  const hideAllLayoutRoutes = ["/login", "/register", "/verify"];

  const shouldHideAllLayout = hideAllLayoutRoutes.some((path) =>
    matchPath({ path, end: true }, location.pathname)
  );

  return (
    <>
      {!shouldHideAllLayout && (isAdminRoute ? <AdminNavbar /> : <Navbar />)}

      <Routes>
        {/* Public Routes */}
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
        <Route path="/order-confirm" element={<OrderConfirm />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="*" element={<PageNotFound />} />

        <Route
          path="/order"
          element={
            <PrivateRoute>
              <Order />
            </PrivateRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <PrivateRoute>
              <ProductDetails />
            </PrivateRoute>
          }
        />

        {/* Admin Routes - Protected by PrivateRoute */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <PrivateRoute>
              <ManageProducts />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <ManageUser />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <PrivateRoute>
              <ManageOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
      </Routes>

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
