"use client"

import { useState, useEffect, useRef } from "react"
import {
  Search,
  Filter,
  MoreHorizontal,
  MessageSquare,
  Loader2,
  AlertCircle,
  Check,
  CheckCheck,
  Wifi,
  WifiOff,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { conversationService } from "../../services/conversationService"
import { formatTimeAgo } from "../../utils/dateUtils"
import { useChatWebSocket } from "../../hooks/useChatWebSocket"
import {
  getSenderDisplayName,
  getSenderShortName,
  isCustomerMessage,
  formatMessageTime,
  getMessageStatus,
} from "../../utils/messageUtils"

export default function Chats() {
  const [conversations, setConversations] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [error, setError] = useState("")
  const [messagesError, setMessagesError] = useState("")
  const [newMessage, setNewMessage] = useState("")

  // Store additional conversation data for later use
  const [conversationMetadata, setConversationMetadata] = useState({})

  // WebSocket hook for real-time chat
  const {
    messages: wsMessages,
    isTyping,
    connectionStatus,
    isConnected,
    sendMessage: sendWSMessage,
    clearMessages,
  } = useChatWebSocket(selectedChat?.id)

  // Combine WebSocket messages with fetched messages
  const [fetchedMessages, setFetchedMessages] = useState([])
  const [allMessages, setAllMessages] = useState([])

  // Add this after the existing state declarations
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id)
    }
  }, [selectedChat])

  // Combine fetched messages with WebSocket messages
  useEffect(() => {
    // Merge fetched messages with WebSocket messages, avoiding duplicates
    const messageMap = new Map()

    // Add fetched messages first
    fetchedMessages.forEach((msg) => {
      messageMap.set(msg.id, msg)
    })

    // Add WebSocket messages (they might override fetched ones or add new ones)
    wsMessages.forEach((msg) => {
      messageMap.set(msg.id, msg)
    })

    // Convert back to array and sort by timestamp
    const combined = Array.from(messageMap.values()).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

    setAllMessages(combined)
  }, [fetchedMessages, wsMessages])

  // Add this useEffect after the existing useEffect hooks
  useEffect(() => {
    // Scroll to bottom when messages are loaded or updated
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [allMessages])

  const fetchConversations = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await conversationService.getConversations()
      if (result.success) {
        setConversations(result.data)

        // Store metadata for each conversation
        const metadata = {}
        result.data.forEach((conv) => {
          metadata[conv.id] = {
            chat_group_name: conv.chat_group_name,
            channel: conv.channel,
            escalation_reason: conv.escalation_reason,
            started_at: conv.started_at,
            closed_at: conv.closed_at,
            assigned_to: conv.assigned_to,
          }
        })
        setConversationMetadata(metadata)

        // Set first conversation as selected if available
        if (result.data.length > 0) {
          setSelectedChat(result.data[0])
        }
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError("Failed to load conversations")
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId) => {
    setMessagesLoading(true)
    setMessagesError("")

    try {
      const result = await conversationService.getConversationMessages(conversationId)
      if (result.success) {
        setFetchedMessages(result.data)
      } else {
        setMessagesError(result.error)
        setFetchedMessages([])
      }
    } catch (error) {
      setMessagesError("Failed to load messages")
      setFetchedMessages([])
    } finally {
      setMessagesLoading(false)
    }
  }

  const handleChatSelect = (chat) => {
    setSelectedChat(chat)
    setFetchedMessages([]) // Clear previous messages while loading new ones
    clearMessages() // Clear WebSocket messages
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChat) return

    try {
      // Send via WebSocket
      sendWSMessage(newMessage)
      setNewMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
      setMessagesError("Failed to send message")
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e)
    }
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "open":
        return "default"
      case "pending":
        return "secondary"
      case "ai_handling":
        return "default"
      case "human":
        return "secondary"
      case "closed":
        return "outline"
      case "resolved":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "ai_handling":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "human":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "resolved":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusDisplayName = (status) => {
    switch (status) {
      case "open":
        return "Open"
      case "pending":
        return "Pending Response"
      case "ai_handling":
        return "AI Handling"
      case "human":
        return "Human Agent"
      case "closed":
        return "Closed"
      case "resolved":
        return "Resolved"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  const getChannelDisplayName = (channel) => {
    switch (channel) {
      case "web_chat":
        return "Web Chat"
      case "email":
        return "Email"
      case "facebook":
        return "Facebook"
      case "whatsapp":
        return "WhatsApp"
      case "api":
        return "API"
      default:
        return channel.charAt(0).toUpperCase() + channel.slice(1)
    }
  }

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="h-4 w-4 text-green-600" />
      case "error":
        return <WifiOff className="h-4 w-4 text-red-600" />
      default:
        return <WifiOff className="h-4 w-4 text-gray-400" />
    }
  }

  const filteredChats = conversations.filter(
    (chat) =>
      chat.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (chat.customer.email && chat.customer.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chats</h1>
            <p className="text-muted-foreground">Manage customer conversations and support tickets</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading conversations...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chats</h1>
          <p className="text-muted-foreground">Manage customer conversations and support tickets</p>
        </div>
        <Button>
          <MessageSquare className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {/* Chat List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Conversations ({conversations.length})</CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search chats..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" onClick={fetchConversations}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 h-[calc(100vh-12rem)] overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto">
              {filteredChats.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  {searchTerm ? "No conversations match your search" : "No conversations found"}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 ${
                        selectedChat?.id === chat.id ? "bg-muted" : ""
                      }`}
                      onClick={() => handleChatSelect(chat)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={chat.customer.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {chat.customer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">{chat.customer.name}</p>
                          <Badge
                            variant={getStatusVariant(chat.status)}
                            className={`text-xs ${getStatusColor(chat.status)}`}
                          >
                            {getStatusDisplayName(chat.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{chat.subject}</p>
                        <p className="text-xs text-muted-foreground truncate">{chat.last_message}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(chat.last_activity)}</span>
                          <div className="flex items-center gap-1">
                            {chat.current_ai_agent && (
                              <Badge variant="outline" className="text-xs">
                                AI: {chat.current_ai_agent}
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {getChannelDisplayName(conversationMetadata[chat.id]?.channel || chat.channel)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Detail */}
        <Card className="md:col-span-2 flex flex-col h-[calc(100vh-12rem)]">
          {selectedChat ? (
            <>
              <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selectedChat.customer.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {selectedChat.customer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{selectedChat.customer.name}</CardTitle>
                      <CardDescription>
                        {selectedChat.subject}
                        {selectedChat.customer.email && (
                          <span className="block text-xs">{selectedChat.customer.email}</span>
                        )}
                        <span className="block text-xs">
                          Started: {formatTimeAgo(selectedChat.started_at)} via{" "}
                          {getChannelDisplayName(
                            conversationMetadata[selectedChat.id]?.channel || selectedChat.channel,
                          )}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      {getConnectionStatusIcon()}
                      <span className="text-xs text-muted-foreground">
                        {connectionStatus === "connected" ? "Live" : "Offline"}
                      </span>
                    </div>
                    <Badge
                      variant={getStatusVariant(selectedChat.status)}
                      className={getStatusColor(selectedChat.status)}
                    >
                      {getStatusDisplayName(selectedChat.status)}
                    </Badge>
                    {selectedChat.current_ai_agent && (
                      <Badge variant="secondary">AI: {selectedChat.current_ai_agent}</Badge>
                    )}
                    {conversationMetadata[selectedChat.id]?.assigned_to && (
                      <Badge variant="outline">
                        Assigned:{" "}
                        {conversationMetadata[selectedChat.id].assigned_to.full_name ||
                          conversationMetadata[selectedChat.id].assigned_to.username}
                      </Badge>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Assign Human Agent</DropdownMenuItem>
                        <DropdownMenuItem>Change Status</DropdownMenuItem>
                        <DropdownMenuItem>Escalate to Human</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                        <DropdownMenuItem>Close Conversation</DropdownMenuItem>
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {conversationMetadata[selectedChat.id]?.escalation_reason && (
                  <div className="mt-2">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Escalation Reason:</strong> {conversationMetadata[selectedChat.id].escalation_reason}
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col overflow-hidden">
                {messagesError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{messagesError}</AlertDescription>
                  </Alert>
                )}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Loading messages...</span>
                      </div>
                    </div>
                  ) : allMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-sm text-muted-foreground">No messages in this conversation</p>
                    </div>
                  ) : (
                    allMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${isCustomerMessage(message) ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`flex gap-2 max-w-[80%] ${isCustomerMessage(message) ? "" : "flex-row-reverse"}`}
                        >
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage
                              src={
                                message.customer?.avatar ||
                                message.sender_user?.avatar ||
                                "/placeholder.svg?height=32&width=32" ||
                                "/placeholder.svg"
                              }
                            />
                            <AvatarFallback className="text-xs">{getSenderShortName(message)}</AvatarFallback>
                          </Avatar>
                          <div className={`flex flex-col ${isCustomerMessage(message) ? "items-start" : "items-end"}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium">{getSenderDisplayName(message)}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatMessageTime(message.timestamp)}
                              </span>
                            </div>
                            <div
                              className={`rounded-lg px-4 py-2 ${
                                isCustomerMessage(message)
                                  ? "bg-muted text-foreground"
                                  : "bg-primary text-primary-foreground"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.text_content}</p>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {!isCustomerMessage(message) && getMessageStatus(message) === "sent" && (
                                <Check className="h-3 w-3 text-muted-foreground" />
                              )}
                              {!isCustomerMessage(message) && getMessageStatus(message) === "read" && (
                                <CheckCheck className="h-3 w-3 text-blue-600" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex gap-2 max-w-[80%]">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={selectedChat.customer.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {selectedChat.customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg px-4 py-2">
                          <div className="flex gap-1">
                            <span
                              className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            />
                            <span
                              className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            />
                            <span
                              className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <Separator className="my-4" />
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!isConnected}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={!isConnected || !newMessage.trim()}>
                    Send
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to view messages</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
