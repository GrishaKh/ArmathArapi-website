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


export default function EventsPage() {
  const { t, language } = useLanguage()
  const events = getEventsSortedByYear(language)

  const categoryColors: Record<string, string> = {
    competition: "bg-armath-red",
    workshop: "bg-armath-blue",
    camp: "bg-green-600",
    exhibition: "bg-purple-600",
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header subtitle={t("events")} showNav={false} />

      <div className="container mx-auto px-4 pt-10 pb-16 overflow-hidden">
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">{t("eventsAndAchievements")}</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            {t("eventsDescriptionLong")}
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 w-full">
          {events.map((event, index) => (
            <AnimatedSection key={event.id} animation="fadeInUp" delay={index * 0.1} className="w-full min-w-0">
              <Link href={`/events/${event.slug.split('/').pop()}`} className="block w-full">
                <Card className="group h-full w-full overflow-hidden border-slate-200/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative overflow-hidden">
                    <Image
                      src={event.image || "/placeholder.svg?height=200&width=300"}
                      alt={event.title}
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
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-sm line-clamp-3">
                      {event.description || ""}
                    </p>
                    <div className="mt-4 flex items-center text-sm text-slate-500 gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center py-12 rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{t("moreEventsComingSoon")}</h2>
          <p className="text-slate-600">
            {t("checkBackForUpdates")}
          </p>
        </AnimatedSection>
      </div>
    </main>
  )
}
