"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { Award, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { events } from "@/lib/events"

export function EventsSection() {
  const { t } = useLanguage()

  const categoryColors: Record<string, string> = {
    competition: "bg-armath-red",
    workshop: "bg-armath-blue",
    camp: "bg-green-600",
    exhibition: "bg-purple-600",
  }

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("eventsTitle")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">{t("eventsDescription")}</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {events.map((event, index) => (
            <AnimatedSection key={event.id} animation="fadeInUp" delay={index * 0.2}>
              <Link href={`/events/${event.slug}`}>
                <Card className="hover:shadow-xl transition-all duration-500 hover:scale-105 group h-full overflow-hidden cursor-pointer">
                  <div className="relative">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className={`${categoryColors[event.category]} text-white`}>
                        <Award className="w-3 h-3 mr-1" />
                        {event.year}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-armath-blue transition-colors">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm line-clamp-3">{event.description}</p>
                    <div className="mt-4 flex items-center text-armath-blue font-semibold text-sm gap-1 group-hover:gap-2 transition-all">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        {/* View All Events Button */}
        <AnimatedSection className="text-center">
          <Link href="/events">
            <button className="px-8 py-3 bg-armath-blue text-white font-semibold rounded-lg hover:bg-armath-blue/90 transition-colors">
              View All Events
            </button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
