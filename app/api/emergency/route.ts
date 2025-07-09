import { type NextRequest, NextResponse } from "next/server"
import DatabaseService from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()

    // Validate required fields
    const requiredFields = [
      "client_id",
      "client_name",
      "client_phone",
      "service_type",
      "location_lat",
      "location_lng",
      "location_address",
      "description",
      "priority",
    ]

    for (const field of requiredFields) {
      if (!requestData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const emergencyRequest = await DatabaseService.createEmergencyRequest(requestData)

    if (emergencyRequest) {
      return NextResponse.json({ success: true, request: emergencyRequest })
    } else {
      return NextResponse.json({ error: "Failed to create emergency request" }, { status: 500 })
    }
  } catch (error) {
    console.error("Emergency request creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceType = searchParams.get("serviceType")

    if (serviceType) {
      const requests = await DatabaseService.getRequestsByServiceType(serviceType)
      return NextResponse.json({ success: true, requests })
    } else {
      return NextResponse.json({ error: "Service type is required" }, { status: 400 })
    }
  } catch (error) {
    console.error("Get emergency requests error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
