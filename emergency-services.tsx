import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, MapPin, Clock, Users, AlertTriangle } from "lucide-react"
import Image from "next/image"

export default function EmergencyServices() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Huduma Emergency Services</h1>
          <p className="text-lg text-gray-600">Quick access to emergency services - Fire, Police, and Medical</p>
          <Badge variant="destructive" className="mt-2">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Emergency Hotline: 911
          </Badge>
        </div>

        {/* Emergency Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Fire Brigade System */}
          <Card className="border-red-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-red-50 border-b border-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-red-800 text-xl">Fire Brigade</CardTitle>
                  <CardDescription className="text-red-600">Fire emergency response services</CardDescription>
                </div>
                <Badge variant="destructive">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <Image
                  src="/images/fire-truck.jpg"
                  alt="Metropolitan Fire Brigade red fire truck with emergency equipment and hose compartments"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg border-2 border-red-100"
                />
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-red-500" />
                  Emergency: 911 | Direct: (555) 0123
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" />
                  Station 1: Downtown | Station 2: Uptown
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-red-500" />
                  Avg Response: 4-6 minutes
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-red-500" />
                  Units Available: 8/10
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-red-600 hover:bg-red-700" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Fire Department
                </Button>
                <Button variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50">
                  Report Fire Hazard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Police Service System */}
          <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-blue-50 border-b border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-blue-800 text-xl">Police Service</CardTitle>
                  <CardDescription className="text-blue-600">Law enforcement and security services</CardDescription>
                </div>
                <Badge className="bg-blue-100 text-blue-800">On Patrol</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <Image
                  src="/images/police-officer.jpg"
                  alt="Police officer in tactical vest with emergency vehicle lights in background"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg border-2 border-blue-100"
                />
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-blue-500" />
                  Emergency: 911 | Direct: (555) 0456
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  Precinct 1: Central | Precinct 2: North
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-blue-500" />
                  Avg Response: 3-5 minutes
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  Units on Duty: 12/15
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Police
                </Button>
                <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                  Report Incident
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Medical Emergency Section */}
          <Card className="border-green-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-green-50 border-b border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-green-800 text-xl">Medical Emergency</CardTitle>
                  <CardDescription className="text-green-600">Ambulance and medical response services</CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800">Ready</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <Image
                  src="/images/ambulance.jpg"
                  alt="Emergency ambulance in motion with blue and red lights showing urgent medical response"
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg border-2 border-green-100"
                />
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-green-500" />
                  Emergency: 911 | Direct: (555) 0789
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-green-500" />
                  Hospital: General | Clinic: Community
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2 text-green-500" />
                  Avg Response: 5-8 minutes
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-green-500" />
                  Ambulances: 6/8 Available
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Ambulance
                </Button>
                <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                  Medical Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gray-900 text-white">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Emergency Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 h-16">
                <div className="text-center">
                  <div className="text-lg font-bold">FIRE</div>
                  <div className="text-sm">Press for Fire Emergency</div>
                </div>
              </Button>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-16">
                <div className="text-center">
                  <div className="text-lg font-bold">POLICE</div>
                  <div className="text-sm">Press for Police Help</div>
                </div>
              </Button>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 h-16">
                <div className="text-center">
                  <div className="text-lg font-bold">MEDICAL</div>
                  <div className="text-sm">Press for Medical Emergency</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
