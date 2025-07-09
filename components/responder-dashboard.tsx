"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Phone, MapPin, Clock, LogOut, CheckCircle, AlertTriangle } from "lucide-react"
import MapView from "./map-view"
import { ThemeToggle } from "./theme-toggle"

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

interface ResponderDashboardProps {
  user: any
  onLogout: () => void
}

export default function ResponderDashboard({ user, onLogout }: ResponderDashboardProps) {
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [estimatedArrival, setEstimatedArrival] = useState("")

  useEffect(() => {
    fetchRequests()
    // Set up polling for real-time updates
    const interval = setInterval(fetchRequests, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [user.serviceType])

  const fetchRequests = async () => {
    if (!user.serviceType) return

    try {
      const response = await fetch(`/api/emergency?serviceType=${user.serviceType}`)
      const data = await response.json()

      if (response.ok && data.success) {
        setRequests(data.requests)
      } else {
        setError(data.error || "Failed to fetch requests")
      }
    } catch (error) {
      console.error("Fetch requests error:", error)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptRequest = (request: EmergencyRequest) => {
    setSelectedRequest(request)
    setEstimatedArrival("")
    setIsModalOpen(true)
  }

  const handleConfirmAccept = async () => {
    if (!selectedRequest) return

    try {
      const response = await fetch(`/api/emergency/${selectedRequest.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "active",
          responder_id: user.id,
          responder_name: user.name,
          responder_phone: user.phone,
          estimated_arrival: estimatedArrival,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setRequests((prev) => prev.map((req) => (req.id === selectedRequest.id ? data.request : req)))
        setIsModalOpen(false)
        setSelectedRequest(null)
      } else {
        setError(data.error || "Failed to accept request")
      }
    } catch (error) {
      console.error("Accept request error:", error)
      setError("Network error. Please try again.")
    }
  }

  const handleCompleteRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/emergency/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setRequests((prev) => prev.map((req) => (req.id === requestId ? data.request : req)))
      } else {
        setError(data.error || "Failed to complete request")
      }
    } catch (error) {
      console.error("Complete request error:", error)
      setError("Network error. Please try again.")
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

  const pendingRequests = requests.filter((req) => req.status === "pending")
  const activeRequests = requests.filter((req) => req.status === "active" && req.responder_id === user.id)
  const completedRequests = requests.filter((req) => req.status === "completed" && req.responder_id === user.id)

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
                <p className="text-sm text-muted-foreground">
                  {user.serviceType && getServiceIcon(user.serviceType)} {user.serviceType?.toUpperCase()} Responder
                  Dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <span className="h-4 w-4 text-muted-foreground">👤</span>
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
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold">{pendingRequests.length}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active</p>
                      <p className="text-2xl font-bold">{activeRequests.length}</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">{completedRequests.length}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Emergency Requests</CardTitle>
                <CardDescription>New requests waiting for response</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading requests...</p>
                  </div>
                ) : pendingRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No pending requests</p>
                    <p className="text-sm">All caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getServiceIcon(request.service_type)}</span>
                            <div>
                              <h3 className="font-semibold">{request.client_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(request.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className={`${getPriorityColor(request.priority)} text-white`}>
                              {request.priority}
                            </Badge>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleAcceptRequest(request)}
                            >
                              Accept
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{request.location_address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{request.client_phone}</span>
                          </div>
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

            {/* Active Requests */}
            {activeRequests.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Active Requests</CardTitle>
                  <CardDescription>Requests you are currently handling</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4 space-y-3 bg-blue-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getServiceIcon(request.service_type)}</span>
                            <div>
                              <h3 className="font-semibold">{request.client_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                ETA: {request.estimated_arrival || "Not specified"}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Badge className={`${getStatusColor(request.status)} text-white`}>{request.status}</Badge>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleCompleteRequest(request.id)}
                            >
                              Complete
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{request.location_address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{request.client_phone}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <p className="text-sm">
                            <strong>Description:</strong> {request.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Responder Info */}
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="h-4 w-4 text-muted-foreground">👤</span>
                  <span>{user.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="h-4 w-4 text-muted-foreground">📞</span>
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getServiceIcon(user.serviceType || "")}</span>
                  <span className="capitalize">{user.serviceType} Service</span>
                </div>
                <Separator />
                <div className="text-sm text-muted-foreground">
                  <p>Status: Available for emergency response</p>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle>Your Location</CardTitle>
                <CardDescription>Current location for dispatch</CardDescription>
              </CardHeader>
              <CardContent>
                <MapView />
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Completions</CardTitle>
              </CardHeader>
              <CardContent>
                {completedRequests.slice(0, 3).length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">No completed requests yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {completedRequests.slice(0, 3).map((request) => (
                      <div key={request.id} className="flex items-center space-x-3 text-sm">
                        <span>{getServiceIcon(request.service_type)}</span>
                        <div className="flex-1">
                          <p className="font-medium">{request.client_name}</p>
                          <p className="text-muted-foreground">{new Date(request.updated_at).toLocaleDateString()}</p>
                        </div>
                        <Badge className="bg-green-500 text-white">Completed</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Accept Request Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Accept Emergency Request</DialogTitle>
            <DialogDescription>
              You are about to accept this emergency request. Please provide an estimated arrival time.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getServiceIcon(selectedRequest.service_type)}</span>
                  <span className="font-semibold">{selectedRequest.client_name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>
                    <strong>Location:</strong> {selectedRequest.location_address}
                  </p>
                  <p>
                    <strong>Priority:</strong> {selectedRequest.priority}
                  </p>
                  <p>
                    <strong>Description:</strong> {selectedRequest.description}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="eta">Estimated Arrival Time</Label>
                <Input
                  id="eta"
                  value={estimatedArrival}
                  onChange={(e) => setEstimatedArrival(e.target.value)}
                  placeholder="e.g., 10 minutes, 15 mins, etc."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleConfirmAccept}
                  disabled={!estimatedArrival.trim()}
                >
                  Accept Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
