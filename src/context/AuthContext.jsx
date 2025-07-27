"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../services/authService"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    setLoading(true)
    try {
      const result = await authService.getCurrentUser()
      if (result.success) {
        setUser(result.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    try {
      const result = await authService.login(email, password)
      if (result.success) {
        setUser(result.user)
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      return { success: false, error: "Login failed" }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    setLoading(true)
    try {
      const result = await authService.register(userData)
      if (result.success) {
        // After successful registration, log the user in
        const loginResult = await authService.login(userData.email, userData.password)
        if (loginResult.success) {
          setUser(loginResult.user)
          return { success: true }
        }
        return { success: true, message: "Registration successful, please login" }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      return { success: false, error: "Registration failed" }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await authService.logout()
      setUser(null)
      return { success: true }
    } catch (error) {
      // Even if logout fails on backend, clear user locally
      setUser(null)
      return { success: true }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    checkAuthStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
