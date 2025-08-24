import { createContext, useState, useEffect, useMemo } from "react";
import { apiUrl } from "../Http";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AdminAuthContext = createContext();

export default function AdminAuthProvider({ children }) {
  const navigate = useNavigate();

  // Load persisted user (if any)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("adminInfo");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Keep localStorage in sync
  useEffect(() => {
    if (user) {
      localStorage.setItem("adminInfo", JSON.stringify(user));
    } else {
      localStorage.removeItem("adminInfo");
    }
  }, [user]);

  async function login(data) {
    setLoading(true);
    try {
      const res = await axios.post(`${apiUrl}/admin/login`, {
        email: data.email,
        password: data.password,
      });

      console.log(res);

      // Most APIs return data under res.data
      const { user: userData, token, message } = res.data;

      // Optional: store token for future requests
      if (token) {
        localStorage.setItem("adminToken", token);
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      }

      setUser(userData || null);

      toast.success(message || "Login successful 🎉");
      navigate("/admin/dashboard", { replace: true }); // leading slash!
    } catch (e) {
      const msg =
        e.response?.data?.message ||
        e.message ||
        "Login failed. Please try again.";
      toast.error(msg);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    // Clear storage properly
    localStorage.removeItem("adminInfo");
    localStorage.removeItem("adminToken");
    delete axios.defaults.headers.common.Authorization;

    setUser(null);
    navigate("/admin/login", { replace: true });
    toast.info("Logged out.");
  }

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      setLoading,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, loading]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
