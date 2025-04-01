import React, { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { MyOrdersPage } from "./pages/MyOrdersPage";
import { AddEditOrderPage } from "./pages/AddEditOrderPage";
import { ConnectionStatus } from "./components/ui/ConnectionStatus";
import "./styles.css";

function App() {
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);

  // Global error boundary
  useEffect(() => {
    const handleError = (event) => {
      console.error("Unhandled error:", event.error);
      setHasError(true);
      setErrorInfo(event.error?.toString() || "An unknown error occurred");
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
          <div className="text-red-600 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-center mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">
            The application encountered an error. Please try refreshing the
            page.
          </p>
          <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-700 font-mono mb-6 overflow-auto max-h-40">
            {errorInfo}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/add-order" element={<AddEditOrderPage />} />
          <Route path="/add-order/:id" element={<AddEditOrderPage />} />
          <Route path="*" element={<Navigate to="/my-orders" replace />} />
        </Routes>
        <ConnectionStatus />
      </div>
    </BrowserRouter>
  );
}

export default App;
