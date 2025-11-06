import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { Award } from "lucide-react"
import Image from "next/image"

const events = [
  {
    title: "DigiCode 2025",
    date: "2025",
    description: "Intensive STEM learning experience in the mountains",
    image: "/placeholder.svg?height=200&width=300&text=Engineering+Camp",
  },
  {
    title: "ArmRobotics 2022",
    date: "2022",
    description: "Our students won multiple awards in national competition",
    image: "/placeholder.svg?height=200&width=300&text=Robotics+Competition",
  },
  {
    title: "DigiCamp",
    date: "2022",
    description: "Intensive STEM learning experience in the mountains",
    image: "/placeholder.svg?height=200&width=300&text=Engineering+Camp",
  },
]

export function EventsSection() {
  const { t } = useLanguage()

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("eventsTitle")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">{t("eventsDescription")}</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <AnimatedSection key={event.title} animation="fadeInUp" delay={index * 0.2}>
              <Card className="hover:shadow-xl transition-all duration-500 hover:scale-105 group h-full overflow-hidden">
                <div className="relative">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-armath-red text-white">
                      <Award className="w-3 h-3 mr-1" />
                      {event.date}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-armath-blue transition-colors">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{event.description}</p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
