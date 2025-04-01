import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useOrderStore from "../../stores/useOrderStore";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { Button } from "../ui/Button";
import { ConfirmationDialog } from "../ui/ConfirmationDialog";
import { DataTable } from "../ui/DataTable";

export function OrdersTable() {
  const navigate = useNavigate();
  const { orders, deleteOrder } = useOrderStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  const handleEdit = (orderId) => {
    navigate(`/add-order/${orderId}`);
  };

  const handleDelete = (order) => {
    // Don't allow deleting completed orders
    if (order.status === "Completed") {
      alert("Cannot delete completed orders");
      return;
    }

    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete.id);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "InProgress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const columns = [
    { key: "id", header: "ID" },
    { key: "orderNumber", header: "Order #" },
    {
      key: "date",
      header: "Date",
      render: (row) => formatDate(row.date),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
            row.status
          )}`}
        >
          {row.status || "Pending"}
        </span>
      ),
    },
    { key: "productCount", header: "# Products" },
    {
      key: "finalPrice",
      header: "Final Price",
      render: (row) => formatCurrency(row.finalPrice),
    },
    {
      key: "actions",
      header: "Options",
      render: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.id)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row)}
            disabled={row.status === "Completed"}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <DataTable columns={columns} data={orders} />

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order #${orderToDelete?.orderNumber}? This action cannot be undone.`}
      />
    </div>
  );
}
