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
      if (Number(existingUsers[0].count) === 0) {
        await this.insertDemoUsers()
      }

      return { success: true, message: "Database initialized successfully" }
    } catch (error) {
      console.error("Database initialization error:", error)
      return { success: false, error: "Failed to initialize database" }
    }
  }

  // Insert demo users with proper UUIDs
  static async insertDemoUsers() {
    const demoUsers = [
      // Clients
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        username: "PeterNjiru",
        password: "PeterNjiru",
        name: "Peter Njiru",
        email: "peter.njiru@example.com",
        phone: "+254798578853",
        user_type: "client",
        service_type: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        username: "MichealWekesa",
        password: "MichealWekesa",
        name: "Micheal Wekesa",
        email: "micheal.wekesa@example.com",
        phone: "+254798578854",
        user_type: "client",
        service_type: null,
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        username: "TeejanAmusala",
        password: "TeejanAmusala",
        name: "Teejan Amusala",
        email: "teejan.amusala@example.com",
        phone: "+254798578855",
        user_type: "client",
        service_type: null,
      },
      // Responders
      {
        id: "550e8400-e29b-41d4-a716-446655440004",
        username: "MarkMaina",
        password: "MarkMaina",
        name: "Mark Maina",
        email: "mark.maina@fire.gov.ke",
        phone: "+254700123456",
        user_type: "responder",
        service_type: "fire",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440005",
        username: "SashaMunene",
        password: "SashaMunene",
        name: "Sasha Munene",
        email: "sasha.munene@police.gov.ke",
        phone: "+254700789012",
        user_type: "responder",
        service_type: "police",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440006",
        username: "AliHassan",
        password: "AliHassan",
        name: "Ali Hassan",
        email: "ali.hassan@health.gov.ke",
        phone: "+254700345678",
        user_type: "responder",
        service_type: "medical",
      },
    ]

    for (const user of demoUsers) {
      try {
        await sql`
          INSERT INTO users (id, username, password, name, email, phone, user_type, service_type)
          VALUES (${user.id}::uuid, ${user.username}, ${user.password}, ${user.name}, ${user.email}, ${user.phone}, ${user.user_type}, ${user.service_type})
          ON CONFLICT (username) DO NOTHING
        `
      } catch (error) {
        console.error(`Error inserting user ${user.username}:`, error)
      }
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
      throw error
    }
  }

  // Create emergency request
  static async createEmergencyRequest(requestData: Partial<EmergencyRequest>): Promise<EmergencyRequest | null> {
    try {
      // Validate that client_id is a valid UUID
      if (!requestData.client_id) {
        throw new Error("client_id is required")
      }

      const result = await sql`
        INSERT INTO emergency_requests (
          client_id, client_name, client_phone, service_type,
          location_lat, location_lng, location_address,
          description, priority
        )
        VALUES (
          ${requestData.client_id}::uuid, 
          ${requestData.client_name}, 
          ${requestData.client_phone},
          ${requestData.service_type}, 
          ${requestData.location_lat}, 
          ${requestData.location_lng},
          ${requestData.location_address}, 
          ${requestData.description}, 
          ${requestData.priority}
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
        WHERE id = ${id}::uuid
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
      // Build the SET clause dynamically
      const updateFields = []
      const values = []

      if (updates.status !== undefined) {
        updateFields.push(`status = $${updateFields.length + 2}`)
        values.push(updates.status)
      }
      if (updates.responder_id !== undefined) {
        updateFields.push(`responder_id = $${updateFields.length + 2}::uuid`)
        values.push(updates.responder_id)
      }
      if (updates.responder_name !== undefined) {
        updateFields.push(`responder_name = $${updateFields.length + 2}`)
        values.push(updates.responder_name)
      }
      if (updates.responder_phone !== undefined) {
        updateFields.push(`responder_phone = $${updateFields.length + 2}`)
        values.push(updates.responder_phone)
      }
      if (updates.estimated_arrival !== undefined) {
        updateFields.push(`estimated_arrival = $${updateFields.length + 2}`)
        values.push(updates.estimated_arrival)
      }

      if (updateFields.length === 0) {
        return null
      }

      const query = `
        UPDATE emergency_requests 
        SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1::uuid
        RETURNING *
      `

      const result = await sql.unsafe(query, [id, ...values])
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
