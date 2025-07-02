import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json()

    if (!identifier || !password) {
      return NextResponse.json({ error: "Username/phone and password are required" }, { status: 400 })
    }

    const result = await authenticateUser(identifier.trim(), password.trim())

    if (result.success) {
      return NextResponse.json({
        success: true,
        user: result.user,
        message: "Login successful",
      })
    } else {
      return NextResponse.json({ error: result.error || "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
