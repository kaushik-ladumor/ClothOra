import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  if (!token) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return children;
}

export default PrivateRoute;
