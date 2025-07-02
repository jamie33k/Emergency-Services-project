import { type NextRequest, NextResponse } from "next/server"
import { createEmergencyRequest, getEmergencyRequests } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const serviceType = searchParams.get("service_type")

    const filters: any = {}
    if (status) filters.status = status
    if (serviceType) filters.service_type = serviceType

    const result = await getEmergencyRequests(filters)

    if (result.success) {
      return NextResponse.json({
        success: true,
        requests: result.requests,
      })
    } else {
      return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 })
    }
  } catch (error) {
    console.error("Get emergency requests error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()

    // Validate required fields
    const requiredFields = ["clientId", "clientName", "clientPhone", "serviceType", "location", "description"]
    for (const field of requiredFields) {
      if (!requestData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const result = await createEmergencyRequest(requestData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        request: result.request,
        message: "Emergency request created successfully",
      })
    } else {
      return NextResponse.json({ error: result.error || "Failed to create request" }, { status: 500 })
    }
  } catch (error) {
    console.error("Create emergency request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
