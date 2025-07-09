import { NextResponse } from "next/server"
import DatabaseService from "@/lib/db"

export async function POST() {
  try {
    const result = await DatabaseService.initializeDatabase()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Database initialization error:", error)
    return NextResponse.json({ success: false, error: "Failed to initialize database" }, { status: 500 })
  }
}
