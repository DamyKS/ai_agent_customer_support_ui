import api from "./api"
import { API_CONFIG } from "../config/api"

export const conversationService = {
  // Get all conversations
  getConversations: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.CONVERSATIONS.LIST)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch conversations",
      }
    }
  },

  // Get messages for a specific conversation
  getConversationMessages: async (conversationId) => {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.CONVERSATIONS.DETAIL}${conversationId}/`)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch conversation messages",
      }
    }
  },
}
