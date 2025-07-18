import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  if (!token || !user || user.role !== "Admin") {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return children;
}

export default AdminRoute;
