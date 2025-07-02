import { type NextRequest, NextResponse } from "next/server"
import { updateRequestStatus } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, responder_data } = body

    if (!status) {
      return NextResponse.json({ success: false, message: "Status is required" }, { status: 400 })
    }

    const updatedRequest = await updateRequestStatus(params.id, status, responder_data)

    if (!updatedRequest) {
      return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedRequest })
  } catch (error) {
    console.error("Failed to update request status:", error)
    return NextResponse.json({ success: false, message: "Failed to update request" }, { status: 500 })
  }
}
