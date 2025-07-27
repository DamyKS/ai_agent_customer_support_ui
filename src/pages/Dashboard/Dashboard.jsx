import { Users, MessageSquare, Bot, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const stats = [
  {
    title: "Total Chats",
    value: "2,847",
    change: "+12%",
    icon: MessageSquare,
    trend: "up",
  },
  {
    title: "Active Users",
    value: "1,234",
    change: "+5%",
    icon: Users,
    trend: "up",
  },
  {
    title: "AI Agents",
    value: "8",
    change: "2 offline",
    icon: Bot,
    trend: "warning",
  },
  {
    title: "Resolution Rate",
    value: "94%",
    change: "+2%",
    icon: TrendingUp,
    trend: "up",
  },
]

const recentActivity = [
  {
    id: 1,
    type: "chat",
    message: "New chat assigned to Agent-001",
    time: "2 minutes ago",
    status: "active",
  },
  {
    id: 2,
    type: "agent",
    message: "Agent-003 went offline",
    time: "5 minutes ago",
    status: "warning",
  },
  {
    id: 3,
    type: "knowledge",
    message: "Knowledge base article updated",
    time: "10 minutes ago",
    status: "success",
  },
  {
    id: 4,
    type: "user",
    message: "New support agent registered",
    time: "15 minutes ago",
    status: "success",
  },
]

const agentStatus = [
  { name: "Agent-001", status: "online", chats: 12, efficiency: 95 },
  { name: "Agent-002", status: "online", chats: 8, efficiency: 87 },
  { name: "Agent-003", status: "offline", chats: 0, efficiency: 92 },
  { name: "Agent-004", status: "online", chats: 15, efficiency: 98 },
  { name: "Agent-005", status: "busy", chats: 20, efficiency: 89 },
]

export function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your AI support platform.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.trend === "up"
                    ? "text-green-600"
                    : stat.trend === "warning"
                      ? "text-yellow-600"
                      : "text-muted-foreground"
                }`}
              >
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events and updates from your platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      activity.status === "active"
                        ? "bg-blue-500"
                        : activity.status === "success"
                          ? "bg-green-500"
                          : activity.status === "warning"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Status */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>AI Agent Status</CardTitle>
            <CardDescription>Current status and performance of your AI agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agentStatus.map((agent) => (
                <div key={agent.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        agent.status === "online" ? "default" : agent.status === "busy" ? "secondary" : "outline"
                      }
                    >
                      {agent.status}
                    </Badge>
                    <span className="text-sm font-medium">{agent.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{agent.chats} chats</p>
                    <div className="flex items-center gap-2">
                      <Progress value={agent.efficiency} className="w-16 h-2" />
                      <span className="text-xs text-muted-foreground">{agent.efficiency}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
