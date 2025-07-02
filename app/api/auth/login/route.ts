import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { identifier, password } = body

    if (!identifier || !password) {
      return NextResponse.json({ success: false, error: "Username/phone and password are required" }, { status: 400 })
    }

    // Authenticate user with either username or phone
    const user = await authenticateUser(identifier, password)

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid username/phone or password" }, { status: 401 })
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
