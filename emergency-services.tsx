"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, MapPin, Clock, Users, AlertTriangle, LogOut } from "lucide-react"
import Image from "next/image"
import MapView from "./components/map-view"
import IncidentReportModal from "./components/incident-report-modal"
import type { User, EmergencyRequest, Responder } from "./types/emergency"

interface EmergencyServicesProps {
  user?: User
  onLogout?: () => void
  onCreateRequest?: (request: Partial<EmergencyRequest>) => void
  activeRequest?: EmergencyRequest | null
}

export default function EmergencyServices({ user, onLogout, onCreateRequest, activeRequest }: EmergencyServicesProps) {
  const [selectedService, setSelectedService] = useState<"fire" | "police" | "medical" | null>(null)

  // Mock current location with more precise coordinates
  const [currentLocation] = useState({
    lat: -1.292066,
    lng: 36.821945,
    address: "Kenyatta Avenue, Nairobi CBD, Kenya",
  })

  // Mock nearest responders with updated names
  const mockResponders: Record<string, Responder> = {
    fire: {
      id: "fire_001",
      name: "Teejan - Fire Station Captain",
      phone: "+254798578853",
      serviceType: "fire",
      location: { lat: -1.284123, lng: 36.815567 },
      status: "available",
      currentRequests: 0,
    },
    police: {
      id: "police_001",
      name: "Jamie - Police Officer",
      phone: "+254712345678",
      serviceType: "police",
      location: { lat: -1.284089, lng: 36.815234 },
      status: "available",
      currentRequests: 1,
    },
    medical: {
      id: "medical_001",
      name: "Teejan - Paramedic Team Lead",
      phone: "+254787654321",
      serviceType: "medical",
      location: { lat: -1.284156, lng: 36.81589 },
      status: "available",
      currentRequests: 0,
    },
  }

  const handleServiceClick = (serviceType: "fire" | "police" | "medical") => {
    if (user?.role === "client") {
      setSelectedService(serviceType)
    }
  }

  const handleSubmitRequest = (request: Partial<EmergencyRequest>) => {
    if (onCreateRequest) {
      onCreateRequest({
        ...request,
        clientId: user?.id,
        clientName: user?.name,
        clientPhone: user?.phone,
      })
    }
    setSelectedService(null)
  }

  const responderInfo = activeRequest?.responderId
    ? {
        lat: activeRequest.responderLocation?.lat || -1.284123,
        lng: activeRequest.responderLocation?.lng || 36.815567,
        name: activeRequest.responderName || "Responder",
        phone: activeRequest.responderPhone || "+254798578853",
        serviceType: activeRequest.serviceType,
        eta: activeRequest.estimatedArrival || "8 minutes",
      }
    : undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Huduma Emergency Services</h1>
          <p className="text-lg text-gray-600">Quick access to emergency services - Fire, Police, and Medical</p>
          <Badge variant="destructive" className="mt-2">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Emergency Hotline: 911
          </Badge>
          {user && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Emergency Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Fire Brigade System */}
          <Card
            className="border-red-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleServiceClick("fire")}
          >
            <CardHeader className="bg-red-50 border-b border-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-red-800 text-xl">Fire Brigade</CardTitle>
                  <CardDescription className="text-red-600">Fire emergency response services</CardDescription>
                </div>
                <Badge variant="destructive">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <Image
                  src="/images/fire-truck.jpg"
                  alt="Metropolitan Fire Brigade red fire truck with emergency equipment and hose compartments"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg border-2 border-red-100"
                />
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-red-500" />
                  Emergency: 911 | Direct: (555) 0123
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" />
                  Station 1: Downtown | Station 2: Uptown
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-red-500" />
                  Avg Response: 4-6 minutes
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-red-500" />
                  Units Available: 8/10
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-red-600 hover:bg-red-700" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  {user?.role === "client" ? "Report Fire Emergency" : "Call Fire Department"}
                </Button>
                <Button variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50">
                  Report Fire Hazard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Police Service System */}
          <Card
            className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleServiceClick("police")}
          >
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-blue-800 text-xl">Police Service</CardTitle>
                  <CardDescription className="text-blue-600">Law enforcement and security services</CardDescription>
                </div>
                <Badge className="bg-blue-100 text-blue-800">On Patrol</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <Image
                  src="/images/police-officer.jpg"
                  alt="Police officer in tactical vest with emergency vehicle lights in background"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg border-2 border-blue-100"
                />
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-blue-500" />
                  Emergency: 911 | Direct: (555) 0456
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  Precinct 1: Central | Precinct 2: North
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  Avg Response: 3-5 minutes
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  Units on Duty: 12/15
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  {user?.role === "client" ? "Report Police Emergency" : "Call Police"}
                </Button>
                <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                  Report Incident
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Medical Emergency Section */}
          <Card
            className="border-green-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleServiceClick("medical")}
          >
            <CardHeader className="bg-green-50 border-b border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-green-800 text-xl">Medical Emergency</CardTitle>
                  <CardDescription className="text-green-600">Ambulance and medical response services</CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800">Ready</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <Image
                  src="/images/ambulance.jpg"
                  alt="Emergency ambulance in motion with blue and red lights showing urgent medical response"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg border-2 border-green-100"
                />
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-green-500" />
                  Emergency: 911 | Direct: (555) 0789
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-green-500" />
                  Hospital: General | Clinic: Community
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-green-500" />
                  Avg Response: 5-8 minutes
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-green-500" />
                  Ambulances: 6/8 Available
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  {user?.role === "client" ? "Report Medical Emergency" : "Call Ambulance"}
                </Button>
                <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                  Medical Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-Time Map View */}
        {user && (
          <div className="mt-8">
            <MapView userLocation={currentLocation} responderLocation={responderInfo} isTracking={!!activeRequest} />
          </div>
        )}

        {/* Incident Report Modal */}
        {selectedService && (
          <IncidentReportModal
            serviceType={selectedService}
            onClose={() => setSelectedService(null)}
            onSubmit={handleSubmitRequest}
            nearestResponder={mockResponders[selectedService]}
            userLocation={currentLocation}
          />
        )}
      </div>
    </div>
  )
}
