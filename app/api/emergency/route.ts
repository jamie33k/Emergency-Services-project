import { type NextRequest, NextResponse } from "next/server"
import { getEmergencyRequests, createEmergencyRequest } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const requests = await getEmergencyRequests(status || undefined)
    return NextResponse.json({ success: true, data: requests })
  } catch (error) {
    console.error("Failed to fetch emergency requests:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch requests" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      client_id,
      client_name,
      client_phone,
      service_type,
      location_lat,
      location_lng,
      location_address,
      description,
      priority,
    } = body

    if (
      !client_id ||
      !client_name ||
      !client_phone ||
      !service_type ||
      !location_lat ||
      !location_lng ||
      !description
    ) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const newRequest = await createEmergencyRequest({
      client_id,
      client_name,
      client_phone,
      service_type,
      location_lat: Number.parseFloat(location_lat),
      location_lng: Number.parseFloat(location_lng),
      location_address,
      description,
      priority: priority || "medium",
    })

    return NextResponse.json({ success: true, data: newRequest })
  } catch (error) {
    console.error("Failed to create emergency request:", error)
    return NextResponse.json({ success: false, message: "Failed to create request" }, { status: 500 })
  }
}
