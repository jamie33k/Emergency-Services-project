"use client"

import { useState } from "react"
import Login from "../components/login"
import EmergencyServices from "../emergency-services"
import ResponderDashboard from "../components/responder-dashboard"
import type { User, EmergencyRequest } from "../types/emergency"

export default function EmergencyApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [requests, setRequests] = useState<EmergencyRequest[]>([])
  const [activeRequest, setActiveRequest] = useState<EmergencyRequest | null>(null)

  const handleLogin = (user: User) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setActiveRequest(null)
  }

  const handleCreateRequest = (requestData: Partial<EmergencyRequest>) => {
    const newRequest: EmergencyRequest = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: requestData.clientId || "",
      clientName: requestData.clientName || "",
      clientPhone: requestData.clientPhone || "",
      serviceType: requestData.serviceType!,
      location: requestData.location!,
      description: requestData.description || "",
      status: "pending",
      createdAt: new Date(),
      priority: requestData.priority || "medium",
    }

    setRequests((prev) => [...prev, newRequest])
    setActiveRequest(newRequest)
  }

  const handleUpdateRequest = (requestId: string, status: EmergencyRequest["status"]) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const updatedRequest = {
            ...req,
            status,
            responderId: status === "active" ? currentUser?.id : req.responderId,
            responderName: status === "active" ? currentUser?.name : req.responderName,
            responderPhone: status === "active" ? currentUser?.phone : req.responderPhone,
            acceptedAt: status === "active" ? new Date() : req.acceptedAt,
            completedAt: status === "completed" ? new Date() : req.completedAt,
            estimatedArrival: status === "active" ? "8 minutes" : req.estimatedArrival,
            responderLocation: status === "active" ? { lat: -1.2841, lng: 36.8155 } : req.responderLocation,
          }

          // Update active request if it's the current user's request
          if (req.clientId === currentUser?.id) {
            setActiveRequest(status === "completed" ? null : updatedRequest)
          }

          return updatedRequest
        }
        return req
      }),
    )
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />
  }

  if (currentUser.role === "responder") {
    return (
      <ResponderDashboard
        user={currentUser}
        onLogout={handleLogout}
        requests={requests}
        onUpdateRequest={handleUpdateRequest}
      />
    )
  }

  return (
    <EmergencyServices
      user={currentUser}
      onLogout={handleLogout}
      onCreateRequest={handleCreateRequest}
      activeRequest={activeRequest}
    />
  )
}
