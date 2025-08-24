import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AdminAuthContext } from "./Components/Context/AdminAuthContext";

export default function ProtectedRoute() {
  const { user } = useContext(AdminAuthContext); // or isAuthenticated
  return user ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
