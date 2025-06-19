import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-red-600">EmergencyConnect</h1>
            <nav className="space-x-4">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link href="/register" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Register
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">Emergency Services Platform</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Connecting those in need with emergency service providers quickly and efficiently.
          </p>

          <div className="flex justify-center gap-4 mb-12">
            <Link href="/client">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                I Need Help
              </Button>
            </Link>
            <Link href="/provider">
              <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                Service Provider Login
              </Button>
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <ServiceCard
              title="Medical Emergency"
              description="Request an ambulance for medical emergencies"
              image="/placeholder.svg?height=200&width=300"
              color="red"
              href="/client?service=medical"
              buttonText="Request Ambulance"
            />

            <ServiceCard
              title="Police Assistance"
              description="Request police help for security emergencies"
              image="/placeholder.svg?height=200&width=300"
              color="blue"
              href="/client?service=police"
              buttonText="Request Police"
            />

            <ServiceCard
              title="Fire Emergency"
              description="Request fire brigade for fire emergencies"
              image="/placeholder.svg?height=200&width=300"
              color="orange"
              href="/client?service=fire"
              buttonText="Request Fire Brigade"
            />
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 EmergencyConnect. All rights reserved.</p>
          <p className="mt-2 text-sm">This is a simplified demonstration system.</p>
        </div>
      </footer>
    </div>
  )
}

function ServiceCard({ title, description, image, color, href, buttonText }) {
  const bgColor = `bg-${color}-600`
  const hoverColor = `hover:bg-${color}-700`

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-${color}-600/70 to-transparent`}></div>
        </div>
      </CardContent>
      <CardFooter className="mt-4">
        <Link href={href} className="w-full">
          <Button className={`w-full ${bgColor} ${hoverColor}`}>{buttonText}</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
