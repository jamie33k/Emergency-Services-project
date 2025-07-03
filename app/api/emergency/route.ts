import { type NextRequest, NextResponse } from "next/server"
import DatabaseService from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json()

    const emergencyRequest = await DatabaseService.createEmergencyRequest({
      client_id: requestData.clientId,
      client_name: requestData.clientName,
      client_phone: requestData.clientPhone,
      service_type: requestData.serviceType,
      location_lat: requestData.location.lat,
      location_lng: requestData.location.lng,
      location_address: requestData.location.address,
      description: requestData.description,
      priority: requestData.priority,
    })

    if (!emergencyRequest) {
      return NextResponse.json({ error: "Failed to create emergency request" }, { status: 500 })
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
      createdAt: emergencyRequest.created_at,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("Create emergency request error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceType = searchParams.get("serviceType")

    if (!serviceType) {
      return NextResponse.json({ error: "Service type is required" }, { status: 400 })
    }

    const requests = await DatabaseService.getRequestsByServiceType(serviceType)

    // Transform database responses to match frontend interface
    const transformedRequests = requests.map((req) => ({
      id: req.id,
      clientId: req.client_id,
      clientName: req.client_name,
      clientPhone: req.client_phone,
      serviceType: req.service_type,
      location: {
        lat: Number.parseFloat(req.location_lat.toString()),
        lng: Number.parseFloat(req.location_lng.toString()),
        address: req.location_address,
      },
      description: req.description,
      priority: req.priority,
      status: req.status,
      responderName: req.responder_name,
      responderPhone: req.responder_phone,
      estimatedArrival: req.estimated_arrival,
      createdAt: req.created_at,
      updatedAt: req.updated_at,
    }))

    return NextResponse.json(transformedRequests)
  } catch (error) {
    console.error("Get emergency requests error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
