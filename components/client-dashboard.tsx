"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Clock, AlertTriangle } from "lucide-react"
import type { User, EmergencyRequest } from "../types/emergency"

interface ClientDashboardProps {
  user: User
  onCreateRequest: (requestData: Partial<EmergencyRequest>) => void
  activeRequest: EmergencyRequest | null
}

export default function ClientDashboard({ user, onCreateRequest, activeRequest }: ClientDashboardProps) {
  const [isCreatingRequest, setIsCreatingRequest] = useState(false)
  const [newRequest, setNewRequest] = useState({
    serviceType: "",
    description: "",
    priority: "medium" as const,
  })

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
      location: {
        lat: -1.2921,
        lng: 36.8219,
        address: "Nairobi CBD, Kenya",
      },
      description: newRequest.description,
      priority: newRequest.priority,
    }

    onCreateRequest(requestData)
    setIsCreatingRequest(false)
  }

  if (activeRequest) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                Emergency Request
              </CardTitle>
              <Badge className={activeRequest.status === "pending" ? "bg-yellow-500" : "bg-green-500"}>
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
                    <span className="w-20">Service:</span>
                    <Badge>{activeRequest.serviceType.toUpperCase()}</Badge>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20">Priority:</span>
                    <Badge variant={activeRequest.priority === "critical" ? "destructive" : "secondary"}>
                      {activeRequest.priority?.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20">Time:</span>
                    <span>{activeRequest.createdAt.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              {activeRequest.status === "active" && activeRequest.responderName && (
                <div>
                  <h3 className="font-semibold mb-2">Responder Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="w-20">Name:</span>
                      <span className="font-medium">{activeRequest.responderName}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      <span className="w-16">Phone:</span>
                      <a href={`tel:${activeRequest.responderPhone}`} className="text-blue-600 hover:underline">
                        {activeRequest.responderPhone}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="w-16">ETA:</span>
                      <span className="font-medium text-green-600">{activeRequest.estimatedArrival}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={() => window.location.reload()}>
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
    )
  }

  return (
    <div className="space-y-6">
      {/* Service Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="group hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="w-full h-32 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl">🔥</span>
            </div>
            <CardTitle className="text-red-600">Fire Brigade</CardTitle>
            <CardDescription>Professional fire emergency response team available 24/7</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              Direct: +254-700-123456
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              Response Time: 5-8 minutes
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="w-full h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl">👮</span>
            </div>
            <CardTitle className="text-blue-600">Police Service</CardTitle>
            <CardDescription>Rapid police response for security and law enforcement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              Direct: +254-700-789012
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              Response Time: 3-6 minutes
            </div>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="w-full h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-4xl">🚑</span>
            </div>
            <CardTitle className="text-green-600">Medical Emergency</CardTitle>
            <CardDescription>Advanced life support and emergency medical care</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 mr-2" />
              Direct: +254-700-345678
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              Response Time: 4-7 minutes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request Form */}
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
              <label className="block text-sm font-medium mb-2">Priority Level</label>
              <Select
                value={newRequest.priority}
                onValueChange={(value) =>
                  setNewRequest((prev) => ({
                    ...prev,
                    priority: value as "low" | "medium" | "high" | "critical",
                  }))
                }
              >
                <SelectTrigger>
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
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                placeholder="Describe the emergency situation..."
                value={newRequest.description}
                onChange={(e) => setNewRequest((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={!newRequest.serviceType || isCreatingRequest}
            >
              {isCreatingRequest ? "Requesting Help..." : "Request Emergency Service"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
