import axios from "axios";

// Create axios instance with base URL
let baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
if (baseURL && !baseURL.startsWith("http://") && !baseURL.startsWith("https://")) {
  baseURL = `https://${baseURL}/api`;
} else if (baseURL && !baseURL.endsWith("/api")) {
  baseURL = baseURL.endsWith("/") ? `${baseURL}api` : `${baseURL}/api`;
}

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // User is not authorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default api;

