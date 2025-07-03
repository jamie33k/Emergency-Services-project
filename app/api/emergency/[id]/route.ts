import { type NextRequest, NextResponse } from "next/server"
import DatabaseService from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const updates = await request.json()

    // Transform frontend updates to database format
    const dbUpdates: any = {}
    if (updates.status) dbUpdates.status = updates.status
    if (updates.responderName) dbUpdates.responder_name = updates.responderName
    if (updates.responderPhone) dbUpdates.responder_phone = updates.responderPhone
    if (updates.estimatedArrival) dbUpdates.estimated_arrival = updates.estimatedArrival

    const updatedRequest = await DatabaseService.updateEmergencyRequest(id, dbUpdates)

    if (!updatedRequest) {
      return NextResponse.json({ error: "Request not found or update failed" }, { status: 404 })
    }

    // Transform database response to match frontend interface
    const response = {
      id: updatedRequest.id,
      clientId: updatedRequest.client_id,
      clientName: updatedRequest.client_name,
      clientPhone: updatedRequest.client_phone,
      serviceType: updatedRequest.service_type,
      location: {
        lat: Number.parseFloat(updatedRequest.location_lat.toString()),
        lng: Number.parseFloat(updatedRequest.location_lng.toString()),
        address: updatedRequest.location_address,
      },
      description: updatedRequest.description,
      priority: updatedRequest.priority,
      status: updatedRequest.status,
      responderName: updatedRequest.responder_name,
      responderPhone: updatedRequest.responder_phone,
      estimatedArrival: updatedRequest.estimated_arrival,
      createdAt: updatedRequest.created_at,
      updatedAt: updatedRequest.updated_at,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Update emergency request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const emergencyRequest = await DatabaseService.getEmergencyRequest(id)

    if (!emergencyRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    // Transform database response to match frontend interface
    const response = {
      id: emergencyRequest.id,
      clientId: emergencyRequest.client_id,
      clientName: emergencyRequest.client_name,
      clientPhone: emergencyRequest.client_phone,
      serviceType: emergencyRequest.service_type,
      location: {
        lat: Number.parseFloat(emergencyRequest.location_lat.toString()),
        lng: Number.parseFloat(emergencyRequest.location_lng.toString()),
        address: emergencyRequest.location_address,
      },
      description: emergencyRequest.description,
      priority: emergencyRequest.priority,
      status: emergencyRequest.status,
      responderName: emergencyRequest.responder_name,
      responderPhone: emergencyRequest.responder_phone,
      estimatedArrival: emergencyRequest.estimated_arrival,
      createdAt: emergencyRequest.created_at,
      updatedAt: emergencyRequest.updated_at,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Get emergency request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
