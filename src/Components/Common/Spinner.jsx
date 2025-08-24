import './Spinner.css';
import React from "react";

/**
 * Usage:
 * <LoaderOverlay show={loading} message="Fetching categories..." />
 */
export default function LoaderOverlay({ show = false, message = "Loading..." }) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      aria-live="polite"
      aria-busy="true"
      role="status"
    >
      {/* Glassy backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-white/60 dark:from-gray-900/70 dark:via-gray-900/40 dark:to-gray-900/70 backdrop-blur-md"></div>

      {/* Loader content */}
      <div className="relative flex flex-col items-center gap-4 p-6">
        <div className="loader-ring shadow-lg" />
        <div className="text-sm font-medium tracking-wide text-gray-700 dark:text-gray-200">
          {message}
        </div>
      </div>
    </div>
  );
}
