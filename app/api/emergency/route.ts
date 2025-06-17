import { type NextRequest, NextResponse } from "next/server"
import { createEmergencyRequest, getEmergencyRequests, updateEmergencyRequest } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")

    const requests = await getEmergencyRequests(status || undefined)
    return NextResponse.json({ success: true, data: requests })
  } catch (error) {
    console.error("Error fetching emergency requests:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch emergency requests", error: String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.type || !body.details || !body.location) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const newRequest = await createEmergencyRequest(body)
    return NextResponse.json({ success: true, data: newRequest }, { status: 201 })
  } catch (error) {
    console.error("Error creating emergency request:", error)
    return NextResponse.json(
      { success: false, message: "Failed to create emergency request", error: String(error) },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ success: false, message: "Missing request ID" }, { status: 400 })
    }

    const updatedRequest = await updateEmergencyRequest(body.id, {
      status: body.status,
      details: body.details,
    })

    return NextResponse.json({ success: true, data: updatedRequest })
  } catch (error) {
    console.error("Error updating emergency request:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update emergency request", error: String(error) },
      { status: 500 },
    )
  }
}
