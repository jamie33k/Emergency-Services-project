"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, MapPin, Phone, Clock, Navigation, FileText } from "lucide-react"
import type { EmergencyRequest, Responder } from "../types/emergency"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface IncidentReportModalProps {
  serviceType: "fire" | "police" | "medical"
  request: EmergencyRequest
  onClose: () => void
  onSubmit: (request: Partial<EmergencyRequest>) => void
  onSubmitReport: (requestId: string, report: { status: string; notes: string }) => void
  nearestResponder?: Responder
  userLocation: {
    lat: number
    lng: number
    address: string
  }
}

export default function IncidentReportModal({
  serviceType,
  request,
  onClose,
  onSubmit,
  onSubmitReport,
  nearestResponder,
  userLocation,
}: IncidentReportModalProps) {
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [report, setReport] = useState({
    status: "completed",
    notes: "",
  })

  const getServiceColor = (service: string) => {
    switch (service) {
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

  const getServiceIcon = (service: string) => {
    switch (service) {
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

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLng = ((lng2 - lng1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const distance = nearestResponder
    ? calculateDistance(
        userLocation.lat,
        userLocation.lng,
        nearestResponder.location.lat,
        nearestResponder.location.lng,
      )
    : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const request: Partial<EmergencyRequest> = {
      serviceType,
      description,
      priority,
      location: userLocation,
      status: "pending",
      createdAt: new Date(),
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
    onSubmit(request)
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-xl">
              <span className="mr-2">{getServiceIcon(serviceType)}</span>
              Report {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)} Emergency
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Your Location Map Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center text-lg font-semibold text-blue-800 mb-4">
              <MapPin className="w-5 h-5 mr-2" />
              Your Location
            </div>

            {/* Interactive Map */}
            <div className="bg-gradient-to-br from-green-100 to-blue-100 h-64 rounded-lg relative overflow-hidden mb-4">
              {/* Map Grid Background */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Roads */}
              <svg className="absolute inset-0 w-full h-full">
                <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#666" strokeWidth="3" opacity="0.3" />
                <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#666" strokeWidth="3" opacity="0.3" />
                <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#666" strokeWidth="3" opacity="0.3" />
                <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#666" strokeWidth="3" opacity="0.3" />
              </svg>

              {/* Your Location */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="bg-blue-600 w-6 h-6 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap font-medium">
                    Your Location
                  </div>
                  {/* Accuracy Circle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-blue-300 rounded-full opacity-50 animate-ping"></div>
                </div>
              </div>

              {/* Nearest Responder Location */}
              {nearestResponder && (
                <div className="absolute top-1/3 right-1/3 transform translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div
                      className={`${getServiceColor(nearestResponder.serviceType)} w-6 h-6 rounded-full border-4 border-white shadow-lg animate-bounce`}
                    >
                      <div className="absolute inset-0 rounded-full bg-white opacity-30 animate-ping"></div>
                    </div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap font-medium">
                      Nearest Responder
                    </div>
                  </div>
                </div>
              )}

              {/* Route Line */}
              {nearestResponder && (
                <svg className="absolute inset-0 w-full h-full">
                  <line
                    x1="50%"
                    y1="50%"
                    x2="66%"
                    y2="33%"
                    stroke="#ef4444"
                    strokeWidth="3"
                    strokeDasharray="8,4"
                    className="animate-pulse"
                  />
                  {/* Direction Arrow */}
                  <polygon points="64,31 68,35 64,39" fill="#ef4444" className="animate-pulse" />
                </svg>
              )}
            </div>

            {/* Location Details */}
            <div className="bg-white p-3 rounded border">
              <div className="text-sm text-blue-700 font-medium">{userLocation.address}</div>
              <div className="text-xs text-gray-500 mt-1">
                Coordinates: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
              </div>
              <div className="text-xs text-green-600 mt-1 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                Location accuracy: High (GPS enabled)
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Priority Level</label>
              <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low - Non-urgent situation</SelectItem>
                  <SelectItem value="medium">🟡 Medium - Requires attention</SelectItem>
                  <SelectItem value="high">🟠 High - Urgent response needed</SelectItem>
                  <SelectItem value="critical">🔴 Critical - Life threatening</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Incident Description</label>
              <Textarea
                placeholder={`Describe the ${serviceType} emergency in detail...`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              />
            </div>

            {nearestResponder && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <Navigation className="w-4 h-4 mr-2" />
                    Nearest Available Responder
                  </h3>
                  <Badge className={getServiceColor(nearestResponder.serviceType)}>
                    {nearestResponder.serviceType.toUpperCase()}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{nearestResponder.name}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-1 text-gray-600" />
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 text-blue-600">{nearestResponder.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-gray-600">Distance:</span>
                      <span className="ml-2 font-medium">{distance.toFixed(1)} km away</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-1 text-gray-600" />
                      <span className="text-gray-600">Est. Arrival:</span>
                      <span className="ml-2 text-green-600 font-medium">{Math.ceil(distance * 2)} minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!description.trim() || isSubmitting}
                className={`flex-1 ${getServiceColor(serviceType)} hover:opacity-90`}
              >
                {isSubmitting ? "Submitting Emergency Request..." : "Submit Emergency Request"}
              </Button>
            </div>
          </form>

          {/* Complete Emergency Response Dialog */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 mt-4">
                <FileText className="w-4 h-4 mr-2" />
                Complete
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Complete Emergency Response</DialogTitle>
                <DialogDescription>Submit your incident report for request #{request.id.slice(-6)}</DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  onSubmitReport(request.id, report)
                  setIsOpen(false)
                  setReport({ status: "completed", notes: "" })
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">Final Status</label>
                  <Select
                    value={report.status}
                    onValueChange={(value) => setReport((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">✅ Successfully Completed</SelectItem>
                      <SelectItem value="resolved">✅ Resolved</SelectItem>
                      <SelectItem value="transferred">🔄 Transferred to Another Unit</SelectItem>
                      <SelectItem value="cancelled">❌ Cancelled/False Alarm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Incident Notes</label>
                  <Textarea
                    placeholder="Describe the actions taken, outcome, and any relevant details..."
                    value={report.notes}
                    onChange={(e) => setReport((prev) => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                    Submit Report
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
