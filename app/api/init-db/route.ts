import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"

export async function POST() {
  try {
    const result = await initializeDatabase()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
      })
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 })
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
