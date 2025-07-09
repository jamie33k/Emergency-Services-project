import { type NextRequest, NextResponse } from "next/server"
import DatabaseService from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    // Try database authentication first
    let user = null
    try {
      user = await DatabaseService.authenticateUser(username, password)
    } catch (dbError) {
      console.error("Database authentication failed:", dbError)
    }

    // If database authentication fails, use hardcoded demo accounts as fallback
    if (!user) {
      const demoAccounts = [
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

      user = demoAccounts.find((account) => account.username === username && account.password === password)
    }

    if (user) {
      // Return user data without password
      const { password: _, ...userWithoutPassword } = user
      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
      })
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
