"use client"

import { useState, useEffect } from "react"
import Login from "@/components/login"
import ClientDashboard from "@/components/client-dashboard"
import ResponderDashboard from "@/components/responder-dashboard"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

interface User {
  id: string
  username: string
  name: string
  email: string
  phone: string
  userType: "client" | "responder"
  serviceType?: "fire" | "police" | "medical"
}

export default function EmergencyServices() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize database on app start
    const initializeDatabase = async () => {
      try {
        await fetch("/api/init-db", { method: "POST" })
      } catch (error) {
        console.error("Database initialization failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeDatabase()
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
  }

  if (isLoading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">EmergencyConnect</h1>
            <p className="text-gray-600">Initializing system...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : user.userType === "client" ? (
          <ClientDashboard user={user} onLogout={handleLogout} />
        ) : (
          <ResponderDashboard user={user} onLogout={handleLogout} />
        )}
        <Toaster />
      </div>
    </ThemeProvider>
  )
}
