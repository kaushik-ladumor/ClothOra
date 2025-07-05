import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Save path to redirect after login
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return children;
}

export default PrivateRoute;
