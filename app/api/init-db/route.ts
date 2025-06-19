import { NextResponse } from "next/server"
import { initDatabase } from "@/lib/db"

export async function GET() {
  try {
    const result = await initDatabase()

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to initialize database",
          error: result.error ? String(result.error) : "No database connection available",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, message: "Database initialized successfully" })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      { success: false, message: "Failed to initialize database", error: String(error) },
      { status: 500 },
    )
  }
}
