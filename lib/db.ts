import { neon } from "@neondatabase/serverless"

// Database connection with fallback
const getDatabaseConnection = () => {
  const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.NEON_DATABASE_URL

  if (!connectionString) {
    console.warn("No database connection string found. Using mock data.")
    return null
  }

  try {
    return neon(connectionString)
  } catch (error) {
    console.error("Failed to connect to database:", error)
    return null
  }
}

const sql = getDatabaseConnection()

// Mock data for fallback
const mockUsers = [
  {
    id: "1",
    name: "Peter Njiru",
    username: "PeterNjiru",
    phone: "+254798578853",
    password: "PeterNjiru",
    role: "client",
  },
  {
    id: "2",
    name: "Micheal Wekesa",
    username: "MichealWekesa",
    phone: "+254798578854",
    password: "MichealWekesa",
    role: "client",
  },
  {
    id: "3",
    name: "Teejan Amusala",
    username: "TeejanAmusala",
    phone: "+254798578855",
    password: "TeejanAmusala",
    role: "client",
  },
  {
    id: "4",
    name: "Mark Maina",
    username: "MarkMaina",
    phone: "+254700123456",
    password: "MarkMaina",
    role: "responder",
    service_type: "fire",
    status: "available",
  },
  {
    id: "5",
    name: "Sasha Munene",
    username: "SashaMunene",
    phone: "+254700789012",
    password: "SashaMunene",
    role: "responder",
    service_type: "police",
    status: "available",
  },
  {
    id: "6",
    name: "Ali Hassan",
    username: "AliHassan",
    phone: "+254700345678",
    password: "AliHassan",
    role: "responder",
    service_type: "medical",
    status: "available",
  },
]

const mockRequests = [
  {
    id: "1",
    client_id: "1",
    client_name: "Peter Njiru",
    client_phone: "+254798578853",
    service_type: "medical",
    location_lat: -1.2921,
    location_lng: 36.8219,
    location_address: "Westlands, Nairobi",
    description: "Chest pain and difficulty breathing",
    status: "active",
    priority: "high",
    responder_id: "6",
    responder_name: "Ali Hassan",
    responder_phone: "+254700345678",
    estimated_arrival: "8 minutes",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    client_id: "2",
    client_name: "Micheal Wekesa",
    client_phone: "+254798578854",
    service_type: "fire",
    location_lat: -1.2864,
    location_lng: 36.8172,
    location_address: "Karen, Nairobi",
    description: "Kitchen fire in apartment building",
    status: "pending",
    priority: "critical",
    responder_id: null,
    responder_name: null,
    responder_phone: null,
    estimated_arrival: null,
    created_at: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
  },
]

// Check if database tables exist
async function checkDatabaseTables() {
  if (!sql) return false

  try {
    await sql`SELECT 1 FROM users LIMIT 1`
    return true
  } catch (error) {
    console.warn("Database tables not found, using mock data:", error.message)
    return false
  }
}

// Authentication function - supports both username and phone
export async function authenticateUser(identifier: string, password: string) {
  // Check if database is available and tables exist
  const dbAvailable = await checkDatabaseTables()

  if (!dbAvailable) {
    console.log("Using mock authentication")
    const user = mockUsers.find((u) => (u.phone === identifier || u.username === identifier) && u.password === password)
    return user || null
  }

  try {
    const result = await sql`
      SELECT id, name, username, phone, role, service_type, status
      FROM users 
      WHERE (phone = ${identifier} OR username = ${identifier}) AND password = ${password}
      LIMIT 1
    `
    return result[0] || null
  } catch (error) {
    console.error("Authentication failed:", error)
    // Fallback to mock data if database query fails
    const user = mockUsers.find((u) => (u.phone === identifier || u.username === identifier) && u.password === password)
    return user || null
  }
}

// Get user by ID
export async function getUserById(id: string) {
  const dbAvailable = await checkDatabaseTables()

  if (!dbAvailable) {
    return mockUsers.find((u) => u.id === id) || null
  }

  try {
    const result = await sql`
      SELECT id, name, username, phone, role, service_type, status,
             current_location_lat, current_location_lng
      FROM users 
      WHERE id = ${id}
      LIMIT 1
    `
    return result[0] || null
  } catch (error) {
    console.error("Failed to get user:", error)
    return mockUsers.find((u) => u.id === id) || null
  }
}

// Get emergency requests
export async function getEmergencyRequests(status?: string) {
  const dbAvailable = await checkDatabaseTables()

  if (!dbAvailable) {
    console.log("Using mock data for emergency requests")
    return status ? mockRequests.filter((r) => r.status === status) : mockRequests
  }

  try {
    let query
    if (status) {
      query = sql`
        SELECT * FROM emergency_requests 
        WHERE status = ${status}
        ORDER BY created_at DESC
      `
    } else {
      query = sql`
        SELECT * FROM emergency_requests 
        ORDER BY created_at DESC
      `
    }
    const result = await query
    return result
  } catch (error) {
    console.error("Database query failed:", error)
    return status ? mockRequests.filter((r) => r.status === status) : mockRequests
  }
}

