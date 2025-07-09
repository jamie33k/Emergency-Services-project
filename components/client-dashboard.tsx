"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Phone, MapPin, Clock, UserIcon, LogOut, Plus, AlertTriangle } from "lucide-react"
import IncidentReportModal from "./incident-report-modal"
import MapView from "./map-view"
import { ThemeToggle } from "./theme-toggle"

interface ClientUser {
  id: string
  username: string
  name: string
  email: string
  phone: string
  userType: "client" | "responder"
  serviceType?: "fire" | "police" | "medical"
}

interface EmergencyRequest {
  id: string
  client_id: string
  client_name: string
  client_phone: string
  service_type: "fire" | "police" | "medical"
  location_lat: number
  location_lng: number
  location_address: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  status: "pending" | "active" | "completed" | "cancelled"
  responder_id?: string
  responder_name?: string
  responder_phone?: string
  estimated_arrival?: string
  created_at: string
  updated_at: string
}

interface ClientDashboardProps {
  user: ClientUser
  onLogout: () => void
}

export default function ClientDashboard({ user, onLogout }: ClientDashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmitRequest = async (requestData: any) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/emergency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...requestData,
          client_id: user.id,
          client_name: user.name,
          client_phone: user.phone,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setRequests((prev) => [data.request, ...prev])
        setIsModalOpen(false)
      } else {
        setError(data.error || "Failed to submit request")
      }
    } catch (error) {
      console.error("Submit request error:", error)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "active":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case "fire":
        return "🚒"
      case "police":
        return "🚔"
      case "medical":
        return "🚑"
      default:
        return "🚨"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">EmergencyConnect</h1>
                <p className="text-sm text-muted-foreground">Client Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4" />
                <span className="font-medium">{user.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Emergency Request Button */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <AlertTriangle className="h-12 w-12 text-red-600 mx-auto" />
                  <div>
                    <h2 className="text-xl font-bold text-red-900">Emergency Assistance</h2>
                    <p className="text-red-700">Need immediate help? Report an emergency now.</p>
                  </div>
                  <Button
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Report Emergency
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Emergency Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Your Emergency Requests</CardTitle>
                <CardDescription>Track the status of your emergency requests</CardDescription>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No emergency requests yet</p>
                    <p className="text-sm">Click "Report Emergency" to submit a request</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getServiceIcon(request.service_type)}</span>
                            <div>
                              <h3 className="font-semibold capitalize">{request.service_type} Emergency</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(request.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className={`${getPriorityColor(request.priority)} text-white`}>
                              {request.priority}
                            </Badge>
                            <Badge className={`${getStatusColor(request.status)} text-white`}>{request.status}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{request.location_address}</span>
                          </div>
                          {request.responder_name && (
                            <div className="flex items-center space-x-2">
                              <UserIcon className="h-4 w-4 text-muted-foreground" />
                              <span>Responder: {request.responder_name}</span>
                            </div>
                          )}
                          {request.responder_phone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{request.responder_phone}</span>
                            </div>
                          )}
                          {request.estimated_arrival && (
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>ETA: {request.estimated_arrival}</span>
                            </div>
                          )}
                        </div>

                        <div className="pt-2 border-t">
                          <p className="text-sm">
                            <strong>Description:</strong> {request.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{user.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
                <Separator />
                <div className="text-sm text-muted-foreground">
                  <p>Keep your contact information updated for emergency responses.</p>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Your current location for emergency services</CardDescription>
              </CardHeader>
              <CardContent>
                <MapView />
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Fire Department</span>
                  <span className="font-mono">999</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Police</span>
                  <span className="font-mono">999</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Medical Emergency</span>
                  <span className="font-mono">999</span>
                </div>
                <Separator />
                <div className="text-sm text-muted-foreground">
                  <p>For immediate life-threatening emergencies, call 999 directly.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Incident Report Modal */}
      <IncidentReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitRequest}
        isLoading={isLoading}
      />
    </div>
  )
}
