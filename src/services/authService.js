import api from "./api"
import { API_CONFIG } from "../config/api"

export const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      })
      return { success: true, user: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.error || "Login failed",
      }
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData)
      return { success: true, user: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || "Registration failed",
      }
    }
  },

  // Logout user
  logout: async () => {
    try {
      await api.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Logout failed",
      }
    }
  },

  // Get current user - Updated to use correct endpoint
  getCurrentUser: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.ACCOUNTS.ME)
      return { success: true, user: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to get user data",
      }
    }
  },

  // Password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.PASSWORD_RESET, { email })
      return { success: true, message: response.data.message }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Password reset request failed",
      }
    }
  },

  // Password reset confirm
  confirmPasswordReset: async (email, token, newPassword) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM, {
        email,
        token,
        new_password: newPassword,
      })
      return { success: true, message: response.data.message }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Password reset failed",
      }
    }
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await api.put(API_CONFIG.ENDPOINTS.AUTH.PASSWORD_CHANGE, {
        old_password: oldPassword,
        new_password: newPassword,
      })
      return { success: true, message: response.data.message }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Password change failed",
      }
    }
  },
}
