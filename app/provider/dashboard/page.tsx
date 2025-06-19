"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, XCircle, Ambulance, ShieldAlert, Flame, Clock } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { EmergencyMap } from "@/components/emergency-map"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("incoming")
  const [location, setLocation] = useState({ lat: 0, lng: 0 })
  const [locationStatus, setLocationStatus] = useState("loading")
  const [isAvailable, setIsAvailable] = useState(true)
  const [serviceType, setServiceType] = useState("medical")
  const [incomingRequests, setIncomingRequests] = useState<any[]>([])
  const [activeResponses, setActiveResponses] = useState<any[]>([])

  useEffect(() => {
    // Get provider's location with more detailed error handling
    if (navigator.geolocation) {
      setLocationStatus("loading")
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLocationStatus("success")
          console.log("Provider location detected:", position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.error("Error getting location:", error)
          setLocationStatus("error")

          // Provide more specific error messages based on the error code
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("Provider denied the request for geolocation.")
              break
            case error.POSITION_UNAVAILABLE:
              console.error("Provider location information is unavailable.")
              break
            case error.TIMEOUT:
              console.error("The request to get provider location timed out.")
              break
            default:
              console.error("An unknown error occurred.")
              break
          }
        },
        {
          enableHighAccuracy: true, // Get the most accurate position
          timeout: 10000, // Time to wait for a position
          maximumAge: 0, // Don't use a cached position
        },
      )
    } else {
      setLocationStatus("unsupported")
      console.error("Geolocation is not supported by this browser.")
    }

    // Simulate incoming emergency request after 5 seconds
    const timer = setTimeout(() => {
      if (isAvailable) {
        const newRequest = {
          id: "req-" + Date.now(),
          type: serviceType,
          status: "pending",
          location: {
            lat: location.lat + (Math.random() * 0.01 - 0.005),
            lng: location.lng + (Math.random() * 0.01 - 0.005),
          },
          details:
            serviceType === "medical"
              ? "Person experiencing chest pain and difficulty breathing"
              : serviceType === "police"
                ? "Suspicious activity reported in the area"
                : "Small kitchen fire, smoke visible",
          timestamp: new Date().toISOString(),
          distance: "2.3 km",
          eta: "8 minutes",
          requester: {
            name: "John Doe",
            phone: "+1 (555) 123-4567",
          },
        }

        setIncomingRequests((prev) => [...prev, newRequest])
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [isAvailable, serviceType, location])

  const handleAcceptRequest = (requestId: string) => {
    const request = incomingRequests.find((req) => req.id === requestId)
    if (request) {
      // Move from incoming to active
      setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId))
      setActiveResponses((prev) => [...prev, { ...request, status: "accepted" }])
    }
  }

  const handleDeclineRequest = (requestId: string) => {
    setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId))
  }

  const handleCompleteResponse = (responseId: string) => {
    setActiveResponses((prev) => prev.filter((resp) => resp.id !== responseId))
  }

  const getServiceIcon = (type: string) => {
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

  const getServiceColor = (type: string) => {
    switch (type) {
      case "medical":
        return "text-red-600"
      case "police":
        return "text-blue-600"
      case "fire":
        return "text-orange-600"
      default:
        return "text-gray-600"
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
                Provider Dashboard
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
                <CardTitle>Service Area Map</CardTitle>
                <CardDescription>
                  {locationStatus === "loading" && "Detecting your exact location..."}
                  {locationStatus === "success" &&
                    "Your current location has been detected. You will receive emergency requests from this area."}
                  {locationStatus === "error" &&
                    "Unable to detect your location. Please enable location services in your browser settings."}
                  {locationStatus === "unsupported" &&
                    "Your browser doesn't support geolocation. Please try a different browser."}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <EmergencyMap
                  location={location}
                  status={locationStatus}
                  activeRequests={[...incomingRequests, ...activeResponses]}
                  isProvider={true}
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
                <CardDescription>Manage your availability and service type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="availability">Availability</Label>
                    <p className="text-sm text-muted-foreground">
                      {isAvailable ? "You are currently available for service" : "You are currently offline"}
                    </p>
                  </div>
                  <Switch id="availability" checked={isAvailable} onCheckedChange={setIsAvailable} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service-type">Service Type</Label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger id="service-type">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medical">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 overflow-hidden rounded-full">
                            <img
                              src="/images/ambulance-card.png"
                              alt="Ambulance"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span>Medical (Ambulance)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="police">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 overflow-hidden rounded-full">
                            <img src="/images/police-card.png" alt="Police" className="h-full w-full object-cover" />
                          </div>
                          <span>Police</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="fire">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 overflow-hidden rounded-full">
                            <img
                              src="/images/fire-card.png"
                              alt="Fire Brigade"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span>Fire Brigade</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md bg-slate-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Current Status</span>
                    <Badge variant={isAvailable ? "default" : "secondary"}>{isAvailable ? "Online" : "Offline"}</Badge>
                  </div>
                  <div className="mt-2 text-sm">
                    <p>Active Responses: {activeResponses.length}</p>
                    <p>Pending Requests: {incomingRequests.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="incoming" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Incoming Requests
                {incomingRequests.length > 0 && <Badge className="ml-2 bg-red-500">{incomingRequests.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="active" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Active Responses
                {activeResponses.length > 0 && <Badge className="ml-2">{activeResponses.length}</Badge>}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="incoming" className="mt-6">
              {incomingRequests.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No incoming requests</AlertTitle>
                  <AlertDescription>There are currently no emergency requests in your area.</AlertDescription>
                </Alert>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {incomingRequests.map((request) => (
                    <Card
                      key={request.id}
                      className="border-l-4"
                      style={{
                        borderLeftColor:
                          request.type === "medical" ? "#dc2626" : request.type === "police" ? "#2563eb" : "#ea580c",
                      }}
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-2">
                          {getServiceIcon(request.type)}
                          <CardTitle className="text-lg capitalize">{request.type} Emergency</CardTitle>
                        </div>
                        <Badge className="bg-yellow-500">New Request</Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="overflow-hidden rounded-md">
                            <img
                              src={`/images/${request.type === "medical" ? "ambulance" : request.type === "police" ? "police" : "fire"}-card.png`}
                              alt={`${request.type} service`}
                              className="h-24 w-full object-cover"
                            />
                          </div>
                          <p className="text-sm text-gray-500">
                            Requested at {new Date(request.timestamp).toLocaleTimeString()}
                          </p>
                          <p className="text-sm">{request.details}</p>

                          <div className="mt-4 rounded-md bg-slate-100 p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Distance:</span>
                              <span className="text-sm">{request.distance}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">ETA:</span>
                              <span className="text-sm">{request.eta}</span>
                            </div>
                            <div className="mt-2 text-sm">
                              <p className="font-medium">Requester: {request.requester.name}</p>
                              <p>Phone: {request.requester.phone}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button
                          onClick={() => handleAcceptRequest(request.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Accept
                        </Button>
                        <Button onClick={() => handleDeclineRequest(request.id)} variant="outline" className="flex-1">
                          <XCircle className="mr-2 h-4 w-4" />
                          Decline
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="active" className="mt-6">
              {activeResponses.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No active responses</AlertTitle>
                  <AlertDescription>You don't have any active emergency responses at the moment.</AlertDescription>
                </Alert>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {activeResponses.map((response) => (
                    <Card
                      key={response.id}
                      className="border-l-4"
                      style={{
                        borderLeftColor:
                          response.type === "medical" ? "#dc2626" : response.type === "police" ? "#2563eb" : "#ea580c",
                      }}
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-2">
                          {getServiceIcon(response.type)}
                          <CardTitle className="text-lg capitalize">{response.type} Response</CardTitle>
                        </div>
                        <Badge className="bg-green-500">In Progress</Badge>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="overflow-hidden rounded-md">
                            <img
                              src={`/images/${response.type === "medical" ? "ambulance" : response.type === "police" ? "police" : "fire"}-card.png`}
                              alt={`${response.type} service`}
                              className="h-24 w-full object-cover"
                            />
                          </div>
                          <p className="text-sm text-gray-500">
                            Accepted at {new Date(response.timestamp).toLocaleTimeString()}
                          </p>
                          <p className="text-sm">{response.details}</p>

                          <div className="mt-4 rounded-md bg-slate-100 p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Distance:</span>
                              <span className="text-sm">{response.distance}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">ETA:</span>
                              <span className="text-sm">{response.eta}</span>
                            </div>
                            <div className="mt-2 text-sm">
                              <p className="font-medium">Requester: {response.requester.name}</p>
                              <p>Phone: {response.requester.phone}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button onClick={() => handleCompleteResponse(response.id)} className="w-full">
                          Mark as Complete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
