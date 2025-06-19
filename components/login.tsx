"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Phone, Shield, User, AlertTriangle } from "lucide-react"
import type { LoginCredentials, User as UserType } from "../types/emergency"

interface LoginProps {
  onLogin: (user: UserType) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    phone: "",
    role: "client",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock user data based on role
    const mockUser: UserType = {
      id: Math.random().toString(36).substr(2, 9),
      name: credentials.role === "client" ? "John Doe" : "Officer Smith",
      phone: credentials.phone,
      role: credentials.role,
      serviceType: credentials.role === "responder" ? "police" : undefined,
    }

    onLogin(mockUser)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Huduma Emergency Services</h1>
          <p className="text-lg text-gray-600">Quick access to emergency services</p>
          <div className="mt-4 flex justify-center">
            <div className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Emergency Hotline: 911
            </div>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Sign In</CardTitle>
            <CardDescription>Access emergency services platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+254798578853"
                    value={credentials.phone}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, phone: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>I am a:</Label>
                <RadioGroup
                  value={credentials.role}
                  onValueChange={(value: "client" | "responder") =>
                    setCredentials((prev) => ({ ...prev, role: value }))
                  }
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="client" id="client" />
                    <User className="h-4 w-4 text-blue-600" />
                    <Label htmlFor="client" className="flex-1 cursor-pointer">
                      Client (Request Emergency Services)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="responder" id="responder" />
                    <Shield className="h-4 w-4 text-red-600" />
                    <Label htmlFor="responder" className="flex-1 cursor-pointer">
                      First Responder (Emergency Personnel)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
