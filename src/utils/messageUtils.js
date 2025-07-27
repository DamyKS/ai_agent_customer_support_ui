// Get sender display name based on sender type and data
export const getSenderDisplayName = (message) => {
  switch (message.sender_type) {
    case "customer":
      return `Customer: ${message.customer?.name || "Unknown"}`
    case "ai_agent":
      return `AI Agent: ${message.sender_ai_agent || "Unknown"}`
    case "human_agent":
      return `Human Agent: ${message.sender_user?.full_name || message.sender_user?.username || "Unknown"}`
    case "system":
      return "System"
    default:
      return message.sender_type.charAt(0).toUpperCase() + message.sender_type.slice(1)
  }
}

// Get sender short name for avatar
export const getSenderShortName = (message) => {
  switch (message.sender_type) {
    case "customer":
      return (
        message.customer?.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase() || "C"
      )
    case "ai_agent":
      return "AI"
    case "human_agent":
      return (
        message.sender_user?.full_name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase() || "H"
      )
    case "system":
      return "S"
    default:
      return "U"
  }
}

// Check if message is from customer (left side)
export const isCustomerMessage = (message) => {
  return message.sender_type === "customer"
}

// Format message timestamp
export const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

// Get message status indicator
export const getMessageStatus = (message) => {
  if (message.is_read) {
    return "read"
  }
  return "unread"
}
