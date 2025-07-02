import { neon } from "@neondatabase/serverless"

// Database connection
let sql: any = null

try {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL

  if (connectionString) {
    sql = neon(connectionString)
    console.log("✅ Database connection established")
  } else {
    console.warn("⚠️ No database connection string found. Using mock data.")
  }
} catch (error) {
  console.error("❌ Database connection failed:", error)
  sql = null
}

// Mock data for fallback
const mockUsers = [
  // Clients
  {
    id: "client-1",
    name: "Peter Njiru",
    username: "PeterNjiru",
    phone: "+254798578853",
    password: "PeterNjiru",
    role: "client",
    service_type: null,
    status: "available",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "client-2",
    name: "Micheal Wekesa",
    username: "MichealWekesa",
    phone: "+254798578854",
    password: "MichealWekesa",
    role: "client",
    service_type: null,
    status: "available",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "client-3",
    name: "Teejan Amusala",
    username: "TeejanAmusala",
    phone: "+254798578855",
    password: "TeejanAmusala",
    role: "client",
    service_type: null,
    status: "available",
    created_at: new Date(),
    updated_at: new Date(),
  },
  // Responders
  {
    id: "responder-1",
    name: "Mark Maina",
    username: "MarkMaina",
    phone: "+254700123456",
    password: "MarkMaina",
    role: "responder",
    service_type: "fire",
    status: "available",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "responder-2",
    name: "Sasha Munene",
    username: "SashaMunene",
    phone: "+254700789012",
    password: "SashaMunene",
    role: "responder",
    service_type: "police",
    status: "available",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "responder-3",
    name: "Ali Hassan",
    username: "AliHassan",
    phone: "+254700345678",
    password: "AliHassan",
    role: "responder",
    service_type: "medical",
    status: "available",
    created_at: new Date(),
    updated_at: new Date(),
  },
]

const mockEmergencyRequests: any[] = []

// Database functions
export async function authenticateUser(identifier: string, password: string) {
  try {
    if (sql) {
      // Try database first
      const result = await sql`
        SELECT * FROM users 
        WHERE (username = ${identifier} OR phone = ${identifier}) 
        AND password = ${password}
        LIMIT 1
      `

      if (result.length > 0) {
        return { success: true, user: result[0] }
      }
    }
  } catch (error) {
    console.warn("Database authentication failed, using mock data:", error)
  }

  // Fallback to mock data
  const user = mockUsers.find((u) => (u.username === identifier || u.phone === identifier) && u.password === password)

  if (user) {
    return { success: true, user }
  }

  return { success: false, error: "Invalid credentials" }
}

export async function createEmergencyRequest(requestData: any) {
  try {
    if (sql) {
      // Try database first
      const result = await sql`
        INSERT INTO emergency_requests (
          client_id, client_name, client_phone, service_type,
          location_lat, location_lng, location_address, description,
          status, priority, created_at
        ) VALUES (
          ${requestData.clientId}, ${requestData.clientName}, ${requestData.clientPhone},
          ${requestData.serviceType}, ${requestData.location.lat}, ${requestData.location.lng},
          ${requestData.location.address}, ${requestData.description},
          ${requestData.status || "pending"}, ${requestData.priority || "medium"},
          NOW()
        )
        RETURNING *
      `

      if (result.length > 0) {
        return { success: true, request: result[0] }
      }
    }
  } catch (error) {
    console.warn("Database request creation failed, using mock data:", error)
  }

  // Fallback to mock data
  const newRequest = {
    id: `req-${Date.now()}`,
    ...requestData,
    status: requestData.status || "pending",
    priority: requestData.priority || "medium",
    created_at: new Date(),
    updated_at: new Date(),
  }

  mockEmergencyRequests.push(newRequest)
  return { success: true, request: newRequest }
}

export async function getEmergencyRequests(filters: any = {}) {
  try {
    if (sql) {
      // Try database first
      let query = "SELECT * FROM emergency_requests WHERE 1=1"
      const params: any[] = []

      if (filters.status) {
        query += ` AND status = $${params.length + 1}`
        params.push(filters.status)
      }

      if (filters.service_type) {
        query += ` AND service_type = $${params.length + 1}`
        params.push(filters.service_type)
      }

      query += " ORDER BY created_at DESC"

      const result = await sql(query, params)
      return { success: true, requests: result }
    }
  } catch (error) {
    console.warn("Database query failed, using mock data:", error)
  }

  // Fallback to mock data
  let filteredRequests = [...mockEmergencyRequests]

  if (filters.status) {
    filteredRequests = filteredRequests.filter((r) => r.status === filters.status)
  }

  if (filters.service_type) {
    filteredRequests = filteredRequests.filter((r) => r.service_type === filters.service_type)
  }

  return { success: true, requests: filteredRequests }
}

export async function updateEmergencyRequest(requestId: string, updates: any) {
  try {
    if (sql) {
      // Try database first
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(", ")

      const values = [requestId, ...Object.values(updates)]

      const result = await sql(
        `UPDATE emergency_requests SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
        values,
      )

      if (result.length > 0) {
        return { success: true, request: result[0] }
      }
    }
  } catch (error) {
    console.warn("Database update failed, using mock data:", error)
  }

  // Fallback to mock data
  const requestIndex = mockEmergencyRequests.findIndex((r) => r.id === requestId)
  if (requestIndex !== -1) {
    mockEmergencyRequests[requestIndex] = {
      ...mockEmergencyRequests[requestIndex],
      ...updates,
      updated_at: new Date(),
    }
    return { success: true, request: mockEmergencyRequests[requestIndex] }
  }

  return { success: false, error: "Request not found" }
}

export async function initializeDatabase() {
  if (!sql) {
    return { success: false, error: "No database connection available" }
  }

  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'responder')),
        service_type VARCHAR(20) CHECK (service_type IN ('fire', 'police', 'medical')),
        status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'busy', 'offline')),
        current_location_lat DECIMAL(10, 8),
        current_location_lng DECIMAL(11, 8),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create emergency_requests table
    await sql`
      CREATE TABLE IF NOT EXISTS emergency_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id VARCHAR(100) NOT NULL,
        client_name VARCHAR(100) NOT NULL,
        client_phone VARCHAR(20) NOT NULL,
        service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('fire', 'police', 'medical')),
        location_lat DECIMAL(10, 8) NOT NULL,
        location_lng DECIMAL(11, 8) NOT NULL,
        location_address TEXT,
        description TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'declined')),
        priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
        responder_id VARCHAR(100),
        responder_name VARCHAR(100),
        responder_phone VARCHAR(20),
        responder_location_lat DECIMAL(10, 8),
        responder_location_lng DECIMAL(11, 8),
        estimated_arrival VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        accepted_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Insert sample users
    for (const user of mockUsers) {
      await sql`
        INSERT INTO users (name, username, phone, password, role, service_type, status)
        VALUES (${user.name}, ${user.username}, ${user.phone}, ${user.password}, ${user.role}, ${user.service_type}, ${user.status})
        ON CONFLICT (username) DO NOTHING
      `
    }

    return { success: true, message: "Database initialized successfully" }
  } catch (error) {
    console.error("Database initialization failed:", error)
    return { success: false, error: error.message }
  }
}
