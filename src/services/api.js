import axios from "axios"
import { API_CONFIG } from "../config/api"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true, // This ensures cookies are sent with requests
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to handle authentication
api.interceptors.request.use(
  (config) => {
    // The JWT token is automatically sent via cookies, so no need to manually add headers
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default api
