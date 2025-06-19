"use client"

import { useState } from "react"
import Login from "../components/login"
import EmergencyServices from "../emergency-services"
import type { User } from "../types/emergency"

export default function EmergencyApp() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const handleLogin = (user: User) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    setCurrentUser(null)
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />
  }

  return <EmergencyServices user={currentUser} onLogout={handleLogout} />
}
