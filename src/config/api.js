// API Configuration
export const API_CONFIG = {
  BASE_URL: "http://127.0.0.1:8000",
  WS_BASE_URL: "ws://127.0.0.1:8000", // Keep for reference but not used anymore
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/api/v1/auth/login",
      REGISTER: "/api/v1/auth/register",
      LOGOUT: "/api/v1/auth/logout",
      ME: "/api/v1/accounts/me/", // Updated to correct endpoint
      PASSWORD_RESET: "/api/v1/auth/password/reset",
      PASSWORD_RESET_CONFIRM: "/api/v1/auth/password/reset/confirm",
      PASSWORD_CHANGE: "/api/v1/auth/password/change",
    },
    ACCOUNTS: {
      ME: "/api/v1/accounts/me/",
      CREATE_CUSTOMER: "/api/v1/accounts/customers/create/",
    },
    CONVERSATIONS: {
      LIST: "/api/v1/conversations/",
      DETAIL: "/api/v1/conversations/", // Will append conversation_id
    },
    KNOWLEDGE_BASE: {
      LIST: "/api/v1/knowledge_base/articles/list/",
      CREATE: "/api/v1/knowledge_base/articles/create/",
      DETAIL: "/api/v1/knowledge_base/articles/", // Will append article ID
    },
  },
}

export const getApiUrl = (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`

// Deprecated - WebSocket URL construction is now handled in useWebSocket hook
export const getWebSocketUrl = (endpoint) => {
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:"
  const wsHost = "127.0.0.1:8000"
  return `${wsProtocol}//${wsHost}${endpoint}`
}
