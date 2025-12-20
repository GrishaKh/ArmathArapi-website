"use client"

import { useLanguage } from "@/contexts/language-context"
import { AnimatedSection } from "@/components/animated-section"
import { getEventsSortedByYear } from "@/lib/events"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"
import { Header } from "@/components/Header"

const events = getEventsSortedByYear()

export default function EventsPage() {
  const { t, language } = useLanguage()

  const categoryColors: Record<string, string> = {
    competition: "bg-armath-red",
    workshop: "bg-armath-blue",
    camp: "bg-green-600",
    exhibition: "bg-purple-600",
  }

  return (
    <main className="min-h-screen">
      <Header subtitle={t("events")} showNav={false} />

      <div className="container mx-auto px-4 pt-8">
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">{t("eventsAndAchievements")}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            {t("eventsDescriptionLong")}
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {events.map((event, index) => (
            <AnimatedSection key={event.id} animation="fadeInUp" delay={index * 0.1}>
              <Link href={`/events/${event.slug}`}>
                <Card className="hover:shadow-xl transition-all duration-500 hover:scale-105 group h-full overflow-hidden cursor-pointer">
                  <div className="relative overflow-hidden">
                    <Image
                      src={event.image || "/placeholder.svg?height=200&width=300"}
                      alt={language === "hy" ? event.titleHy : event.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge className={`${categoryColors[event.category]} text-white`}>
                        <Calendar className="w-3 h-3 mr-1" />
                        {event.year}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-armath-blue transition-colors line-clamp-2">
                      {language === "hy" ? event.titleHy : event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {language === "hy" ? event.descriptionHy : event.description}
                    </p>
                    <div className="mt-4 flex items-center text-sm text-gray-500 gap-1">
                      <MapPin className="w-4 h-4" />
                      {language === "hy" ? event.locationHy : event.location}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center py-12 bg-gradient-to-r from-armath-blue/10 to-armath-red/10 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("moreEventsComingSoon")}</h2>
          <p className="text-gray-600">
            {t("checkBackForUpdates")}
          </p>
        </AnimatedSection>
      </div>
    </main>
  )
}
