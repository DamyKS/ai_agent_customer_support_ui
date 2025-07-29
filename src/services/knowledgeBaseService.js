import api from "./api"
import { API_CONFIG } from "../config/api"

export const knowledgeBaseService = {
  // Get all articles
  getArticles: async () => {
    try {
      const response = await api.get(API_CONFIG.ENDPOINTS.KNOWLEDGE_BASE.LIST)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch articles",
      }
    }
  },

  // Get single article
  getArticle: async (articleId) => {
    try {
      const response = await api.get(`${API_CONFIG.ENDPOINTS.KNOWLEDGE_BASE.DETAIL}${articleId}/`)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch article",
      }
    }
  },

  // Create new article
  createArticle: async (articleData) => {
    try {
      const response = await api.post(API_CONFIG.ENDPOINTS.KNOWLEDGE_BASE.CREATE, articleData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || "Failed to create article",
      }
    }
  },

  // Update article
  updateArticle: async (articleId, articleData) => {
    try {
      const response = await api.patch(`${API_CONFIG.ENDPOINTS.KNOWLEDGE_BASE.DETAIL}${articleId}/`, articleData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || "Failed to update article",
      }
    }
  },

  // Delete article
  deleteArticle: async (articleId) => {
    try {
      await api.delete(`${API_CONFIG.ENDPOINTS.KNOWLEDGE_BASE.DETAIL}${articleId}/`)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to delete article",
      }
    }
  },
}
