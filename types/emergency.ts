export interface User {
  id: string
  name: string
  username: string
  phone: string
  password?: string
  role: "client" | "responder"
  service_type?: "fire" | "police" | "medical" | null
  status: "available" | "busy" | "offline"
  current_location_lat?: number
  current_location_lng?: number
  created_at: Date
  updated_at: Date
}

export interface EmergencyRequest {
  id: string
  client_id: string
  client_name: string
  client_phone: string
  service_type: "fire" | "police" | "medical"
  location_lat: number
  location_lng: number
  location_address?: string
  description: string
  status: "pending" | "active" | "completed" | "declined"
  priority: "low" | "medium" | "high" | "critical"
  responder_id?: string
  responder_name?: string
  responder_phone?: string
  responder_location_lat?: number
  responder_location_lng?: number
  estimated_arrival?: string
  created_at: Date
  accepted_at?: Date
  completed_at?: Date
  updated_at: Date
}

export interface EmergencyContact {
  id: string
  name: string
  phone: string
  service_type: "fire" | "police" | "medical"
  location?: string
  is_active: boolean
  created_at: Date
}

export interface RequestStatusHistory {
  id: string
  request_id: string
  status: string
  changed_by?: string
  notes?: string
  created_at: Date
}

export interface Location {
  lat: number
  lng: number
  address?: string
}

export interface Responder {
  id: string
  name: string
  phone: string
  service_type: "fire" | "police" | "medical"
  location: Location
  status: "available" | "busy" | "offline"
  current_requests: number
}

export interface LoginCredentials {
  phone: string
  role: "client" | "responder"
}
