import { type NextRequest, NextResponse } from "next/server"
import { updateEmergencyRequest } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const requestId = params.id
    const updates = await request.json()

    if (!requestId) {
      return NextResponse.json({ error: "Request ID is required" }, { status: 400 })
    }

    const result = await updateEmergencyRequest(requestId, updates)

    if (result.success) {
      return NextResponse.json({
        success: true,
        request: result.request,
        message: "Request updated successfully",
      })
    } else {
      return NextResponse.json({ error: result.error || "Failed to update request" }, { status: 500 })
    }
  } catch (error) {
    console.error("Update emergency request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
