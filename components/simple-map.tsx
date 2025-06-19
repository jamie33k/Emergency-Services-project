"use client"

import { useRef, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface SimpleMapProps {
  location: { lat: number; lng: number }
  status: string
  activeRequests?: any[]
  isProvider?: boolean
}

export function SimpleMap({ location, status, activeRequests = [], isProvider = false }: SimpleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status !== "success" || !mapRef.current) return

    // Create a simple canvas-based map
    const canvas = document.createElement("canvas")
    canvas.width = mapRef.current.clientWidth
    canvas.height = mapRef.current.clientHeight
    mapRef.current.innerHTML = ""
    mapRef.current.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw map background
    ctx.fillStyle = "#e2e8f0"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines
    ctx.strokeStyle = "#cbd5e1"
    ctx.lineWidth = 2

    // Horizontal grid lines
    for (let i = 0; i < 5; i++) {
      const y = (canvas.height / 6) * (i + 1)
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Vertical grid lines
    for (let i = 0; i < 5; i++) {
      const x = (canvas.width / 6) * (i + 1)
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Draw current location
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Current location marker
    ctx.fillStyle = isProvider ? "#3b82f6" : "#ef4444"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2)
    ctx.fill()

    // Draw a radius circle
    ctx.strokeStyle = isProvider ? "rgba(59, 130, 246, 0.3)" : "rgba(239, 68, 68, 0.3)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, 80, 0, Math.PI * 2)
    ctx.stroke()

    // Add coordinates text
    ctx.fillStyle = "#1e293b"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(`Your Location: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`, centerX, canvas.height - 20)

    // Draw active requests
    activeRequests.forEach((request, index) => {
      // Calculate a position relative to center for the request
      const angle = (index * Math.PI) / 3
      const distance = 60 + (index % 3) * 20
      const x = centerX + Math.cos(angle) * distance
      const y = centerY + Math.sin(angle) * distance

      // Request marker
      let markerColor
      if (request.type === "medical") markerColor = "#dc2626"
      else if (request.type === "police") markerColor = "#2563eb"
      else if (request.type === "fire") markerColor = "#ea580c"
      else markerColor = "#64748b"

      ctx.fillStyle = markerColor
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()

      // Draw line to request
      ctx.strokeStyle = "rgba(100, 116, 139, 0.4)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()

      // Label
      ctx.fillStyle = "#1e293b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(request.type.charAt(0).toUpperCase(), x, y - 15)

      // Distance
      const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)) / 10
      ctx.font = "8px sans-serif"
      ctx.fillText(`${dist.toFixed(1)} km`, x, y + 15)
    })
  }, [location, status, activeRequests, isProvider])

  if (status === "loading") {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Detecting your location...</span>
      </div>
    )
  }

  if (status === "error" || status === "unsupported") {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-center text-muted-foreground">
          {status === "error"
            ? "Unable to access your location. Please enable location services."
            : "Your browser doesn't support geolocation."}
        </p>
      </div>
    )
  }

  return <div ref={mapRef} className="h-full w-full rounded-md" />
}
