import { type NextRequest, NextResponse } from "next/server"
import { updateEmergencyRequest } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const updates = await request.json()

    const updatedRequest = await updateEmergencyRequest(id, updates)

    if (!updatedRequest) {
      return NextResponse.json({ error: "Emergency request not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      request: updatedRequest,
    })
  } catch (error) {
    console.error("Update emergency request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // This would typically fetch a single request by ID
    // For now, we'll return a simple response
    return NextResponse.json({
      message: `Emergency request ${id} endpoint`,
      note: "Use PUT to update request status",
    })
  } catch (error) {
    console.error("Get emergency request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
