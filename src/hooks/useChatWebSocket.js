"use client"

import { useCallback, useEffect, useState } from "react"
import { useWebSocket } from "./useWebSocket"

export const useChatWebSocket = (conversationId) => {
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState("disconnected")

  // Construct the WebSocket endpoint path (not full URL)
  const wsEndpoint = conversationId ? `/ws/admin/chat/${conversationId}/` : null

  const handleMessage = useCallback((data) => {
    console.log("Received WebSocket message:", data)

    switch (data.type) {
      case "chat_message":
        const newMessage = {
          id: data.id || Date.now(),
          text_content: data.message,
          sender_type: data.sender_type,
          timestamp: data.timestamp || new Date().toISOString(),
          // Map sender types for display
          customer: data.sender_type === "customer" ? { name: "Customer" } : null,
          sender_user: data.sender_type === "admin" ? { full_name: "Admin" } : null,
        }

        setMessages((prev) => {
          // Avoid duplicates
          const exists = prev.some((msg) => msg.id === newMessage.id)
          if (exists) return prev

          // Add new message and sort by timestamp
          const updated = [...prev, newMessage].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          return updated
        })

        // Hide typing indicator when receiving a message
        if (data.sender_type !== "admin") {
          setIsTyping(false)
        }
        break

      case "message_history":
        if (data.messages && Array.isArray(data.messages)) {
          const historyMessages = data.messages.map((msg) => ({
            id: msg.id || `history-${Date.now()}-${Math.random()}`,
            text_content: msg.message,
            sender_type: msg.sender_type,
            timestamp: msg.timestamp,
            customer: msg.sender_type === "customer" ? { name: "Customer" } : null,
            sender_user: msg.sender_type === "admin" ? { full_name: "Admin" } : null,
          }))

          setMessages((prev) => {
            // Merge with existing messages, avoiding duplicates
            const combined = [...prev, ...historyMessages]
            const unique = combined.filter((msg, index, arr) => arr.findIndex((m) => m.id === msg.id) === index)
            return unique.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          })
        }
        break

      case "typing_indicator":
        setIsTyping(data.is_typing && data.sender_type !== "admin")
        break

      default:
        console.log("Unknown message type:", data.type)
    }
  }, [])

  const handleOpen = useCallback(() => {
    console.log("Chat WebSocket connected")
    setConnectionStatus("connected")
  }, [])

  const handleClose = useCallback(() => {
    console.log("Chat WebSocket disconnected")
    setConnectionStatus("disconnected")
    setIsTyping(false)
  }, [])

  const handleError = useCallback((error) => {
    console.error("Chat WebSocket error:", error)
    setConnectionStatus("error")
    setIsTyping(false)
  }, [])

  const { isConnected, sendMessage, error } = useWebSocket(wsEndpoint, {
    onMessage: handleMessage,
    onOpen: handleOpen,
    onClose: handleClose,
    onError: handleError,
    maxReconnectAttempts: 3, // Reduce reconnection attempts
    reconnectInterval: 5000, // Increase interval between attempts
  })

  // Update connection status based on isConnected
  useEffect(() => {
    if (isConnected) {
      setConnectionStatus("connected")
    } else if (error) {
      setConnectionStatus("error")
    } else {
      setConnectionStatus("disconnected")
    }
  }, [isConnected, error])

  const sendChatMessage = useCallback(
    (message) => {
      if (!isConnected || !message.trim()) {
        console.warn("Cannot send message: not connected or empty message")
        return
      }

      const messageData = {
        type: "chat_message",
        message: message.trim(),
        sender_type: "admin",
        timestamp: new Date().toISOString(),
      }

      // Optimistic update - add message immediately
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        text_content: message.trim(),
        sender_type: "admin",
        timestamp: new Date().toISOString(),
        sender_user: { full_name: "Admin" },
      }

      setMessages((prev) => [...prev, optimisticMessage])

      sendMessage(messageData)
    },
    [isConnected, sendMessage],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  // Clear messages when conversation changes
  useEffect(() => {
    if (conversationId) {
      setMessages([])
      setIsTyping(false)
    }
  }, [conversationId])

  return {
    messages,
    isTyping,
    connectionStatus,
    isConnected,
    sendMessage: sendChatMessage,
    clearMessages,
    error,
  }
}
