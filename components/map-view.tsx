"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation } from "lucide-react"

interface Location {
  lat: number
  lng: number
  address: string
}

interface ResponderLocation {
  lat: number
  lng: number
  name: string
  phone: string
  serviceType: string
  eta: string
}

interface MapViewProps {
  userLocation: Location
  responderLocation?: ResponderLocation
  isTracking?: boolean
}

export default function MapView({ userLocation, responderLocation, isTracking = false }: MapViewProps) {
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

  return (
    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0">
      <CardHeader>
        <CardTitle className="flex items-center text-gray-900 dark:text-white">
          <Navigation className="w-5 h-5 mr-2" />
          {isTracking ? "Live Tracking" : "Your Location"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 dark:bg-gray-700 h-64 rounded-lg flex items-center justify-center relative overflow-hidden">
          {/* Mock Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900"></div>

          {/* Grid lines for map effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-gray-400 dark:border-gray-600"></div>
              ))}
            </div>
          </div>

          {/* Your Location */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="bg-blue-600 w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow text-xs whitespace-nowrap">
              Your Location
            </div>
          </div>

          {/* Responder Location */}
          {responderLocation && isTracking && (
            <div className="absolute top-1/3 right-1/3 transform translate-x-1/2 -translate-y-1/2 z-10">
              <div
                className={`${getServiceColor(responderLocation.serviceType)} w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse`}
              ></div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                {responderLocation.name}
              </div>
            </div>
          )}

          {/* Route Line */}
          {responderLocation && isTracking && (
            <svg className="absolute inset-0 w-full h-full z-5">
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

          {/* Location Info */}
          <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg max-w-xs">
            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mb-1">
              <MapPin className="w-3 h-3 mr-1" />
              {userLocation.address}
            </div>
            {distance && responderLocation && (
              <div className="space-y-1">
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">Distance: {distance} km</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">ETA: {responderLocation.eta}</div>
                <Badge className={`${getServiceColor(responderLocation.serviceType)} text-white text-xs`}>
                  {responderLocation.serviceType.toUpperCase()}
                </Badge>
              </div>
            )}
          </div>

          {/* Status indicator */}
          {isTracking && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-green-600 text-white animate-pulse">LIVE</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
