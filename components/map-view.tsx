"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2 } from "lucide-react"

export default function MapView() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const getCurrentLocation = () => {
    setIsLoading(true)
    setError("")

    if (!navigator.geolocation) {
      setError("Geolocation not supported")
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ lat: latitude, lng: longitude })
        setIsLoading(false)
      },
      (error) => {
        console.error("Geolocation error:", error)
        setError("Unable to get location")
        setIsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 300
    canvas.height = 200

    // Clear canvas
    ctx.fillStyle = "#f3f4f6"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (location) {
      // Draw a simple map representation
      ctx.fillStyle = "#10b981"
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7)

      ctx.fillStyle = "#3b82f6"
      ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3)

      // Draw location marker
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Marker pin
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(centerX, centerY - 10, 8, 0, 2 * Math.PI)
      ctx.fill()

      // Marker point
      ctx.fillStyle = "#dc2626"
      ctx.beginPath()
      ctx.moveTo(centerX, centerY - 2)
      ctx.lineTo(centerX - 6, centerY - 18)
      ctx.lineTo(centerX + 6, centerY - 18)
      ctx.closePath()
      ctx.fill()

      // Location text
      ctx.fillStyle = "#1f2937"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`, centerX, canvas.height - 10)
    } else {
      // Draw placeholder
      ctx.fillStyle = "#6b7280"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Click to get your location", canvas.width / 2, canvas.height / 2)
    }
  }, [location])

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="w-full border rounded-lg cursor-pointer"
        onClick={getCurrentLocation}
        style={{ maxWidth: "100%", height: "auto" }}
      />

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={getCurrentLocation} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
          {isLoading ? "Getting..." : "Update Location"}
        </Button>

        {location && (
          <div className="text-sm text-muted-foreground">
            {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </div>
        )}
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  )
}
