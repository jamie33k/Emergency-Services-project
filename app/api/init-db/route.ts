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
      return NextResponse.json(
        {
          success: false,
          message: "Failed to initialize database - no connection available",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Database initialization failed",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Database initialization endpoint. Use POST to initialize.",
  })
}
