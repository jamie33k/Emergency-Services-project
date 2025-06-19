"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Phone, Clock, CheckCircle, AlertTriangle, LogOut, Navigation, X } from "lucide-react"
import type { User, EmergencyRequest } from "../types/emergency"

interface ResponderDashboardProps {
  user: User
  onLogout: () => void
  requests: EmergencyRequest[]
  onUpdateRequest: (requestId: string, status: EmergencyRequest["status"]) => void
}

export default function ResponderDashboard({ user, onLogout, requests, onUpdateRequest }: ResponderDashboardProps) {
  const [incomingRequests, setIncomingRequests] = useState<EmergencyRequest[]>([])
  const [activeRequests, setActiveRequests] = useState<EmergencyRequest[]>([])

  useEffect(() => {
    // Show ALL pending requests regardless of service type
    const incoming = requests.filter((r) => r.status === "pending")
    // Show only active requests assigned to this responder
    const active = requests.filter((r) => r.status === "active" && r.responderId === user.id)

    setIncomingRequests(incoming)
    setActiveRequests(active)
  }, [requests, user])

  const handleAcceptRequest = (requestId: string) => {
    onUpdateRequest(requestId, "active")
  }

  const handleDeclineRequest = (requestId: string) => {
    onUpdateRequest(requestId, "declined")
  }

  const handleCompleteRequest = (requestId: string) => {
    onUpdateRequest(requestId, "completed")
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

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case "fire":
        return "🔥"
      case "police":
        return "👮"
      case "medical":
        return "🚑"
      default:
        return "⚠️"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60))
    if (minutes < 1) return "Just now"
    if (minutes === 1) return "1 minute ago"
    return `${minutes} minutes ago`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">First Responder Dashboard</h1>
            <p className="text-gray-600">
              Welcome, {user.name} - {user.serviceType?.toUpperCase()} Service (All Emergency Requests)
            </p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Incoming Requests</p>
                  <p className="text-2xl font-bold text-orange-600">{incomingRequests.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Requests</p>
                  <p className="text-2xl font-bold text-blue-600">{activeRequests.length}</p>
                </div>
                <Navigation className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed Today</p>
                  <p className="text-2xl font-bold text-green-600">7</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests Tabs */}
        <Tabs defaultValue="incoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="incoming" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Incoming Requests ({incomingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              Active Requests ({activeRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incoming" className="space-y-4">
            {incomingRequests.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No incoming requests at the moment</p>
                </CardContent>
              </Card>
            ) : (
              incomingRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center text-lg">
                        <span className="mr-2">{getServiceIcon(request.serviceType)}</span>
                        Emergency Request - {request.serviceType.toUpperCase()}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(request.priority)}>{request.priority.toUpperCase()}</Badge>
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatTimeAgo(request.createdAt)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Client Information</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center">
                            <span className="w-16 text-gray-600">Name:</span>
                            <span className="font-medium">{request.clientName}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1 text-gray-600" />
                            <span className="w-12 text-gray-600">Phone:</span>
                            <a href={`tel:${request.clientPhone}`} className="text-blue-600 hover:underline">
                              {request.clientPhone}
                            </a>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Location</h4>
                        <div className="flex items-start text-sm">
                          <MapPin className="w-4 h-4 mr-1 text-gray-600 mt-0.5" />
                          <span>{request.location.address}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{request.description}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept Request
                      </Button>
                      <Button variant="destructive" onClick={() => handleDeclineRequest(request.id)} className="flex-1">
                        <X className="w-4 h-4 mr-2" />
                        Decline
                      </Button>
                      <Button variant="outline">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Client
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {activeRequests.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No active requests at the moment</p>
                </CardContent>
              </Card>
            ) : (
              activeRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center text-lg">
                        <span className="mr-2">{getServiceIcon(request.serviceType)}</span>
                        Active Response - {request.serviceType.toUpperCase()}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(request.priority)}>{request.priority.toUpperCase()}</Badge>
                        <Badge className="bg-blue-500">EN ROUTE</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Client Information</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center">
                            <span className="w-16 text-gray-600">Name:</span>
                            <span className="font-medium">{request.clientName}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1 text-gray-600" />
                            <span className="w-12 text-gray-600">Phone:</span>
                            <a href={`tel:${request.clientPhone}`} className="text-blue-600 hover:underline">
                              {request.clientPhone}
                            </a>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Location</h4>
                        <div className="flex items-start text-sm">
                          <MapPin className="w-4 h-4 mr-1 text-gray-600 mt-0.5" />
                          <span>{request.location.address}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{request.description}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCompleteRequest(request.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Complete
                      </Button>
                      <Button variant="outline">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Client
                      </Button>
                      <Button variant="outline">
                        <Navigation className="w-4 h-4 mr-2" />
                        Navigate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
