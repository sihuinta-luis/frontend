import { create } from "zustand";
import { productsApi } from "../services/api";

// Fallback data for when API is not available
export const fallbackProducts = [
  { id: "1", name: "Hamburger Classic", unitPrice: 10 },
  { id: "2", name: "French Fries", unitPrice: 5 },
  { id: "3", name: "Cheeseburger", unitPrice: 12 },
  { id: "4", name: "Chicken Burger", unitPrice: 11 },
  { id: "5", name: "Soda", unitPrice: 3 },
];

const useProductStore = create((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  isOfflineMode: false,

  // Fetch products
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await productsApi.getAll();
      console.log("Products fetched:", response);
      set({ products: response, isLoading: false, isOfflineMode: false });
    } catch (error) {
      console.error("Failed to fetch products:", error);

      // If network error, use fallback data
      if (error.code === "ERR_NETWORK") {
        console.warn("Using fallback product data due to network error");
        set({
          products: fallbackProducts,
          isLoading: false,
          error: "Cannot connect to server. Using offline data.",
          isOfflineMode: true,
        });
      } else {
        set({ error: "Failed to fetch products", isLoading: false });
      }
    }
  },

  // Add new product
  addProduct: async (product) => {
    set({ isLoading: true, error: null });
    try {
      // Check if in offline mode
      if (get().isOfflineMode) {
        const newProduct = {
          ...product,
          id: Date.now().toString(),
        };

        set((state) => ({
          products: [...state.products, newProduct],
          isLoading: false,
        }));

        return newProduct;
      }

      const response = await productsApi.create(product);
      set((state) => ({
        products: [...state.products, response],
        isLoading: false,
      }));
      return response;
    } catch (error) {
      console.error("Failed to add product:", error);
      set({ error: "Failed to add product", isLoading: false });
      throw error;
    }
  },

  // Update existing product
  updateProduct: async (updatedProduct) => {
    set({ isLoading: true, error: null });
    try {
      // Check if in offline mode
      if (get().isOfflineMode) {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === updatedProduct.id ? updatedProduct : product
          ),
          isLoading: false,
        }));

        return updatedProduct;
      }

      const response = await productsApi.update(
        updatedProduct.id,
        updatedProduct
      );
      set((state) => ({
        products: state.products.map((product) =>
          product.id === updatedProduct.id ? response : product
        ),
        isLoading: false,
      }));
      return response;
    } catch (error) {
      console.error("Failed to update product:", error);
      set({ error: "Failed to update product", isLoading: false });
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      // Check if in offline mode
      if (get().isOfflineMode) {
        set((state) => ({
          products: state.products.filter(
            (product) => product.id !== productId
          ),
          isLoading: false,
        }));
        return;
      }

      await productsApi.delete(productId);
      set((state) => ({
        products: state.products.filter((product) => product.id !== productId),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Failed to delete product:", error);
      set({ error: "Failed to delete product", isLoading: false });
      throw error;
    }
  },

  // Get product by ID
  getProductById: (productId) => {
    return (
      get().products.find((product) => product.id.toString() === productId) ||
      null
    );
  },
}));

export default useProductStore;
