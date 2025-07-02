export interface User {
  id: string
  name: string
  phone: string
  username?: string
  role: "client" | "responder"
  serviceType?: "fire" | "police" | "medical"
  status?: "available" | "busy" | "offline"
  currentLocation?: {
    lat: number
    lng: number
  }
  createdAt?: Date
  updatedAt?: Date
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
    address?: string
  }
  description: string
  status: "pending" | "active" | "completed" | "declined"
  priority?: "low" | "medium" | "high" | "critical"
  responderId?: string
  responderName?: string
  responderPhone?: string
  responderLocation?: {
    lat: number
    lng: number
  }
  estimatedArrival?: string
  createdAt: Date
  acceptedAt?: Date
  completedAt?: Date
}

export interface EmergencyContact {
  id: string
  name: string
  phone: string
  serviceType: "fire" | "police" | "medical"
  location?: string
  isActive: boolean
  createdAt: Date
}

export interface RequestStatusHistory {
  id: string
  requestId: string
  status: EmergencyRequest["status"]
  changedBy?: string
  notes?: string
  createdAt: Date
}
