"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Clock, Navigation, AlertTriangle, LogOut, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import type { User, EmergencyRequest } from "./types/emergency"

interface EmergencyServicesProps {
  user: User
  onLogout: () => void
  onCreateRequest: (requestData: Partial<EmergencyRequest>) => void
  activeRequest: EmergencyRequest | null
}

export default function EmergencyServices({ user, onLogout, onCreateRequest, activeRequest }: EmergencyServicesProps) {
  const { theme, setTheme } = useTheme()
  const [isCreatingRequest, setIsCreatingRequest] = useState(false)
  const [newRequest, setNewRequest] = useState({
    serviceType: "",
    description: "",
    priority: "medium" as const,
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

    const requestData: Partial<EmergencyRequest> = {
      clientId: user.id,
      clientName: user.name,
      clientPhone: user.phone,
      serviceType: newRequest.serviceType as "fire" | "police" | "medical",
      location: currentLocation,
      description: newRequest.description,
      priority: newRequest.priority,
    }

    onCreateRequest(requestData)
    setIsCreatingRequest(false)
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">EmergencyConnect</h1>
              </div>
              <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                🚨 Emergency Hotline: 020-2222-181
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
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">{user.name.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Welcome, {user.name}</span>
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
        {!activeRequest ? (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Service Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="w-full h-48 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src="/images/fire-truck.jpg"
                      alt="Fire Brigade"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardTitle className="text-red-600 dark:text-red-400">🔥 Fire Brigade</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Professional fire emergency response team available 24/7
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 mr-2" />
                    Direct: +254-700-123456
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    Response Time: 5-8 minutes
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Responder: Mark Maina</div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src="/images/police-officer.jpg"
                      alt="Police Service"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardTitle className="text-blue-600 dark:text-blue-400">👮 Police Service</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Rapid police response for security and law enforcement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 mr-2" />
                    Direct: +254-700-789012
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    Response Time: 3-6 minutes
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Responder: Sasha Munene</div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="w-full h-48 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src="/images/ambulance.jpg"
                      alt="Medical Emergency"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardTitle className="text-green-600 dark:text-green-400">🚑 Medical Emergency</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Advanced life support and emergency medical care
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 mr-2" />
                    Direct: +254-700-345678
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    Response Time: 4-7 minutes
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">Responder: Ali Hassan</div>
                </CardContent>
              </Card>
            </div>

            {/* Request Form */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Request Emergency Service</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Select the type of emergency and provide details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateRequest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Service Type
                    </label>
                    <Select
                      value={newRequest.serviceType}
                      onValueChange={(value) => setNewRequest((prev) => ({ ...prev, serviceType: value }))}
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
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
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Priority Level
                    </label>
                    <Select
                      value={newRequest.priority}
                      onValueChange={(value) =>
                        setNewRequest((prev) => ({
                          ...prev,
                          priority: value as "low" | "medium" | "high" | "critical",
                        }))
                      }
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">🟢 Low Priority</SelectItem>
                        <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                        <SelectItem value="high">🟠 High Priority</SelectItem>
                        <SelectItem value="critical">🔴 Critical Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <Textarea
                      placeholder="Describe the emergency situation..."
                      value={newRequest.description}
                      onChange={(e) => setNewRequest((prev) => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center text-sm text-blue-800 dark:text-blue-300">
                      <MapPin className="w-4 h-4 mr-2" />
                      Current Location: {currentLocation.address}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                    disabled={!newRequest.serviceType || isCreatingRequest}
                  >
                    {isCreatingRequest ? "Requesting Help..." : "Request Emergency Service"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Active Request Tracking */
          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center text-gray-900 dark:text-white">
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
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Request Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="w-20 text-gray-600 dark:text-gray-400">Service:</span>
                        <Badge className={getServiceColor(activeRequest.serviceType)}>
                          {activeRequest.serviceType.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-gray-600 dark:text-gray-400">Priority:</span>
                        <Badge variant={activeRequest.priority === "critical" ? "destructive" : "secondary"}>
                          {activeRequest.priority?.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-gray-600 dark:text-gray-400">Time:</span>
                        <span className="dark:text-gray-300">{activeRequest.createdAt.toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="w-20 text-gray-600 dark:text-gray-400">Details:</span>
                        <span className="dark:text-gray-300">{activeRequest.description}</span>
                      </div>
                    </div>
                  </div>

                  {activeRequest.status === "active" && activeRequest.responderName && (
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Responder Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <span className="w-20 text-gray-600 dark:text-gray-400">Name:</span>
                          <span className="font-medium dark:text-gray-300">{activeRequest.responderName}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1 text-gray-600 dark:text-gray-400" />
                          <span className="w-16 text-gray-600 dark:text-gray-400">Phone:</span>
                          <a
                            href={`tel:${activeRequest.responderPhone}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {activeRequest.responderPhone}
                          </a>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-gray-600 dark:text-gray-400" />
                          <span className="w-16 text-gray-600 dark:text-gray-400">ETA:</span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            {activeRequest.estimatedArrival}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Map Simulation */}
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900 dark:text-white">
                  <Navigation className="w-5 h-5 mr-2" />
                  Live Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 dark:bg-gray-700 h-64 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Mock Map Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900"></div>

                  {/* Your Location */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-blue-600 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                      Your Location
                    </div>
                  </div>

                  {/* Responder Location */}
                  {activeRequest.status === "active" && distance && (
                    <div className="absolute top-1/3 right-1/3 transform translate-x-1/2 -translate-y-1/2">
                      <div
                        className={`${getServiceColor(activeRequest.serviceType)} w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse`}
                      ></div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow text-xs whitespace-nowrap">
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

                  <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-2 rounded shadow">
                    <div className="text-xs text-gray-600 dark:text-gray-400">📍 {currentLocation.address}</div>
                    {distance && (
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Distance to responder: {distance} km
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => window.location.reload()}>
                Cancel Request
              </Button>
              {activeRequest.responderPhone && (
                <Button className="flex-1 bg-green-600 hover:bg-green-700">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Responder
                </Button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
