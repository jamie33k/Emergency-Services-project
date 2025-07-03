export interface User {
  id: string
  username: string
  phone: string
  email: string
  role: "client" | "responder"
  service_type?: "medical" | "fire" | "police"
  created_at: string
}

export interface EmergencyRequest {
  id: string
  user_id: string
  service_type: "medical" | "fire" | "police"
  description: string
  location: string
  latitude?: number
  longitude?: number
  status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "critical"
  assigned_responder_id?: string
  created_at: string
  updated_at: string
}

export interface EmergencyContact {
  id: string
  service_type: "medical" | "fire" | "police"
  name: string
  phone: string
  location?: string
  is_active: boolean
  created_at: string
}

export interface Location {
  latitude: number
  longitude: number
  address?: string
}

export interface ServiceProvider {
  id: string
  name: string
  service_type: "medical" | "fire" | "police"
  phone: string
  location: Location
  status: "available" | "busy" | "offline"
  rating?: number
}
