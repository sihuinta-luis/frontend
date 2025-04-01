import React from "react";
import useOrderStore from "../../stores/useOrderStore";

export function ConnectionStatus() {
  const { isOfflineMode, error } = useOrderStore();

  if (!isOfflineMode && !error) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 px-4 py-2 rounded-md shadow-lg ${
        isOfflineMode
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium">
          {isOfflineMode
            ? "Working in offline mode. Changes won't be saved to the server."
            : error}
        </span>
      </div>
    </div>
  );
}
