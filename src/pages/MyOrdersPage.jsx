import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OrdersTable } from "../components/orders/OrdersTable";
import { Button } from "../components/ui/Button";
import { ConnectionStatus } from "../components/ui/ConnectionStatus";
import useOrderStore from "../stores/useOrderStore";

export function MyOrdersPage() {
  const navigate = useNavigate();
  const { orders, fetchOrders, isOfflineMode } = useOrderStore();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <Button variant="primary" onClick={() => navigate("/add-order")}>
          Add New Order
        </Button>
      </div>

      {isOfflineMode && (
        <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
          <p className="font-medium">You are working in offline mode</p>
          <p className="text-sm">
            The application is using local data because it cannot connect to the
            server. Changes you make will be visible but won't be saved to the
            server.
          </p>
        </div>
      )}

      <OrdersTable orders={orders} />

      <ConnectionStatus />
    </div>
  );
}
