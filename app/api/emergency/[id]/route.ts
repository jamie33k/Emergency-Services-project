import { type NextRequest, NextResponse } from "next/server"
import DatabaseService from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const emergencyRequest = await DatabaseService.getEmergencyRequest(params.id)

    if (emergencyRequest) {
      return NextResponse.json({ success: true, request: emergencyRequest })
    } else {
      return NextResponse.json({ error: "Emergency request not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Get emergency request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const emergencyRequest = await DatabaseService.updateEmergencyRequest(params.id, updates)

    if (emergencyRequest) {
      return NextResponse.json({ success: true, request: emergencyRequest })
    } else {
      return NextResponse.json({ error: "Failed to update emergency request" }, { status: 500 })
    }
  } catch (error) {
    console.error("Update emergency request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
