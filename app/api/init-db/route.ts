import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"

export async function POST() {
  try {
    const success = await initializeDatabase()

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Database initialized successfully",
      })
    } else {
      return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
    }
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Database initialization endpoint. Use POST to initialize.",
    endpoints: {
      "POST /api/init-db": "Initialize database tables and sample data",
    },
  })
}
