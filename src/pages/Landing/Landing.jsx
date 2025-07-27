import { Link } from "react-router-dom"
import { Bot, MessageSquare, Zap, Shield, Users, BarChart3, ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    icon: Bot,
    title: "AI-Powered Support",
    description: "Advanced AI agents that understand context and provide intelligent responses to customer queries.",
  },
  {
    icon: MessageSquare,
    title: "Real-time Chat",
    description: "Seamless chat interface with instant responses and conversation history tracking.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sub-second response times with optimized AI models for maximum efficiency.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with end-to-end encryption and compliance standards.",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Comprehensive user management with roles, permissions, and activity tracking.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Detailed insights into performance, customer satisfaction, and operational metrics.",
  },
]

const benefits = [
  "Reduce response time by 90%",
  "Handle 10x more customer queries",
  "24/7 automated support coverage",
  "Seamless human handoff when needed",
  "Multi-language support",
  "Integration with existing tools",
]

export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="size-4" />
            </div>
            <span className="font-bold text-xl">AI Support</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            🚀 Next-Generation Customer Support
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Transform Your Customer Support with AI
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Empower your team with intelligent AI agents that provide instant, accurate, and personalized customer
            support at scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to deliver exceptional customer support experiences
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Our AI Support Platform?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of companies that have transformed their customer support operations with our AI-powered
                platform.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8">
                <div className="bg-background rounded-lg p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium">AI Agent</span>
                    <Badge variant="secondary" className="ml-auto">
                      Online
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm">Hi! How can I help you today?</p>
                    </div>
                    <div className="bg-primary text-primary-foreground rounded-lg p-3 ml-8">
                      <p className="text-sm">I need help with my billing</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm">
                        I'd be happy to help you with your billing question. Let me pull up your account details...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Customer Support?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of companies already using our AI-powered platform to deliver exceptional customer
            experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex aspect-square size-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="size-3" />
            </div>
            <span className="font-bold">AI Support</span>
          </div>
          <p className="text-muted-foreground">© 2024 AI Support Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
