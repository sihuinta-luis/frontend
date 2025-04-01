import { create } from "zustand";
import { ordersApi } from "../services/api";

const useOrderStore = create((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,
  isOfflineMode: false,

  // Fetch orders
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersApi.getAll();
      console.log("Orders fetched:", response);
      set({ orders: response, isLoading: false, isOfflineMode: false });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      set({ 
        error: "Failed to fetch orders", 
        isLoading: false,
        isOfflineMode: true 
      });
    }
  },

  // Add new order
  addOrder: async (order) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersApi.create(order);
      set((state) => ({
        orders: [...state.orders, response],
        isLoading: false,
      }));
      return response;
    } catch (error) {
      console.error("Failed to add order:", error);
      set({ error: "Failed to add order", isLoading: false });
      throw error;
    }
  },

  // Update existing order
  updateOrder: async (updatedOrder) => {
    set({ isLoading: true, error: null });
    try {
      const response = await ordersApi.update(updatedOrder.id, updatedOrder);
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === updatedOrder.id ? response : order
        ),
        isLoading: false,
      }));
      return response;
    } catch (error) {
      console.error("Failed to update order:", error);
      set({ error: "Failed to update order", isLoading: false });
      throw error;
    }
  },

  // Delete order
  deleteOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      await ordersApi.delete(orderId);
      set((state) => ({
        orders: state.orders.filter((order) => order.id !== orderId),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to delete order:", error);
      set({ error: "Failed to delete order", isLoading: false });
      throw error;
    }
  },

  // Get order by ID
  getOrderById: (orderId) => {
    return (
      get().orders.find((order) => order.id.toString() === orderId) || null
    );
  },
}));

export default useOrderStore;
