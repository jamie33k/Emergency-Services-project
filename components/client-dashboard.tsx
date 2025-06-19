"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Clock, Navigation, AlertTriangle, LogOut } from "lucide-react"
import type { User, EmergencyRequest } from "../types/emergency"

interface ClientDashboardProps {
  user: User
  onLogout: () => void
}

export default function ClientDashboard({ user, onLogout }: ClientDashboardProps) {
  const [activeRequest, setActiveRequest] = useState<EmergencyRequest | null>(null)
  const [isCreatingRequest, setIsCreatingRequest] = useState(false)
  const [newRequest, setNewRequest] = useState({
    serviceType: "",
    description: "",
  })

  // Mock current location
  const [currentLocation] = useState({
    lat: -1.2921,
    lng: 36.8219,
    address: "Nairobi CBD, Kenya",
  })

  // Mock responder location (when request is active)
  const [responderLocation] = useState({
    lat: -1.2841,
    lng: 36.8155,
  })

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreatingRequest(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const request: EmergencyRequest = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: user.id,
      clientName: user.name,
      clientPhone: user.phone,
      serviceType: newRequest.serviceType as "fire" | "police" | "medical",
      location: currentLocation,
      description: newRequest.description,
      status: "pending",
      createdAt: new Date(),
    }

    setActiveRequest(request)
    setIsCreatingRequest(false)

    // Simulate responder accepting request after 5 seconds
    setTimeout(() => {
      setActiveRequest((prev) =>
        prev
          ? {
              ...prev,
              status: "active",
              responderId: "resp_001",
              responderName: "Officer John Smith",
              responderPhone: "+254712345678",
              responderLocation,
              estimatedArrival: "8 minutes",
            }
          : null,
      )
    }, 5000)
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

  const distance = activeRequest?.responderLocation
    ? calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        activeRequest.responderLocation.lat,
        activeRequest.responderLocation.lng,
      ).toFixed(1)
    : null

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Emergency Services</h1>
            <p className="text-gray-600">Welcome, {user.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {!activeRequest ? (
          /* Request Form */
          <Card>
            <CardHeader>
              <CardTitle>Request Emergency Service</CardTitle>
              <CardDescription>Select the type of emergency and provide details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Service Type</label>
                  <Select
                    value={newRequest.serviceType}
                    onValueChange={(value) => setNewRequest((prev) => ({ ...prev, serviceType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select emergency service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fire">🔥 Fire Department</SelectItem>
                      <SelectItem value="police">👮 Police Service</SelectItem>
                      <SelectItem value="medical">🚑 Medical Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    placeholder="Describe the emergency situation..."
                    value={newRequest.description}
                    onChange={(e) => setNewRequest((prev) => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center text-sm text-blue-800">
                    <MapPin className="w-4 h-4 mr-2" />
                    Current Location: {currentLocation.address}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={!newRequest.serviceType || isCreatingRequest}>
                  {isCreatingRequest ? "Requesting Help..." : "Request Emergency Service"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Active Request Tracking */
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                    Emergency Request
                  </CardTitle>
                  <Badge
                    className={`${activeRequest.status === "pending" ? "bg-yellow-500" : "bg-green-500"} text-white`}
                  >
                    {activeRequest.status === "pending" ? "Finding Responder..." : "Responder En Route"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Request Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="w-20 text-gray-600">Service:</span>
                        <Badge className={getServiceColor(activeRequest.serviceType)}>
                          {activeRequest.serviceType.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-gray-600">Time:</span>
                        <span>{activeRequest.createdAt.toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="w-20 text-gray-600">Details:</span>
                        <span>{activeRequest.description}</span>
                      </div>
                    </div>
                  </div>

                  {activeRequest.status === "active" && activeRequest.responderName && (
                    <div>
                      <h3 className="font-semibold mb-2">Responder Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <span className="w-20 text-gray-600">Name:</span>
                          <span className="font-medium">{activeRequest.responderName}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1 text-gray-600" />
                          <span className="w-16 text-gray-600">Phone:</span>
                          <a href={`tel:${activeRequest.responderPhone}`} className="text-blue-600 hover:underline">
                            {activeRequest.responderPhone}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-gray-600" />
                          <span className="w-16 text-gray-600">ETA:</span>
                          <span className="font-medium text-green-600">{activeRequest.estimatedArrival}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Map Simulation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Navigation className="w-5 h-5 mr-2" />
                  Live Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Mock Map Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100"></div>

                  {/* Your Location */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-blue-600 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                      Your Location
                    </div>
                  </div>

                  {/* Responder Location */}
                  {activeRequest.status === "active" && distance && (
                    <div className="absolute top-1/3 right-1/3 transform translate-x-1/2 -translate-y-1/2">
                      <div
                        className={`${getServiceColor(activeRequest.serviceType)} w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse`}
                      ></div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                        Responder ({distance} km away)
                      </div>
                    </div>
                  )}

                  {/* Route Line */}
                  {activeRequest.status === "active" && (
                    <svg className="absolute inset-0 w-full h-full">
                      <line
                        x1="50%"
                        y1="50%"
                        x2="66%"
                        y2="33%"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        className="animate-pulse"
                      />
                    </svg>
                  )}

                  <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow">
                    <div className="text-xs text-gray-600">📍 {currentLocation.address}</div>
                    {distance && (
                      <div className="text-xs text-green-600 font-medium">Distance to responder: {distance} km</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setActiveRequest(null)}>
                Cancel Request
              </Button>
              {activeRequest.responderPhone && (
                <Button className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Responder
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
