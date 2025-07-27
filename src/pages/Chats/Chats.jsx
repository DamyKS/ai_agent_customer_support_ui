"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Filter, MoreHorizontal, MessageSquare, Loader2, AlertCircle, Check, CheckCheck } from "lucide-react"
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
import {
  getSenderDisplayName,
  getSenderShortName,
  isCustomerMessage,
  formatMessageTime,
  getMessageStatus,
} from "../../utils/messageUtils"

export function Chats() {
  const [conversations, setConversations] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [error, setError] = useState("")
  const [messagesError, setMessagesError] = useState("")

  // Store additional conversation data for later use
  const [conversationMetadata, setConversationMetadata] = useState({})

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

  // Add this useEffect after the existing useEffect hooks
  useEffect(() => {
    // Scroll to bottom when messages are loaded or updated
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

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
        setMessages(result.data)
      } else {
        setMessagesError(result.error)
        setMessages([])
      }
    } catch (error) {
      setMessagesError("Failed to load messages")
      setMessages([])
    } finally {
      setMessagesLoading(false)
    }
  }

  const handleChatSelect = (chat) => {
    setSelectedChat(chat)
    setMessages([]) // Clear previous messages while loading new ones
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
        <Card className="md:col-span-2 flex flex-col h-[calc(100vh-4rem)]">
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
                  ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-sm text-muted-foreground">No messages in this conversation</p>
                    </div>
                  ) : (
                    messages.map((message) => (
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
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
                            />
                            <AvatarFallback className="text-xs">{getSenderShortName(message)}</AvatarFallback>
                          </Avatar>
                          <div className={`flex flex-col ${isCustomerMessage(message) ? "items-start" : "items-end"}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-muted-foreground">
                                {getSenderDisplayName(message)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatMessageTime(message.timestamp)}
                              </span>
                            </div>
                            <div
                              className={`rounded-lg p-3 ${
                                isCustomerMessage(message)
                                  ? "bg-muted text-foreground"
                                  : "bg-primary text-primary-foreground"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.text_content}</p>
                              <div className="flex items-center justify-end mt-1 gap-1">
                                {getMessageStatus(message) === "read" ? (
                                  <CheckCheck className="h-3 w-3 opacity-60" />
                                ) : (
                                  <Check className="h-3 w-3 opacity-60" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  {/* Add this div for auto-scroll reference */}
                  <div ref={messagesEndRef} />
                </div>
                <Separator className="mb-4" />
                <div className="flex gap-2 flex-shrink-0">
                  <Input placeholder="Type your message..." className="flex-1" />
                  <Button>Send</Button>
                </div>
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
