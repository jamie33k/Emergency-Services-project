"use client"

import { useState, useEffect } from "react"
import Login from "@/components/login"
import ResponderDashboard from "@/components/responder-dashboard"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, MapPin, Clock, AlertTriangle, CheckCircle, Flame, Shield, Heart, Navigation } from "lucide-react"
import MapView from "@/components/map-view"
import type { EmergencyRequest, Location } from "@/types/emergency"

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
  const [selectedService, setSelectedService] = useState<"fire" | "police" | "medical" | null>(null)
  const [location, setLocation] = useState<Location | null>(null)
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeRequest, setActiveRequest] = useState<EmergencyRequest | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          // Set default location (Nairobi, Kenya)
          setLocation({
            lat: -1.2921,
            lng: 36.8219,
            address: "Nairobi, Kenya",
          })
        },
      )
    } else {
      // Fallback if geolocation is not supported
      setLocation({
        lat: -1.2921,
        lng: 36.8219,
        address: "Nairobi, Kenya",
      })
    }
  }, [])

  const services = [
    {
      id: "fire" as const,
      name: "Fire Brigade",
      description: "Fire emergencies, rescue operations, and hazardous material incidents",
      icon: Flame,
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      textColor: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      id: "police" as const,
      name: "Police Service",
      description: "Security threats, criminal activities, and law enforcement",
      icon: Shield,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      id: "medical" as const,
      name: "Medical Emergency",
      description: "Medical emergencies, ambulance services, and health crises",
      icon: Heart,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
  ]

  const handleServiceSelect = (serviceId: "fire" | "police" | "medical") => {
    setSelectedService(serviceId)
    setError("")
    setSuccess("")
  }

  const handleSubmitRequest = async () => {
    if (!selectedService || !location || !description.trim()) {
      setError("Please select a service, ensure location is available, and provide a description")
      return
    }

    if (!user?.id) {
      setError("User information is missing. Please log in again.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const requestPayload = {
        clientId: user.id,
        clientName: user.name || user.username,
        clientPhone: user.phone || "N/A",
        serviceType: selectedService,
        locationLat: location.lat,
        locationLng: location.lng,
        locationAddress: location.address,
        description,
        priority,
      }

      console.log("Submitting request with payload:", requestPayload)

      const response = await fetch("/api/emergency", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      })

      if (response.ok) {
        const newRequest = await response.json()
        setActiveRequest(newRequest)
        setSuccess("Emergency request submitted successfully!")
        setDescription("")
        setPriority("medium")
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to submit request")
      }
    } catch (error) {
      console.error("Submit error:", error)
      setError("Network error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelRequest = async () => {
    if (!activeRequest) return

    try {
      const response = await fetch(`/api/emergency/${activeRequest.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      })

      if (response.ok) {
        setActiveRequest(null)
        setSelectedService(null)
        setSuccess("Request cancelled successfully")
      }
    } catch (error) {
      console.error("Cancel error:", error)
      setError("Failed to cancel request")
    }
  }

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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Service Selection and Form */}
              <div className="space-y-6">
                {/* Emergency Hotline */}
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-6 h-6 text-red-600" />
                      <div>
                        <p className="font-semibold text-red-800">Emergency Hotline</p>
                        <p className="text-red-700">020-2222-181 (Available 24/7)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Service Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Select Emergency Service</span>
                    </CardTitle>
                    <CardDescription>Choose the type of emergency service you need</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {services.map((service) => {
                      const Icon = service.icon
                      const isSelected = selectedService === service.id
                      return (
                        <div
                          key={service.id}
                          className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? `${service.borderColor} ${service.bgColor}`
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleServiceSelect(service.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${service.color}`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{service.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                            </div>
                            {isSelected && <Badge className={service.color}>Selected</Badge>}
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                {/* Request Form */}
                {selectedService && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Emergency Request Details</CardTitle>
                      <CardDescription>Provide details about your emergency</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Location Display */}
                      <div className="space-y-2">
                        <Label className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>Your Location</span>
                        </Label>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">{location ? location.address : "Getting location..."}</p>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label htmlFor="description">Description of Emergency</Label>
                        <Textarea
                          id="description"
                          placeholder="Please describe the emergency situation in detail..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={4}
                        />
                      </div>

                      {/* Priority */}
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority Level</Label>
                        <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low - Non-urgent</SelectItem>
                            <SelectItem value="medium">Medium - Moderate urgency</SelectItem>
                            <SelectItem value="high">High - Urgent</SelectItem>
                            <SelectItem value="critical">Critical - Life threatening</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Error/Success Messages */}
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      {success && (
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>{success}</AlertDescription>
                        </Alert>
                      )}

                      {/* Submit Button */}
                      <Button
                        onClick={handleSubmitRequest}
                        disabled={isSubmitting || !location}
                        className="w-full"
                        size="lg"
                      >
                        {isSubmitting ? "Submitting Request..." : "Submit Emergency Request"}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Column - Map and Active Request */}
              <div className="space-y-6">
                {/* Active Request Status */}
                {activeRequest && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-green-800">
                        <CheckCircle className="w-5 h-5" />
                        <span>Active Emergency Request</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-green-800">Request ID</p>
                          <p className="text-green-700">{activeRequest.id.slice(0, 8)}...</p>
                        </div>
                        <div>
                          <p className="font-medium text-green-800">Status</p>
                          <Badge variant="secondary">{activeRequest.status}</Badge>
                        </div>
                        <div>
                          <p className="font-medium text-green-800">Service Type</p>
                          <p className="text-green-700 capitalize">{activeRequest.serviceType}</p>
                        </div>
                        <div>
                          <p className="font-medium text-green-800">Priority</p>
                          <p className="text-green-700 capitalize">{activeRequest.priority}</p>
                        </div>
                      </div>

                      {activeRequest.responderName && (
                        <div className="pt-2 border-t border-green-200">
                          <p className="font-medium text-green-800">Assigned Responder</p>
                          <p className="text-green-700">{activeRequest.responderName}</p>
                          {activeRequest.responderPhone && (
                            <p className="text-green-700">{activeRequest.responderPhone}</p>
                          )}
                          {activeRequest.estimatedArrival && (
                            <p className="text-green-700 flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>ETA: {activeRequest.estimatedArrival}</span>
                            </p>
                          )}
                        </div>
                      )}

                      <Button variant="outline" onClick={handleCancelRequest} className="w-full bg-transparent">
                        Cancel Request
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Map View */}
                {(location || activeRequest) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Navigation className="w-5 h-5" />
                        <span>Location Map</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MapView
                        location={location}
                        emergencyRequest={activeRequest}
                        className="h-96 w-full rounded-lg"
                      />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        ) : (
          <ResponderDashboard user={user} onLogout={handleLogout} />
        )}
        <Toaster />
      </div>
    </ThemeProvider>
  )
}
