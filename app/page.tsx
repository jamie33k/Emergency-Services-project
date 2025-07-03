"use client"

import { useState, useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import Login from "@/components/login"
import EmergencyServices from "../emergency-services"
import ResponderDashboard from "@/components/responder-dashboard"
import type { User, EmergencyRequest } from "../types/emergency"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [activeRequest, setActiveRequest] = useState<EmergencyRequest | null>(null)

  // Initialize database on first load
  useEffect(() => {
    const initDB = async () => {
      try {
        await fetch("/api/init-db")
      } catch (error) {
        console.error("Failed to initialize database:", error)
      }
    }
    initDB()
  }, [])

  const handleLogin = (userData: User) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
    setActiveRequest(null)
  }

  const handleCreateRequest = async (requestData: Partial<EmergencyRequest>) => {
    try {
      const response = await fetch("/api/emergency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        const newRequest = await response.json()

        // Simulate finding a responder after 3 seconds
        setTimeout(() => {
          const mockResponders = {
            fire: { name: "Mark Maina", phone: "+254-700-123456" },
            police: { name: "Sasha Munene", phone: "+254-700-789012" },
            medical: { name: "Ali Hassan", phone: "+254-700-345678" },
          }

          const responder = mockResponders[requestData.serviceType as keyof typeof mockResponders]

          setActiveRequest({
            ...newRequest,
            status: "active",
            responderName: responder.name,
            responderPhone: responder.phone,
            responderLocation: {
              lat: -1.2841,
              lng: 36.8155,
            },
            estimatedArrival: "8-12 minutes",
          })
        }, 3000)

        setActiveRequest(newRequest)
      }
    } catch (error) {
      console.error("Failed to create emergency request:", error)
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen">
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : user.userType === "client" ? (
          <EmergencyServices
            user={user}
            onLogout={handleLogout}
            onCreateRequest={handleCreateRequest}
            activeRequest={activeRequest}
          />
        ) : (
          <ResponderDashboard user={user} onLogout={handleLogout} />
        )}
      </div>
    </ThemeProvider>
  )
}
