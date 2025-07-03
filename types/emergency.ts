export interface User {
  id: string
  username: string
  name: string
  email: string
  phone: string
  userType: "client" | "responder"
  serviceType?: "fire" | "police" | "medical"
}

export interface Location {
  lat: number
  lng: number
  address: string
}

export interface EmergencyRequest {
  id: string
  clientId: string
  clientName: string
  clientPhone: string
  serviceType: "fire" | "police" | "medical"
  location: Location
  description: string
  priority: "low" | "medium" | "high" | "critical"
  status: "pending" | "active" | "completed" | "cancelled"
  responderName?: string
  responderPhone?: string
  responderLocation?: {
    lat: number
    lng: number
  }
  estimatedArrival?: string
  createdAt: Date
  updatedAt?: Date
  completedAt?: Date
  incidentReport?: {
    status: string
    notes: string
  }
}

export interface ServiceProvider {
  id: string
  name: string
  serviceType: "fire" | "police" | "medical"
  phone: string
  location: Location
  isAvailable: boolean
  responseTime: number
}

export interface EmergencyContact {
  id: string
  serviceType: "fire" | "police" | "medical"
  name: string
  phone: string
  location?: string
  responseTime?: number
  isActive: boolean
}
