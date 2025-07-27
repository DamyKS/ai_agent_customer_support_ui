"use client"

import { useState } from "react"
import { Search, Plus, MoreHorizontal, Bot, Activity, Zap, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

const agents = [
  {
    id: 1,
    name: "Agent-001",
    model: "GPT-4",
    status: "online",
    chatsActive: 12,
    totalChats: 1247,
    efficiency: 95,
    responseTime: "1.2s",
    lastActive: "now",
    specialization: "General Support",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "Agent-002",
    model: "GPT-3.5 Turbo",
    status: "online",
    chatsActive: 8,
    totalChats: 892,
    efficiency: 87,
    responseTime: "0.8s",
    lastActive: "2 minutes ago",
    specialization: "Technical Support",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Agent-003",
    model: "Claude-3",
    status: "offline",
    chatsActive: 0,
    totalChats: 654,
    efficiency: 92,
    responseTime: "1.5s",
    lastActive: "1 hour ago",
    specialization: "Billing Support",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    name: "Agent-004",
    model: "GPT-4",
    status: "online",
    chatsActive: 15,
    totalChats: 1456,
    efficiency: 98,
    responseTime: "1.1s",
    lastActive: "now",
    specialization: "Product Support",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 5,
    name: "Agent-005",
    model: "GPT-3.5 Turbo",
    status: "busy",
    chatsActive: 20,
    totalChats: 2103,
    efficiency: 89,
    responseTime: "2.1s",
    lastActive: "now",
    specialization: "General Support",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

const models = ["GPT-4", "GPT-3.5 Turbo", "Claude-3", "Gemini Pro"]
const specializations = ["General Support", "Technical Support", "Billing Support", "Product Support"]

export function Agents() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.model.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    total: agents.length,
    online: agents.filter((a) => a.status === "online").length,
    busy: agents.filter((a) => a.status === "busy").length,
    offline: agents.filter((a) => a.status === "offline").length,
    activeChats: agents.reduce((sum, agent) => sum + agent.chatsActive, 0),
    avgEfficiency: Math.round(agents.reduce((sum, agent) => sum + agent.efficiency, 0) / agents.length),
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Agents</h1>
          <p className="text-muted-foreground">Monitor and manage your AI support agents</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New AI Agent</DialogTitle>
              <DialogDescription>Configure a new AI agent for customer support</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="agentName">Agent Name</Label>
                <Input id="agentName" placeholder="e.g., Agent-006" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">AI Model</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((model) => (
                      <SelectItem key={model} value={model.toLowerCase().replace(/[^a-z0-9]/g, "-")}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec.toLowerCase().replace(/\s+/g, "-")}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                  id="systemPrompt"
                  placeholder="Enter the system prompt for this agent..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Create Agent</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">AI assistants</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.online}</div>
            <p className="text-xs text-muted-foreground">Ready to help</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Busy</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.busy}</div>
            <p className="text-xs text-muted-foreground">Handling chats</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.offline}</div>
            <p className="text-xs text-muted-foreground">Not responding</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeChats}</div>
            <p className="text-xs text-muted-foreground">Currently handling</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Efficiency</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgEfficiency}%</div>
            <p className="text-xs text-muted-foreground">Performance score</p>
          </CardContent>
        </Card>
      </div>

      {/* Agents Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>AI Agents</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                className="pl-8 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active Chats</TableHead>
                <TableHead>Total Chats</TableHead>
                <TableHead>Efficiency</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={agent.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-muted-foreground">{agent.lastActive}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{agent.model}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        agent.status === "online" ? "default" : agent.status === "busy" ? "secondary" : "outline"
                      }
                      className={
                        agent.status === "online"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : agent.status === "busy"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-red-100 text-red-800 border-red-200"
                      }
                    >
                      {agent.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{agent.chatsActive}</TableCell>
                  <TableCell>{agent.totalChats.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={agent.efficiency} className="w-16 h-2" />
                      <span className="text-sm font-medium">{agent.efficiency}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{agent.responseTime}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{agent.specialization}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Configuration</DropdownMenuItem>
                        <DropdownMenuItem>View Chat History</DropdownMenuItem>
                        <DropdownMenuItem>Restart Agent</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
