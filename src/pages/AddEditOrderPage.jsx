import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { ConfirmationDialog } from "../components/ui/ConfirmationDialog";
import { DataTable } from "../components/ui/DataTable";
import useOrderStore from "../stores/useOrderStore";
import useProductStore from "../stores/useProductStore";
import { formatCurrency } from "../utils/formatters";
import { ConnectionStatus } from "../components/ui/ConnectionStatus";

export function AddEditOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, addOrder, updateOrder } = useOrderStore();
  const { products, fetchProducts } = useProductStore();

  const [isEditing, setIsEditing] = useState(!!id);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderStatus, setOrderStatus] = useState("Pending");
  const [orderProducts, setOrderProducts] = useState([]);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [editingProductIndex, setEditingProductIndex] = useState(-1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDeleteIndex, setProductToDeleteIndex] = useState(-1);

  // Calculate derived values
  const productCount = orderProducts.length;
  const finalPrice = orderProducts.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  // Load data on component mount
  useEffect(() => {
    fetchProducts();

    if (isEditing && id) {
      const order = getOrderById(id);
      if (order) {
        setOrderNumber(order.orderNumber);
        setOrderStatus(order.status || "Pending");
        setOrderProducts(order.products || []);
      } else {
        // Order not found, redirect to orders page
        navigate("/my-orders");
      }
    }
  }, [id, isEditing, fetchProducts, getOrderById, navigate]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Format the order data according to the API expectations
    const orderData = {
      orderNumber,
      status: orderStatus,
      products: orderProducts.map((product) => ({
        id: product.id,
        quantity: product.quantity,
      })),
    };

    if (isEditing) {
      updateOrder({ ...orderData, id })
        .then(() => navigate("/my-orders"))
        .catch((err) => console.error("Error updating order:", err));
    } else {
      addOrder(orderData)
        .then(() => navigate("/my-orders"))
        .catch((err) => console.error("Error adding order:", err));
    }
  };

  // Handle adding/editing product
  const handleProductSubmit = () => {
    if (!selectedProduct) return;

    const productObj = products.find(
      (p) => p.id.toString() === selectedProduct.toString()
    );
    if (!productObj) return;

    const productToAdd = {
      id: productObj.id,
      name: productObj.name,
      unitPrice: productObj.unitPrice,
      quantity: quantity,
    };

    if (editingProductIndex >= 0) {
      // Update existing product
      const updatedProducts = [...orderProducts];
      updatedProducts[editingProductIndex] = productToAdd;
      setOrderProducts(updatedProducts);
    } else {
      // Add new product
      setOrderProducts([...orderProducts, productToAdd]);
    }

    // Reset form
    setProductModalOpen(false);
    setSelectedProduct(null);
    setQuantity(1);
    setEditingProductIndex(-1);
  };

  // Open edit product modal
  const handleEditProduct = (index) => {
    const product = orderProducts[index];
    setSelectedProduct(product.id);
    setQuantity(product.quantity);
    setEditingProductIndex(index);
    setProductModalOpen(true);
  };

  // Handle product deletion
  const handleDeleteProduct = (index) => {
    setProductToDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (productToDeleteIndex >= 0) {
      const updatedProducts = [...orderProducts];
      updatedProducts.splice(productToDeleteIndex, 1);
      setOrderProducts(updatedProducts);
    }
  };

  // Product table columns
  const productColumns = [
    { key: "id", header: "ID" },
    { key: "name", header: "Name" },
    {
      key: "unitPrice",
      header: "Unit Price",
      render: (row) => formatCurrency(row.unitPrice),
    },
    { key: "quantity", header: "Qty" },
    {
      key: "totalPrice",
      header: "Total Price",
      render: (row) => formatCurrency(row.unitPrice * row.quantity),
    },
    {
      key: "actions",
      header: "Options",
      render: (row, index) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditProduct(orderProducts.indexOf(row))}
            disabled={orderStatus === "Completed"}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteProduct(orderProducts.indexOf(row))}
            disabled={orderStatus === "Completed"}
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  // Check if order is completed
  const isOrderCompleted = orderStatus === "Completed";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditing ? "Edit Order" : "Add Order"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Order Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Number
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isOrderCompleted}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="InProgress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Product Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Count
            </label>
            <input
              type="text"
              value={productCount}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
              disabled
            />
          </div>

          {/* Final Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Final Price
            </label>
            <input
              type="text"
              value={formatCurrency(finalPrice)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
              disabled
            />
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Products</h2>
            <Button
              type="button"
              onClick={() => {
                setEditingProductIndex(-1);
                setSelectedProduct(null);
                setQuantity(1);
                setProductModalOpen(true);
              }}
              disabled={isOrderCompleted}
            >
              Add Product
            </Button>
          </div>

          <DataTable columns={productColumns} data={orderProducts} />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/my-orders")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isOrderCompleted}>
            Save Order
          </Button>
        </div>
      </form>

      {/* Product Modal */}
      <Modal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        title={editingProductIndex >= 0 ? "Edit Product" : "Add Product"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product
            </label>
            <select
              value={selectedProduct || ""}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {formatCurrency(product.unitPrice)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setProductModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleProductSubmit}
              disabled={!selectedProduct}
            >
              {editingProductIndex >= 0 ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteProduct}
        title="Remove Product"
        message="Are you sure you want to remove this product from the order?"
      />

      <ConnectionStatus />
    </div>
  );
}