// Create emergency request
export async function createEmergencyRequest(data: {
  client_id: string
  client_name: string
  client_phone: string
  service_type: string
  location_lat: number
  location_lng: number
  location_address?: string
  description: string
  priority?: string
}) {
  const dbAvailable = await checkDatabaseTables()

  if (!dbAvailable) {
    console.log("Using mock data - request would be created")
    const newRequest = {
      id: Date.now().toString(),
      ...data,
      status: "pending",
      priority: data.priority || "medium",
      responder_id: null,
      responder_name: null,
      responder_phone: null,
      estimated_arrival: null,
      created_at: new Date().toISOString(),
    }
    mockRequests.unshift(newRequest)
    return newRequest
  }

  try {
    const result = await sql`
      INSERT INTO emergency_requests (
        client_id, client_name, client_phone, service_type, 
        location_lat, location_lng, location_address, 
        description, priority, status
      ) VALUES (
        ${data.client_id}, ${data.client_name}, ${data.client_phone}, ${data.service_type},
        ${data.location_lat}, ${data.location_lng}, ${data.location_address || ""},
        ${data.description}, ${data.priority || "medium"}, 'pending'
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Failed to create emergency request:", error)
    // Fallback to mock data
    const newRequest = {
      id: Date.now().toString(),
      ...data,
      status: "pending",
      priority: data.priority || "medium",
      responder_id: null,
      responder_name: null,
      responder_phone: null,
      estimated_arrival: null,
      created_at: new Date().toISOString(),
    }
    mockRequests.unshift(newRequest)
    return newRequest
  }
}

// Update request status
export async function updateRequestStatus(
  id: string,
  status: string,
  responder_data?: {
    responder_id: string
    responder_name: string
    responder_phone: string
    estimated_arrival: string
  },
) {
  const dbAvailable = await checkDatabaseTables()

  if (!dbAvailable) {
    console.log("Using mock data - status would be updated")
    const request = mockRequests.find((r) => r.id === id)
    if (request) {
      request.status = status
      if (responder_data) {
        Object.assign(request, responder_data)
      }
    }
    return request
  }

  try {
    const result = await sql`
      UPDATE emergency_requests 
      SET 
        status = ${status},
        responder_id = ${responder_data?.responder_id || null},
        responder_name = ${responder_data?.responder_name || null},
        responder_phone = ${responder_data?.responder_phone || null},
        estimated_arrival = ${responder_data?.estimated_arrival || null},
        accepted_at = ${status === "active" ? new Date().toISOString() : null},
        completed_at = ${status === "completed" ? new Date().toISOString() : null}
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Failed to update request status:", error)
    // Fallback to mock data
    const request = mockRequests.find((r) => r.id === id)
    if (request) {
      request.status = status
      if (responder_data) {
        Object.assign(request, responder_data)
      }
    }
    return request
  }
}

// Get available responders by service type
export async function getAvailableResponders(serviceType: string) {
  const dbAvailable = await checkDatabaseTables()

  if (!dbAvailable) {
    return mockUsers.filter((u) => u.role === "responder" && u.service_type === serviceType)
  }

  try {
    const result = await sql`
      SELECT id, name, username, phone, service_type, status,
             current_location_lat, current_location_lng
      FROM users 
      WHERE role = 'responder' 
        AND service_type = ${serviceType}
        AND status = 'available'
      ORDER BY name
    `
    return result
  } catch (error) {
    console.error("Failed to get responders:", error)
    return mockUsers.filter((u) => u.role === "responder" && u.service_type === serviceType)
  }
}

// Initialize database tables (for development)
export async function initializeDatabase() {
  if (!sql) {
    console.log("No database connection available")
    return false
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
        client_id UUID NOT NULL,
        client_name VARCHAR(100) NOT NULL,
        client_phone VARCHAR(20) NOT NULL,
        service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('fire', 'police', 'medical')),
        location_lat DECIMAL(10, 8) NOT NULL,
        location_lng DECIMAL(11, 8) NOT NULL,
        location_address TEXT,
        description TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'declined')),
        priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
        responder_id UUID,
        responder_name VARCHAR(100),
        responder_phone VARCHAR(20),
        responder_location_lat DECIMAL(10, 8),
        responder_location_lng DECIMAL(11, 8),
        estimated_arrival VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        accepted_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE
      )
    `

    // Insert sample users with username as password
    await sql`
      INSERT INTO users (name, username, phone, password, role, service_type, status) VALUES
      ('Peter Njiru', 'PeterNjiru', '+254798578853', 'PeterNjiru', 'client', NULL, NULL),
      ('Micheal Wekesa', 'MichealWekesa', '+254798578854', 'MichealWekesa', 'client', NULL, NULL),
      ('Teejan Amusala', 'TeejanAmusala', '+254798578855', 'TeejanAmusala', 'client', NULL, NULL),
      ('Mark Maina', 'MarkMaina', '+254700123456', 'MarkMaina', 'responder', 'fire', 'available'),
      ('Sasha Munene', 'SashaMunene', '+254700789012', 'SashaMunene', 'responder', 'police', 'available'),
      ('Ali Hassan', 'AliHassan', '+254700345678', 'AliHassan', 'responder', 'medical', 'available')
      ON CONFLICT (username) DO NOTHING
    `

    console.log("Database initialized successfully")
    return true
  } catch (error) {
    console.error("Failed to initialize database:", error)
    return false
  }
}
