"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Users, MessageSquare, Clock, Target, BarChart3, PieChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for analytics
const overviewStats = [
  {
    title: "Total Conversations",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
    icon: MessageSquare,
    description: "vs last month",
  },
  {
    title: "Resolution Rate",
    value: "94.2%",
    change: "+2.1%",
    trend: "up",
    icon: Target,
    description: "vs last month",
  },
  {
    title: "Avg Response Time",
    value: "1.4s",
    change: "-0.3s",
    trend: "up",
    icon: Clock,
    description: "vs last month",
  },
  {
    title: "Customer Satisfaction",
    value: "4.8/5",
    change: "+0.2",
    trend: "up",
    icon: TrendingUp,
    description: "vs last month",
  },
]

const weeklyData = [
  { day: "Mon", chats: 1200, resolved: 1140, satisfaction: 4.7 },
  { day: "Tue", chats: 1350, resolved: 1283, satisfaction: 4.8 },
  { day: "Wed", chats: 1180, resolved: 1121, satisfaction: 4.6 },
  { day: "Thu", chats: 1420, resolved: 1349, satisfaction: 4.9 },
  { day: "Fri", chats: 1680, resolved: 1596, satisfaction: 4.8 },
  { day: "Sat", chats: 980, resolved: 931, satisfaction: 4.7 },
  { day: "Sun", chats: 850, resolved: 808, satisfaction: 4.8 },
]

const topIssues = [
  { category: "Billing Questions", count: 2847, percentage: 28, trend: "+5%" },
  { category: "Technical Support", count: 2156, percentage: 21, trend: "+12%" },
  { category: "Account Issues", count: 1923, percentage: 19, trend: "-3%" },
  { category: "Product Information", count: 1654, percentage: 16, trend: "+8%" },
  { category: "Refund Requests", count: 1234, percentage: 12, trend: "+2%" },
  { category: "Other", count: 456, percentage: 4, trend: "-1%" },
]

const agentPerformance = [
  { name: "Agent-001", chats: 456, resolved: 441, satisfaction: 4.9, efficiency: 96.7 },
  { name: "Agent-002", chats: 389, resolved: 367, satisfaction: 4.7, efficiency: 94.3 },
  { name: "Agent-003", chats: 234, resolved: 218, satisfaction: 4.6, efficiency: 93.2 },
  { name: "Agent-004", chats: 567, resolved: 556, satisfaction: 4.8, efficiency: 98.1 },
  { name: "Agent-005", chats: 445, resolved: 423, satisfaction: 4.7, efficiency: 95.1 },
]

const hourlyDistribution = [
  { hour: "00", chats: 45 },
  { hour: "01", chats: 32 },
  { hour: "02", chats: 28 },
  { hour: "03", chats: 25 },
  { hour: "04", chats: 31 },
  { hour: "05", chats: 42 },
  { hour: "06", chats: 68 },
  { hour: "07", chats: 95 },
  { hour: "08", chats: 142 },
  { hour: "09", chats: 186 },
  { hour: "10", chats: 203 },
  { hour: "11", chats: 198 },
  { hour: "12", chats: 175 },
  { hour: "13", chats: 189 },
  { hour: "14", chats: 167 },
  { hour: "15", chats: 154 },
  { hour: "16", chats: 143 },
  { hour: "17", chats: 128 },
  { hour: "18", chats: 98 },
  { hour: "19", chats: 76 },
  { hour: "20", chats: 65 },
  { hour: "21", chats: 58 },
  { hour: "22", chats: 52 },
  { hour: "23", chats: 48 },
]

export function Analytics() {
  const [timeRange, setTimeRange] = useState("7d")

  const maxHourlyChats = Math.max(...hourlyDistribution.map((h) => h.chats))

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your AI support platform performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span>
                <span className="text-muted-foreground">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Weekly Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Weekly Performance
                </CardTitle>
                <CardDescription>Chat volume and resolution rates over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyData.map((day) => (
                    <div key={day.day} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium w-8">{day.day}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Progress value={(day.chats / 1700) * 100} className="w-24 h-2" />
                            <span className="text-sm text-muted-foreground">{day.chats}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{((day.resolved / day.chats) * 100).toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">resolved</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Hourly Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Hourly Distribution
                </CardTitle>
                <CardDescription>Chat volume throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-2">
                  {hourlyDistribution.map((hour) => (
                    <div key={hour.hour} className="text-center">
                      <div
                        className="bg-primary/20 rounded-sm mb-1 flex items-end justify-center"
                        style={{ height: `${(hour.chats / maxHourlyChats) * 60 + 10}px` }}
                      >
                        <div
                          className="bg-primary rounded-sm w-full"
                          style={{ height: `${(hour.chats / maxHourlyChats) * 50}px` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">{hour.hour}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Agent Performance
              </CardTitle>
              <CardDescription>Individual agent metrics and efficiency scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentPerformance.map((agent) => (
                  <div key={agent.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="font-medium">{agent.name}</div>
                      <Badge variant="outline">{agent.chats} chats</Badge>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-sm font-medium">{((agent.resolved / agent.chats) * 100).toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">Resolution</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{agent.satisfaction}</div>
                        <div className="text-xs text-muted-foreground">Satisfaction</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={agent.efficiency} className="w-20 h-2" />
                        <span className="text-sm font-medium">{agent.efficiency}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Top Issue Categories
              </CardTitle>
              <CardDescription>Most common support topics and their trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topIssues.map((issue) => (
                  <div key={issue.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="font-medium">{issue.category}</div>
                      <Badge variant="secondary">{issue.count.toLocaleString()}</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Progress value={issue.percentage} className="w-20 h-2" />
                        <span className="text-sm text-muted-foreground">{issue.percentage}%</span>
                      </div>
                      <div
                        className={`text-sm font-medium ${
                          issue.trend.startsWith("+") ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {issue.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
                <CardDescription>Average response times over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Peak Hours (9-11 AM)</span>
                    <span className="text-sm font-medium">1.8s avg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Business Hours (9 AM - 5 PM)</span>
                    <span className="text-sm font-medium">1.4s avg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Off Hours (5 PM - 9 AM)</span>
                    <span className="text-sm font-medium">0.9s avg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekend</span>
                    <span className="text-sm font-medium">0.7s avg</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Trends</CardTitle>
                <CardDescription>Customer satisfaction by time period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyData.map((day) => (
                    <div key={day.day} className="flex items-center justify-between">
                      <span className="text-sm">{day.day}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(day.satisfaction / 5) * 100} className="w-16 h-2" />
                        <span className="text-sm font-medium">{day.satisfaction}/5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
