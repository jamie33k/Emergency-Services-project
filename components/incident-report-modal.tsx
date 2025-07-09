"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Loader2 } from "lucide-react"

interface IncidentReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  isLoading: boolean
}

export default function IncidentReportModal({ isOpen, onClose, onSubmit, isLoading }: IncidentReportModalProps) {
  const [formData, setFormData] = useState({
    service_type: "",
    location_address: "",
    description: "",
    priority: "medium",
  })
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState("")
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    setLocationError("")

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser")
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ lat: latitude, lng: longitude })

        // Reverse geocoding simulation (in real app, use Google Maps API)
        setFormData((prev) => ({
          ...prev,
          location_address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        }))
        setIsGettingLocation(false)
      },
      (error) => {
        console.error("Geolocation error:", error)
        setLocationError("Unable to get your location. Please enter address manually.")
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        service_type: "",
        location_address: "",
        description: "",
        priority: "medium",
      })
      setLocation(null)
      setLocationError("")

      // Automatically get location when modal opens
      getCurrentLocation()
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.service_type || !formData.location_address || !formData.description) {
      return
    }

    const requestData = {
      ...formData,
      location_lat: location?.lat || 0,
      location_lng: location?.lng || 0,
    }

    onSubmit(requestData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Emergency</DialogTitle>
          <DialogDescription>
            Please provide details about the emergency situation. Help is on the way.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="service_type">Emergency Type *</Label>
            <Select value={formData.service_type} onValueChange={(value) => handleInputChange("service_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select emergency type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fire">🚒 Fire Emergency</SelectItem>
                <SelectItem value="police">🚔 Police Emergency</SelectItem>
                <SelectItem value="medical">🚑 Medical Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priority Level</Label>
            <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="location_address">Location *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <MapPin className="h-4 w-4 mr-2" />
                )}
                {isGettingLocation ? "Getting..." : "Get Location"}
              </Button>
            </div>
            <Input
              id="location_address"
              value={formData.location_address}
              onChange={(e) => handleInputChange("location_address", e.target.value)}
              placeholder="Enter your location or address"
              required
            />
            {locationError && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{locationError}</AlertDescription>
              </Alert>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe the emergency situation in detail..."
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading || !formData.service_type || !formData.location_address || !formData.description}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Emergency Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
