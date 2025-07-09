export interface User {
  id: string
  username: string
  name: string
  email: string
  phone: string
  userType: "client" | "responder"
  serviceType?: "fire" | "police" | "medical"
}

export interface EmergencyRequest {
  id: string
  client_id: string
  client_name: string
  client_phone: string
  service_type: "fire" | "police" | "medical"
  location_lat: number
  location_lng: number
  location_address: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  status: "pending" | "active" | "completed" | "cancelled"
  responder_id?: string
  responder_name?: string
  responder_phone?: string
  estimated_arrival?: string
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
