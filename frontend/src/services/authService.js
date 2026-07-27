import api from "../utils/api";
import { toast } from "sonner";

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    
    if (response.data && response.data.success) {
      // Don't store credentials - user needs to login separately
      return response.data;
    } else {
      throw new Error("Registration failed");
    }
  } catch (error) {
    console.error("Register error:", error);
    const message = error.response?.data?.message || error.message || "Registration failed. Please check your backend connection.";
    toast.error(message);
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    
    if (response.data.success) {
      // Store token and user info
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data));
      
      toast.success("Login successful!", {
        description: "Welcome back to MediCare+",
      });
      
      return response.data;
    }
  } catch (error) {
    const message = error.response?.data?.message || "Login failed";
    toast.error(message);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  toast.success("Logged out successfully");
};

