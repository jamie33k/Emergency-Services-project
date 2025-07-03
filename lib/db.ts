import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: string
  username: string
  phone: string
  email: string
  role: "client" | "responder"
  service_type?: string
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

// Mock data for fallback when database is not available
const mockUsers: User[] = [
  {
    id: "1",
    username: "PeterNjiru",
    phone: "+254798578853",
    email: "peter@example.com",
    role: "client",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    username: "MichealWekesa",
    phone: "+254798578854",
    email: "micheal@example.com",
    role: "client",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    username: "TeejanAmusala",
    phone: "+254798578855",
    email: "teejan@example.com",
    role: "client",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    username: "MarkMaina",
    phone: "+254700123456",
    email: "mark@fire.gov.ke",
    role: "responder",
    service_type: "fire",
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    username: "SashaMunene",
    phone: "+254700789012",
    email: "sasha@police.gov.ke",
    role: "responder",
    service_type: "police",
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    username: "AliHassan",
    phone: "+254700345678",
    email: "ali@health.gov.ke",
    role: "responder",
    service_type: "medical",
    created_at: new Date().toISOString(),
  },
]

const mockRequests: EmergencyRequest[] = [
  {
    id: "1",
    user_id: "1",
    service_type: "medical",
    description: "Heart attack emergency",
    location: "Nairobi CBD, Kenya",
    latitude: -1.2921,
    longitude: 36.8219,
    status: "pending",
    priority: "critical",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function authenticateUser(identifier: string, password: string): Promise<User | null> {
  try {
    // Try database first
    const result = await sql`
      SELECT * FROM users 
      WHERE (username = ${identifier} OR phone = ${identifier}) 
      AND password_hash = ${password}
      LIMIT 1
    `

    if (result.length > 0) {
      return result[0] as User
    }

    return null
  } catch (error) {
    console.log("Database not available, using mock data:", error)

    // Fallback to mock data
    const user = mockUsers.find(
      (u) => (u.username === identifier || u.phone === identifier) && u.username === password, // Password is same as username in mock data
    )

    return user || null
  }
}

export async function createEmergencyRequest(
  request: Omit<EmergencyRequest, "id" | "created_at" | "updated_at">,
): Promise<EmergencyRequest> {
  const newRequest: EmergencyRequest = {
    ...request,
    id: Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  try {
    // Try database first
    const result = await sql`
      INSERT INTO emergency_requests (
        id, user_id, service_type, description, location, 
        latitude, longitude, status, priority, assigned_responder_id
      ) VALUES (
        ${newRequest.id}, ${newRequest.user_id}, ${newRequest.service_type}, 
        ${newRequest.description}, ${newRequest.location}, ${newRequest.latitude}, 
        ${newRequest.longitude}, ${newRequest.status}, ${newRequest.priority}, 
        ${newRequest.assigned_responder_id}
      ) RETURNING *
    `

    return result[0] as EmergencyRequest
  } catch (error) {
    console.log("Database not available, using mock storage:", error)

    // Fallback to mock data (in real app, you'd use localStorage or similar)
    mockRequests.push(newRequest)
    return newRequest
  }
}

export async function getEmergencyRequests(userId?: string): Promise<EmergencyRequest[]> {
  try {
    // Try database first
    let query = `SELECT * FROM emergency_requests`
    const params = []

    if (userId) {
      query += ` WHERE user_id = $1 OR assigned_responder_id = $1`
      params.push(userId)
    }

    query += ` ORDER BY created_at DESC`

    const result = await sql(query, params)
    return result as EmergencyRequest[]
  } catch (error) {
    console.log("Database not available, using mock data:", error)

    // Fallback to mock data
    if (userId) {
      return mockRequests.filter((r) => r.user_id === userId || r.assigned_responder_id === userId)
    }
    return mockRequests
  }
}

export async function updateEmergencyRequest(
  id: string,
  updates: Partial<EmergencyRequest>,
): Promise<EmergencyRequest | null> {
  try {
    // Try database first
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(", ")

    const values = [id, ...Object.values(updates)]

    const result = await sql(
      `UPDATE emergency_requests SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      values,
    )

    return (result[0] as EmergencyRequest) || null
  } catch (error) {
    console.log("Database not available, using mock data:", error)

    // Fallback to mock data
    const requestIndex = mockRequests.findIndex((r) => r.id === id)
    if (requestIndex !== -1) {
      mockRequests[requestIndex] = {
        ...mockRequests[requestIndex],
        ...updates,
        updated_at: new Date().toISOString(),
      }
      return mockRequests[requestIndex]
    }
    return null
  }
}

export async function initializeDatabase(): Promise<boolean> {
  try {
    // Create tables
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(50) UNIQUE NOT NULL,
        phone VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'responder')),
        service_type VARCHAR(20) CHECK (service_type IN ('medical', 'fire', 'police')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    await sql`
      CREATE TABLE IF NOT EXISTS emergency_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('medical', 'fire', 'police')),
        description TEXT NOT NULL,
        location VARCHAR(255) NOT NULL,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'completed', 'cancelled')),
        priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
        assigned_responder_id UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Insert sample users
    await sql`
      INSERT INTO users (username, phone, email, password_hash, role, service_type) VALUES
      ('PeterNjiru', '+254798578853', 'peter@example.com', 'PeterNjiru', 'client', NULL),
      ('MichealWekesa', '+254798578854', 'micheal@example.com', 'MichealWekesa', 'client', NULL),
      ('TeejanAmusala', '+254798578855', 'teejan@example.com', 'TeejanAmusala', 'client', NULL),
      ('MarkMaina', '+254700123456', 'mark@fire.gov.ke', 'MarkMaina', 'responder', 'fire'),
      ('SashaMunene', '+254700789012', 'sasha@police.gov.ke', 'SashaMunene', 'responder', 'police'),
      ('AliHassan', '+254700345678', 'ali@health.gov.ke', 'AliHassan', 'responder', 'medical')
      ON CONFLICT (username) DO NOTHING
    `

    return true
  } catch (error) {
    console.error("Database initialization failed:", error)
    return false
  }
}
