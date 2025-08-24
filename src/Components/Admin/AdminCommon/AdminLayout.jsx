import React, { useState } from "react";
import SideBar from "./SideBar";

export default function AdminLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <SideBar />

        {/* Main content */}
        <div className="flex flex-col flex-1">
          {/* Header */}
          <header className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-3 shadow">
            {/* Logo */}
            <div className="text-xl font-bold text-gray-800 dark:text-gray-100">
              AdminPanel
            </div>

            {/* Nav links */}
            <nav className="flex items-center space-x-6 text-gray-600 dark:text-gray-200">
              <a href="#" className="hover:text-indigo-600">Home</a>
              <a href="#" className="hover:text-indigo-600">Account</a>
              <a href="#" className="hover:text-indigo-600">Settings</a>

              {/* Dark/Light switcher */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {darkMode ? "Light" : "Dark"}
              </button>
            </nav>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
