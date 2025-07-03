"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogOut, Phone, MapPin, Clock, AlertTriangle, CheckCircle, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import type { User, EmergencyRequest } from "../types/emergency"

interface ResponderDashboardProps {
  user: User
  onLogout: () => void
}

export default function ResponderDashboard({ user, onLogout }: ResponderDashboardProps) {
  const { theme, setTheme } = useTheme()
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [activeRequests, setActiveRequests] = useState<EmergencyRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [user.serviceType])

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/emergency?serviceType=${user.serviceType}`)
      if (response.ok) {
        const data = await response.json()
        setRequests(data.filter((req: EmergencyRequest) => req.status === "pending"))
        setActiveRequests(data.filter((req: EmergencyRequest) => req.status === "active"))
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/emergency/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "active",
          responderName: user.name,
          responderPhone: user.phone,
          estimatedArrival: "8-12 minutes",
        }),
      })

      if (response.ok) {
        fetchRequests()
      }
    } catch (error) {
      console.error("Failed to accept request:", error)
    }
  }

  const handleCompleteRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/emergency/${requestId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
        }),
      })

      if (response.ok) {
        fetchRequests()
      }
    } catch (error) {
      console.error("Failed to complete request:", error)
    }
  }

  const getServiceColor = (serviceType: string) => {
    switch (serviceType) {
      case "fire":
        return "bg-red-600"
      case "police":
        return "bg-blue-600"
      case "medical":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-600 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-black"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 ${getServiceColor(user.serviceType || "")} rounded-full flex items-center justify-center`}
                >
                  <span className="text-white font-bold text-sm">
                    {user.serviceType === "fire" ? "🔥" : user.serviceType === "police" ? "👮" : "🚑"}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Responder Dashboard</h1>
              </div>
              <Badge className={`${getServiceColor(user.serviceType || "")} text-white`}>
                {user.serviceType?.toUpperCase()} RESPONDER
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 p-0"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              <div className="flex items-center space-x-2">
                <div
                  className={`w-8 h-8 ${getServiceColor(user.serviceType || "")} rounded-full flex items-center justify-center`}
                >
                  <span className="text-white font-medium text-sm">{user.name?.charAt(0) || "R"}</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name || "Responder"}</span>
              </div>
              <Button variant="outline" onClick={onLogout} size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Requests</CardTitle>
                <div className="text-2xl font-bold text-orange-600">{requests.length}</div>
              </CardHeader>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Responses</CardTitle>
                <div className="text-2xl font-bold text-blue-600">{activeRequests.length}</div>
              </CardHeader>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Service Type</CardTitle>
                <div className="text-2xl font-bold text-green-600">{user.serviceType?.toUpperCase()}</div>
              </CardHeader>
            </Card>
          </div>

          {/* Requests Tabs */}
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending">Pending Requests ({requests.length})</TabsTrigger>
              <TabsTrigger value="active">Active Responses ({activeRequests.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {requests.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>No pending requests at the moment.</AlertDescription>
                </Alert>
              ) : (
                requests.map((request) => (
                  <Card key={request.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <AlertTriangle className="w-5 h-5 text-orange-500" />
                          <span>Emergency Request</span>
                          <Badge className={getPriorityColor(request.priority)}>{request.priority.toUpperCase()}</Badge>
                        </CardTitle>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(request.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <span className="w-20 text-gray-600 dark:text-gray-400">Client:</span>
                            <span className="font-medium">{request.clientName}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="w-4 h-4 mr-1 text-gray-600 dark:text-gray-400" />
                            <span className="w-16 text-gray-600 dark:text-gray-400">Phone:</span>
                            <a
                              href={`tel:${request.clientPhone}`}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {request.clientPhone}
                            </a>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="w-4 h-4 mr-1 text-gray-600 dark:text-gray-400" />
                            <span className="w-16 text-gray-600 dark:text-gray-400">Location:</span>
                            <span className="text-sm">{request.location.address}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Description:</span>
                            <p className="mt-1 text-gray-900 dark:text-gray-100">{request.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept Request
                        </Button>
                        <Button variant="outline" asChild>
                          <a href={`tel:${request.clientPhone}`}>
                            <Phone className="w-4 h-4 mr-2" />
                            Call Client
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              {activeRequests.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>No active responses at the moment.</AlertDescription>
                </Alert>
              ) : (
                activeRequests.map((request) => (
                  <Card key={request.id} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Active Response</span>
                          <Badge className="bg-green-600 text-white">EN ROUTE</Badge>
                        </CardTitle>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Started: {new Date(request.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <span className="w-20 text-gray-600 dark:text-gray-400">Client:</span>
                            <span className="font-medium">{request.clientName}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="w-4 h-4 mr-1 text-gray-600 dark:text-gray-400" />
                            <span className="w-16 text-gray-600 dark:text-gray-400">Phone:</span>
                            <a
                              href={`tel:${request.clientPhone}`}
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {request.clientPhone}
                            </a>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-4 h-4 mr-1 text-gray-600 dark:text-gray-400" />
                            <span className="w-16 text-gray-600 dark:text-gray-400">ETA:</span>
                            <span className="font-medium text-green-600">{request.estimatedArrival}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <MapPin className="w-4 h-4 mr-1 text-gray-600 dark:text-gray-400" />
                            <span className="w-16 text-gray-600 dark:text-gray-400">Location:</span>
                            <span className="text-sm">{request.location.address}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Description:</span>
                            <p className="mt-1 text-gray-900 dark:text-gray-100">{request.description}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleCompleteRequest(request.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark Complete
                        </Button>
                        <Button variant="outline" asChild>
                          <a href={`tel:${request.clientPhone}`}>
                            <Phone className="w-4 h-4 mr-2" />
                            Call Client
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
