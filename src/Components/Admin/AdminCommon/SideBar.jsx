import React, { useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../../Context/AdminAuthContext";

const links = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Categories", to: "/admin/categories" },
  { label: "Brands", to: "/admin/brands" },
  { label: "Products", to: "/admin/products" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Users", to: "/admin/users" },
  { label: "Shipping", to: "/admin/shipping" },
  { label: "Change Password", to: "/admin/change-password" },
];

export default function SideBar() {
  const navigate = useNavigate();
  const {logout} = useContext(AdminAuthContext);

  const logoutHandler = () => {
    // TODO: clear auth, call API, etc.
   logout();
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">Menu</h2>
      </div>

      <ul className="space-y-1">
        {links.map(({ label, to }) => (
          <li key={to}>
            <NavLink
              to={to} // <-- absolute path prevents `/admin/dashboard/...`
              className={({ isActive }) =>
                `block py-2 px-6 rounded text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-gray-700 ${
                  isActive ? "bg-indigo-50 dark:bg-gray-700" : ""
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}

        <li>
          <button
            onClick={logoutHandler}
            className="w-full text-left block py-2 px-6 rounded text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-gray-700"
          >
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}
