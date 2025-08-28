"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export const useWebSocket = (url, options = {}) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(null)
  const [lastMessage, setLastMessage] = useState(null)
  const messageQueue = useRef([])
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = options.maxReconnectAttempts || 5
  const reconnectInterval = options.reconnectInterval || 3000
  const isConnecting = useRef(false)

  const connect = useCallback(() => {
    // Prevent multiple simultaneous connection attempts
    if (socket?.readyState === WebSocket.OPEN || isConnecting.current) {
      return
    }

    if (!url) {
      console.warn("WebSocket URL is null or undefined")
      return
    }

    isConnecting.current = true

    try {
      // Construct WebSocket URL exactly like the customer widget
      const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws"
      const wsHost = "127.0.0.1:8000" // Your Django backend host
      const wsUrl = `${wsProtocol}://${wsHost}${url}`

      console.log("Connecting to WebSocket:", wsUrl)
      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log("WebSocket connected")
        setIsConnected(true)
        setError(null)
        reconnectAttempts.current = 0
        isConnecting.current = false

        // Send queued messages
        while (messageQueue.current.length > 0) {
          const message = messageQueue.current.shift()
          ws.send(message)
        }

        if (options.onOpen) {
          options.onOpen()
        }
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastMessage(data)

          if (options.onMessage) {
            options.onMessage(data)
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err)
        }
      }

      ws.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason)
        setIsConnected(false)
        setSocket(null)
        isConnecting.current = false

        if (options.onClose) {
          options.onClose(event)
        }

        // Only attempt to reconnect if it wasn't a manual close and we haven't exceeded max attempts
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++
          console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`)

          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          console.error("Max reconnection attempts reached")
          setError(new Error("Connection failed after maximum retry attempts"))
        }
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        setError(error)
        isConnecting.current = false

        if (options.onError) {
          options.onError(error)
        }
      }

      setSocket(ws)
    } catch (err) {
      console.error("Failed to create WebSocket connection:", err)
      setError(err)
      isConnecting.current = false
    }
  }, [url, options, maxReconnectAttempts, reconnectInterval])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close(1000, "Manual disconnect")
    }

    setSocket(null)
    setIsConnected(false)
    isConnecting.current = false
  }, [socket])

  const sendMessage = useCallback(
    (message) => {
      const messageStr = typeof message === "string" ? message : JSON.stringify(message)

      if (socket?.readyState === WebSocket.OPEN) {
        socket.send(messageStr)
      } else {
        // Queue message for when connection is established
        messageQueue.current.push(messageStr)

        // Try to connect if not connected and not already connecting
        if (!socket && !isConnecting.current) {
          connect()
        }
      }
    },
    [socket, connect],
  )

  useEffect(() => {
    if (url && !socket && !isConnecting.current) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [url]) // Only depend on url, not connect/disconnect to prevent loops

  return {
    socket,
    isConnected,
    error,
    lastMessage,
    sendMessage,
    connect,
    disconnect,
  }
}
