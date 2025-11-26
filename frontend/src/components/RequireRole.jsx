// src/components/RequireRole.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const RequireRole = ({ role }) => {
  const userRole = localStorage.getItem("role");

  if (userRole !== role) {
    // wrong role → send them somewhere safe
    if (userRole === "farmer") return <Navigate to="/farmer-dashboard" replace />;
    if (userRole === "buyer") return <Navigate to="/buyer-dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireRole;
