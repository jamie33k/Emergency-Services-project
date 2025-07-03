import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json()

    if (!identifier || !password) {
      return NextResponse.json({ error: "Username/phone and password are required" }, { status: 400 })
    }

    const user = await authenticateUser(identifier, password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Remove sensitive data before sending response
    const { password_hash, ...userWithoutPassword } = user as any

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
