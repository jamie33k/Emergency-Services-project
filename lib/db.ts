import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: string
  username: string
  password: string
  name: string
  email: string
  phone: string
  user_type: "client" | "responder"
  service_type?: "fire" | "police" | "medical"
  created_at: Date
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
  created_at: Date
  updated_at: Date
}

export class DatabaseService {
  // Initialize database tables
  static async initializeDatabase() {
    try {
      // Create users table
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100),
          phone VARCHAR(20),
          user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('client', 'responder')),
          service_type VARCHAR(20) CHECK (service_type IN ('fire', 'police', 'medical')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Create emergency_requests table
      await sql`
        CREATE TABLE IF NOT EXISTS emergency_requests (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          client_id UUID REFERENCES users(id),
          client_name VARCHAR(100) NOT NULL,
          client_phone VARCHAR(20) NOT NULL,
          service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('fire', 'police', 'medical')),
          location_lat DECIMAL(10, 8) NOT NULL,
          location_lng DECIMAL(11, 8) NOT NULL,
          location_address TEXT NOT NULL,
          description TEXT NOT NULL,
          priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
          status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
          responder_id UUID REFERENCES users(id),
          responder_name VARCHAR(100),
          responder_phone VARCHAR(20),
          estimated_arrival VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `

      // Insert demo users if they don't exist
      const existingUsers = await sql`SELECT COUNT(*) as count FROM users`
      if (existingUsers[0].count === "0") {
        await this.insertDemoUsers()
      }

      return { success: true, message: "Database initialized successfully" }
    } catch (error) {
      console.error("Database initialization error:", error)
      return { success: false, error: "Failed to initialize database" }
    }
  }

  // Insert demo users
  static async insertDemoUsers() {
    const demoUsers = [
      // Clients
      {
        username: "JohnDoe",
        password: "JohnDoe",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+254-700-111222",
        user_type: "client",
      },
      {
        username: "JaneSmith",
        password: "JaneSmith",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+254-700-333444",
        user_type: "client",
      },
      {
        username: "MikeJohnson",
        password: "MikeJohnson",
        name: "Mike Johnson",
        email: "mike.johnson@example.com",
        phone: "+254-700-555666",
        user_type: "client",
      },
      // Responders
      {
        username: "MarkMaina",
        password: "MarkMaina",
        name: "Mark Maina",
        email: "mark.maina@fire.gov.ke",
        phone: "+254-700-123456",
        user_type: "responder",
        service_type: "fire",
      },
      {
        username: "SashaMunene",
        password: "SashaMunene",
        name: "Sasha Munene",
        email: "sasha.munene@police.gov.ke",
        phone: "+254-700-789012",
        user_type: "responder",
        service_type: "police",
      },
      {
        username: "AliHassan",
        password: "AliHassan",
        name: "Ali Hassan",
        email: "ali.hassan@health.gov.ke",
        phone: "+254-700-345678",
        user_type: "responder",
        service_type: "medical",
      },
    ]

    for (const user of demoUsers) {
      await sql`
        INSERT INTO users (username, password, name, email, phone, user_type, service_type)
        VALUES (${user.username}, ${user.password}, ${user.name}, ${user.email}, ${user.phone}, ${user.user_type}, ${user.service_type || null})
        ON CONFLICT (username) DO NOTHING
      `
    }
  }

  // Authenticate user
  static async authenticateUser(username: string, password: string): Promise<User | null> {
    try {
      const result = await sql`
        SELECT * FROM users 
        WHERE username = ${username} AND password = ${password}
        LIMIT 1
      `

      return result[0] || null
    } catch (error) {
      console.error("Authentication error:", error)
      return null
    }
  }

  // Create emergency request
  static async createEmergencyRequest(requestData: Partial<EmergencyRequest>): Promise<EmergencyRequest | null> {
    try {
      const result = await sql`
        INSERT INTO emergency_requests (
          client_id, client_name, client_phone, service_type,
          location_lat, location_lng, location_address,
          description, priority
        )
        VALUES (
          ${requestData.client_id}, ${requestData.client_name}, ${requestData.client_phone},
          ${requestData.service_type}, ${requestData.location_lat}, ${requestData.location_lng},
          ${requestData.location_address}, ${requestData.description}, ${requestData.priority}
        )
        RETURNING *
      `

      return result[0] || null
    } catch (error) {
      console.error("Create request error:", error)
      return null
    }
  }

  // Get emergency request by ID
  static async getEmergencyRequest(id: string): Promise<EmergencyRequest | null> {
    try {
      const result = await sql`
        SELECT * FROM emergency_requests 
        WHERE id = ${id}
        LIMIT 1
      `

      return result[0] || null
    } catch (error) {
      console.error("Get request error:", error)
      return null
    }
  }

  // Update emergency request
  static async updateEmergencyRequest(
    id: string,
    updates: Partial<EmergencyRequest>,
  ): Promise<EmergencyRequest | null> {
    try {
      const setClause = Object.keys(updates)
        .filter((key) => updates[key as keyof EmergencyRequest] !== undefined)
        .map((key) => `${key} = $${key}`)
        .join(", ")

      if (!setClause) return null

      const result = await sql`
        UPDATE emergency_requests 
        SET ${sql.unsafe(setClause)}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
        RETURNING *
      `

      return result[0] || null
    } catch (error) {
      console.error("Update request error:", error)
      return null
    }
  }

  // Get requests by service type (for responders)
  static async getRequestsByServiceType(serviceType: string): Promise<EmergencyRequest[]> {
    try {
      const result = await sql`
        SELECT * FROM emergency_requests 
        WHERE service_type = ${serviceType}
        ORDER BY created_at DESC
      `

      return result
    } catch (error) {
      console.error("Get requests by service type error:", error)
      return []
    }
  }
}

export default DatabaseService
