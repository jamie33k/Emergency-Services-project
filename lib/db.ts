import { neon } from "@neondatabase/serverless"

// Check if DATABASE_URL is available and log a helpful message if not
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL

if (!DATABASE_URL) {
  console.error(
    "Database connection string not found. Make sure DATABASE_URL or POSTGRES_URL environment variable is set.",
  )
}

// Initialize the SQL client with proper error handling
const sql = DATABASE_URL
  ? neon(DATABASE_URL)
  : {
      // Provide a mock implementation for when no database is available
      async query() {
        console.warn("Database connection not available, using mock data")
        return []
      },
    }

// Create tables if they don't exist
export async function initDatabase() {
  if (!DATABASE_URL) {
    console.warn("Skipping database initialization - no connection string available")
    return { success: false, message: "No database connection available" }
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS emergency_requests (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        details TEXT NOT NULL,
        location TEXT NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `
    return { success: true }
  } catch (error) {
    console.error("Failed to initialize database:", error)
    return { success: false, error }
  }
}

// Mock data for when database is not available
const MOCK_EMERGENCY_REQUESTS = [
  {
    id: 1,
    type: "medical",
    details: "Person experiencing chest pain",
    location: "40.7128,-74.0060",
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    type: "police",
    details: "Suspicious activity reported",
    location: "40.7135,-74.0046",
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Create a new emergency request
export async function createEmergencyRequest(request: {
  type: string
  details: string
  location: string
  status?: string
}) {
  const { type, details, location, status = "pending" } = request

  if (!DATABASE_URL) {
    console.warn("Using mock data - database connection not available")
    const mockRequest = {
      id: Date.now(),
      type,
      details,
      location,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return mockRequest
  }

  try {
    const result = await sql`
      INSERT INTO emergency_requests (type, details, location, status)
      VALUES (${type}, ${details}, ${location}, ${status})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating emergency request:", error)
    throw error
  }
}

// Get emergency requests by status
export async function getEmergencyRequests(status?: string) {
  if (!DATABASE_URL) {
    console.warn("Using mock data - database connection not available")
    if (status) {
      return MOCK_EMERGENCY_REQUESTS.filter((req) => req.status === status)
    }
    return MOCK_EMERGENCY_REQUESTS
  }

  try {
    if (status) {
      return await sql`
        SELECT * FROM emergency_requests 
        WHERE status = ${status}
        ORDER BY created_at DESC
      `
    }

    return await sql`
      SELECT * FROM emergency_requests
      ORDER BY created_at DESC
    `
  } catch (error) {
    console.error("Error getting emergency requests:", error)
    return []
  }
}

// Update an emergency request
export async function updateEmergencyRequest(
  id: string | number,
  updates: {
    status?: string
    details?: string
  },
) {
  const { status, details } = updates

  if (!DATABASE_URL) {
    console.warn("Using mock data - database connection not available")
    // Return a mock updated request
    return {
      id,
      type: "medical",
      details: details || "Mock emergency details",
      location: "40.7128,-74.0060",
      status: status || "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  try {
    let query = sql`
      UPDATE emergency_requests
      SET updated_at = CURRENT_TIMESTAMP
    `

    if (status) {
      query = sql`${query}, status = ${status}`
    }

    if (details) {
      query = sql`${query}, details = ${details}`
    }

    query = sql`${query} WHERE id = ${id} RETURNING *`

    const result = await query
    return result[0]
  } catch (error) {
    console.error("Error updating emergency request:", error)
    throw error
  }
}

// Delete an emergency request
export async function deleteEmergencyRequest(id: string | number) {
  if (!DATABASE_URL) {
    console.warn("Using mock data - database connection not available")
    return { success: true }
  }

  try {
    await sql`
      DELETE FROM emergency_requests
      WHERE id = ${id}
    `
    return { success: true }
  } catch (error) {
    console.error("Error deleting emergency request:", error)
    throw error
  }
}
