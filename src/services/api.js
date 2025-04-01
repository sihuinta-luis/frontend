import axios from "axios";
import config from "../config";
import { fallbackOrders } from "../mocks/ordersMock";
import { fallbackProducts } from "../mocks/productsMock";

// Create axios instance with default config
const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("API URL:", api.defaults.baseURL);
console.log("Using mock data:", config.useMockData);

// Mock API functions
const mockOrdersApi = {
  getAll: () => Promise.resolve([...fallbackOrders]),
  getById: (id) =>
    Promise.resolve(
      fallbackOrders.find((order) => order.id.toString() === id.toString())
    ),
  create: (data) => {
    const newOrder = {
      ...data,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      productCount: data.products.length,
      finalPrice: data.products.reduce((sum, item) => {
        const product = fallbackProducts.find(
          (p) => p.id.toString() === item.id.toString()
        );
        return sum + (product ? product.unitPrice * item.quantity : 0);
      }, 0),
    };
    return Promise.resolve(newOrder);
  },
  update: (id, data) => {
    const updatedOrder = {
      ...data,
      id,
      date: new Date().toISOString(),
      productCount: data.products.length,
      finalPrice: data.products.reduce((sum, item) => {
        const product = fallbackProducts.find(
          (p) => p.id.toString() === item.id.toString()
        );
        return sum + (product ? product.unitPrice * item.quantity : 0);
      }, 0),
    };
    return Promise.resolve(updatedOrder);
  },
  delete: (id) => Promise.resolve(),
};

const mockProductsApi = {
  getAll: () => Promise.resolve([...fallbackProducts]),
  getById: (id) =>
    Promise.resolve(
      fallbackProducts.find(
        (product) => product.id.toString() === id.toString()
      )
    ),
  create: (data) => Promise.resolve({ ...data, id: Date.now().toString() }),
  update: (id, data) => Promise.resolve({ ...data, id }),
  delete: (id) => Promise.resolve(),
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if needed
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log the request for debugging
    console.log("API Request:", config.method.toUpperCase(), config.url);

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log("API Response:", response.status, response.config.url);
    return response.data;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error("API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      // No response received
      console.error("Network Error:", error.request);
      // You might want to show a user-friendly message
      if (error.code === "ERR_NETWORK") {
        console.error(
          "Cannot connect to the server. Please check if the backend is running."
        );
      }
    } else {
      // Request setup error
      console.error("Request Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Orders API
export const ordersApi = config.useMockData
  ? mockOrdersApi
  : {
      getAll: () => api.get("/orders"),
      getById: (id) => api.get(`/orders/${id}`),
      create: (data) => api.post("/orders", data),
      update: (id, data) => api.put(`/orders/${id}`, data),
      delete: (id) => api.delete(`/orders/${id}`),
    };

// Products API
export const productsApi = config.useMockData
  ? mockProductsApi
  : {
      getAll: () => api.get("/products"),
      getById: (id) => api.get(`/products/${id}`),
      create: (data) => api.post("/products", data),
      update: (id, data) => api.put(`/products/${id}`, data),
      delete: (id) => api.delete(`/products/${id}`),
    };

export default api;
