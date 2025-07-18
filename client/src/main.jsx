import React from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  matchPath,
} from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Verify from "./pages/verify";
import AboutPage from "./pages/about";
import Order from "./pages/Order";
import Checkout from "./pages/Checkout";
import OrderConfirm from "./pages/OrderConfirm";
import MyOrders from "./pages/MyOrders";
import PageNotFound from "./pages/PageNotFound";
import UpdatePassword from "./users/UpdatePassword";

// Admin Pages
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import ManageProducts from "./admin/ManageProducts";
import ManageUser from "./admin/ManageUsers";
import ManageOrders from "./admin/ManageOrders";
import Settings from "./admin/Setting";

// Layouts
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminNavbar from "./admin/AdminNavbar";

// Route Guards
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

// Styles
import "./index.css";

// Admin-specific paths
const adminRoutes = [
  "/admin-dashboard",
  "/admin/add-product",
  "/admin/products",
  "/admin/users",
  "/admin/orders",
  "/admin/settings",
];

// Pages without any layout (Navbar/Footer)
const hideAllLayoutRoutes = ["/login", "/register", "/verify"];

function AppLayout() {
  const location = useLocation();

  const isAdminRoute = adminRoutes.some((path) =>
    matchPath({ path, end: false }, location.pathname)
  );

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
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/order-confirm" element={<OrderConfirm />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="*" element={<PageNotFound />} />

        {/* User Protected Routes */}
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
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
          path="/order"
          element={
            <PrivateRoute>
              <Order />
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

        {/* Admin Protected Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <ManageProducts />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ManageUser />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <ManageOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <Settings />
            </AdminRoute>
          }
        />
      </Routes>

      {!shouldHideAllLayout && !isAdminRoute && <Footer />}
    </>
  );
}

// Mount the root app
const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AppLayout />
  </BrowserRouter>
);
