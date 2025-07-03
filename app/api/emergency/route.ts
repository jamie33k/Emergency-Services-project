import { type NextRequest, NextResponse } from "next/server"
import { createEmergencyRequest, getEmergencyRequests } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const requests = await getEmergencyRequests(userId || undefined)

    return NextResponse.json({
      success: true,
      requests,
    })
  } catch (error) {
    console.error("Get emergency requests error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()

    const { user_id, service_type, description, location, latitude, longitude, priority = "medium" } = requestData

    if (!user_id || !service_type || !description || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newRequest = await createEmergencyRequest({
      user_id,
      service_type,
      description,
      location,
      latitude,
      longitude,
      status: "pending",
      priority,
    })

    return NextResponse.json({
      success: true,
      request: newRequest,
    })
  } catch (error) {
    console.error("Create emergency request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
