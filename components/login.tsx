"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Lock, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import type { User as UserType } from "../types/emergency"

interface LoginProps {
  onLogin: (user: UserType) => void
}

export default function Login({ onLogin }: LoginProps) {
  const { theme, setTheme } = useTheme()
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onLogin(data.user)
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EmergencyConnect</h1>
          </div>
          <Badge variant="destructive" className="bg-red-600 hover:bg-red-700">
            🚨 Emergency Hotline: 020-2222-181
          </Badge>

          {/* Theme Toggle */}
          <div className="flex justify-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 p-0"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gray-900 dark:text-white">Sign In</CardTitle>
            <CardDescription className="text-center dark:text-gray-400">
              Enter your username/phone and password to access emergency services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-gray-700 dark:text-gray-300">
                  Username or Phone Number
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="PeterNjiru or +254798578853"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password (same as username)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle className="text-lg text-center text-gray-900 dark:text-white">Demo Accounts</CardTitle>
            <CardDescription className="text-center dark:text-gray-400">
              Use these accounts to test the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">👥 Clients:</h4>
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <div>• Username: PeterNjiru | Password: PeterNjiru</div>
                <div>• Username: MichealWekesa | Password: MichealWekesa</div>
                <div>• Username: TeejanAmusala | Password: TeejanAmusala</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">🚨 Responders:</h4>
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <div>• Username: MarkMaina | Password: MarkMaina (Fire)</div>
                <div>• Username: SashaMunene | Password: SashaMunene (Police)</div>
                <div>• Username: AliHassan | Password: AliHassan (Medical)</div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-center text-gray-500 dark:text-gray-500">
                <strong>Note:</strong> Password is the same as username for all accounts
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
