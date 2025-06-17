"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Ambulance, PlusCircle, ShieldAlert, Flame, MapPin } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { SimpleMap } from "@/components/simple-map"
import { createEmergencyRequest } from "@/lib/db"

export default function ClientPage() {
  const searchParams = useSearchParams()
  const initialService = searchParams.get("service") || "medical"

  const [activeTab, setActiveTab] = useState(initialService)
  const [location, setLocation] = useState({ lat: 0, lng: 0 })
  const [locationStatus, setLocationStatus] = useState("loading")
  const [emergencyDetails, setEmergencyDetails] = useState("")
  const [activeRequests, setActiveRequests] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLocationStatus("success")
        },
        (error) => {
          console.error("Error getting location:", error)
          setLocationStatus("error")
        },
      )
    } else {
      setLocationStatus("unsupported")
    }
  }, [])

  const handleEmergencyRequest = async () => {
    if (locationStatus !== "success" || emergencyDetails.trim() === "") return

    setIsSubmitting(true)
    setError(null)

    try {
      // Create a new emergency request
      const newRequest = {
        type: activeTab,
        location: `${location.lat},${location.lng}`,
        details: emergencyDetails,
        status: "pending",
      }

      // Save to database
      const savedRequest = await createEmergencyRequest(newRequest)

      // Add to local state
      setActiveRequests([
        ...activeRequests,
        {
          ...savedRequest,
          location: location,
          timestamp: new Date().toISOString(),
        },
      ])

      // Clear form
      setEmergencyDetails("")

      // Simulate response after 3 seconds
      setTimeout(() => {
        setActiveRequests((prev) =>
          prev.map((req) =>
            req.id === savedRequest.id
              ? {
                  ...req,
                  status: "accepted",
                  responder: {
                    name: "Emergency Unit #42",
                    eta: "8 minutes",
                    distance: "2.3 km",
                  },
                }
              : req,
          ),
        )
      }, 3000)
    } catch (error) {
      console.error("Error creating emergency request:", error)
      setError("Failed to submit emergency request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getServiceIcon = (type) => {
    switch (type) {
      case "medical":
        return <Ambulance className="h-5 w-5" />
      case "police":
        return <ShieldAlert className="h-5 w-5" />
      case "fire":
        return <Flame className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  const getServiceColor = (type) => {
    switch (type) {
      case "medical":
        return "bg-red-600"
      case "police":
        return "bg-blue-600"
      case "fire":
        return "bg-orange-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold text-red-600">EmergencyConnect</h1>
            </Link>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                Client Dashboard
              </Badge>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">Logout</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-red-500" />
                  Your Location
                </CardTitle>
                <CardDescription>
                  {locationStatus === "loading" && "Detecting your exact location..."}
                  {locationStatus === "success" &&
                    "Your current location has been detected and will be shared with emergency responders."}
                  {locationStatus === "error" &&
                    "Unable to detect your location. Please enable location services in your browser settings."}
                  {locationStatus === "unsupported" &&
                    "Your browser doesn't support geolocation. Please try a different browser."}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <SimpleMap location={location} status={locationStatus} activeRequests={activeRequests} />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Request Emergency Service</CardTitle>
                <CardDescription>Select the type of emergency service you need</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="medical" className="flex items-center gap-2">
                      <Ambulance className="h-4 w-4" /> Medical
                    </TabsTrigger>
                    <TabsTrigger value="police" className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" /> Police
                    </TabsTrigger>
                    <TabsTrigger value="fire" className="flex items-center gap-2">
                      <Flame className="h-4 w-4" /> Fire
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="medical" className="mt-4 space-y-4">
                    <div className="mb-4 overflow-hidden rounded-md">
                      <img
                        src="/placeholder.svg?height=150&width=300"
                        alt="Ambulance service"
                        className="h-32 w-full object-cover"
                      />
                    </div>
                    <Textarea
                      placeholder="Describe your medical emergency..."
                      value={emergencyDetails}
                      onChange={(e) => setEmergencyDetails(e.target.value)}
                    />
                  </TabsContent>

                  <TabsContent value="police" className="mt-4 space-y-4">
                    <div className="mb-4 overflow-hidden rounded-md">
                      <img
                        src="/placeholder.svg?height=150&width=300"
                        alt="Police service"
                        className="h-32 w-full object-cover"
                      />
                    </div>
                    <Textarea
                      placeholder="Describe your security emergency..."
                      value={emergencyDetails}
                      onChange={(e) => setEmergencyDetails(e.target.value)}
                    />
                  </TabsContent>

                  <TabsContent value="fire" className="mt-4 space-y-4">
                    <div className="mb-4 overflow-hidden rounded-md">
                      <img
                        src="/placeholder.svg?height=150&width=300"
                        alt="Fire brigade service"
                        className="h-32 w-full object-cover"
                      />
                    </div>
                    <Textarea
                      placeholder="Describe your fire emergency..."
                      value={emergencyDetails}
                      onChange={(e) => setEmergencyDetails(e.target.value)}
                    />
                  </TabsContent>
                </Tabs>

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleEmergencyRequest}
                  disabled={locationStatus !== "success" || emergencyDetails.trim() === "" || isSubmitting}
                  className={`w-full ${getServiceColor(activeTab)}`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Request{" "}
                      {activeTab === "medical" ? "Ambulance" : activeTab === "police" ? "Police" : "Fire Brigade"}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Active Requests</h2>

          {activeRequests.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No active requests</AlertTitle>
              <AlertDescription>
                You don't have any active emergency requests. Use the form above to request assistance.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeRequests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                      {getServiceIcon(request.type)}
                      <CardTitle className="text-lg capitalize">{request.type} Emergency</CardTitle>
                    </div>
                    <Badge
                      className={
                        request.status === "pending"
                          ? "bg-yellow-500"
                          : request.status === "accepted"
                            ? "bg-green-500"
                            : "bg-red-500"
                      }
                    >
                      {request.status === "pending"
                        ? "Searching"
                        : request.status === "accepted"
                          ? "Responder Found"
                          : "Declined"}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="overflow-hidden rounded-md">
                        <img
                          src="/placeholder.svg?height=120&width=300"
                          alt={`${request.type} service`}
                          className="h-24 w-full object-cover"
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Requested at {new Date(request.timestamp || request.created_at).toLocaleTimeString()}
                      </p>
                      <p className="text-sm">{request.details}</p>

                      {request.responder && (
                        <div className="mt-4 rounded-md bg-slate-100 p-3">
                          <p className="font-medium">{request.responder.name}</p>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-sm">ETA: {request.responder.eta}</span>
                            <span className="text-sm">Distance: {request.responder.distance}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      {request.status === "pending" ? "Cancel Request" : "Contact Responder"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
