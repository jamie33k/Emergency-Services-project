"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Phone, Maximize2, Minimize2 } from "lucide-react"

interface MapViewProps {
  userLocation: {
    lat: number
    lng: number
    address: string
  }
  responderLocation?: {
    lat: number
    lng: number
    name: string
    phone: string
    serviceType: string
    eta: string
  }
  isTracking?: boolean
}

export default function MapView({ userLocation, responderLocation, isTracking = false }: MapViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

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

  const distance = responderLocation
    ? calculateDistance(userLocation.lat, userLocation.lng, responderLocation.lat, responderLocation.lng).toFixed(1)
    : null

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

  return (
    <Card className={`${isFullscreen ? "fixed inset-4 z-50" : ""} transition-all duration-300`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Navigation className="w-5 h-5 mr-2" />
            Real-Time Location Tracking
          </CardTitle>
          <div className="flex items-center gap-2">
            {isTracking && (
              <Badge className="bg-green-500 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                Live Tracking
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`bg-gradient-to-br from-green-100 to-blue-100 ${isFullscreen ? "h-[calc(100vh-200px)]" : "h-80"} rounded-lg relative overflow-hidden transition-all duration-300`}
        >
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

          {/* Responder Location */}
          {responderLocation && (
            <div className="absolute top-1/3 right-1/3 transform translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div
                  className={`${getServiceColor(responderLocation.serviceType)} w-6 h-6 rounded-full border-4 border-white shadow-lg animate-bounce`}
                >
                  <div className="absolute inset-0 rounded-full bg-white opacity-30 animate-ping"></div>
                </div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap font-medium">
                  {responderLocation.name}
                </div>
              </div>
            </div>
          )}

          {/* Route Line */}
          {responderLocation && (
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

          {/* Location Info Panel */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="font-medium">Your Location:</span>
                </div>
                <div className="text-xs text-gray-800">{userLocation.address}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Coordinates: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </div>
              </div>

              {responderLocation && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Navigation className="w-4 h-4 mr-1" />
                      <span className="font-medium">Responder:</span>
                    </div>
                    <Badge className={getServiceColor(responderLocation.serviceType)} size="sm">
                      {responderLocation.serviceType.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs">
                      <span className="font-medium">{responderLocation.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Distance: {distance} km</span>
                      <span className="text-green-600 font-medium">ETA: {responderLocation.eta}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Phone className="w-3 h-3 mr-1" />
                        {responderLocation.phone}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Live Update Indicator */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t">
              <div className="text-xs text-gray-500">Last updated: {currentTime.toLocaleTimeString()}</div>
              {isTracking && (
                <div className="flex items-center text-xs text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                  Tracking active
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
