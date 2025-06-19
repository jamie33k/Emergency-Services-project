export interface User {
  id: string
  name: string
  phone: string
  role: "client" | "responder"
  serviceType?: "fire" | "police" | "medical"
}

export interface EmergencyRequest {
  id: string
  clientId: string
  clientName: string
  clientPhone: string
  serviceType: "fire" | "police" | "medical"
  location: {
    lat: number
    lng: number
    address: string
  }
  description: string
  status: "pending" | "active" | "completed" | "declined"
  responderId?: string
  responderName?: string
  responderPhone?: string
  responderLocation?: {
    lat: number
    lng: number
  }
  createdAt: Date
  acceptedAt?: Date
  completedAt?: Date
  estimatedArrival?: string
  priority: "low" | "medium" | "high" | "critical"
}

export interface LoginCredentials {
  phone: string
  role: "client" | "responder"
}

export interface Responder {
  id: string
  name: string
  phone: string
  serviceType: "fire" | "police" | "medical"
  location: {
    lat: number
    lng: number
  }
  status: "available" | "busy" | "offline"
  currentRequests: number
}
