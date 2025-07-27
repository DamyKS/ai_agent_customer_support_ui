// API Configuration
export const API_CONFIG = {
  BASE_URL: "http://127.0.0.1:8000",
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
  },
}

export const getApiUrl = (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`
