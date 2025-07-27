"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { AdminLayout } from "../layouts/AdminLayout"
import { Dashboard } from "../pages/Dashboard/Dashboard"
import { Chats } from "../pages/Chats/Chats"
import { KnowledgeBase } from "../pages/KnowledgeBase/KnowledgeBase"
import { Users } from "../pages/Users/Users"
import { Settings } from "../pages/Settings/Settings"
import { Agents } from "../pages/Agents/Agents"
import { Analytics } from "../pages/Analytics/Analytics"
import { Landing } from "../pages/Landing/Landing"
import { Login } from "../pages/Auth/Login"
import { Register } from "../pages/Auth/Register"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/admin" replace />
  }

  return children
}

export function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="chats" element={<Chats />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="agents" element={<Agents />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}
