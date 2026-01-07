"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { getEventsSortedByYear } from "@/lib/events"


export function EventsSection() {
  const { t, language } = useLanguage()
  const events = getEventsSortedByYear(language)

  const categoryColors: Record<string, string> = {
    competition: "bg-armath-red",
    workshop: "bg-armath-blue",
    camp: "bg-green-600",
    exhibition: "bg-purple-600",
  }

  // Get translated category name
  const getCategoryName = (category: string) => {
    const categoryKey = category as "competition" | "workshop" | "camp" | "exhibition"
    return t(categoryKey) || category
  }

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("eventsTitle")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">{t("eventsDescription")}</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 w-full">
          {events.slice(0, 3).map((event, index) => (
            <AnimatedSection key={event.id} animation="fadeInUp" delay={index * 0.15} className="w-full min-w-0">
              <Link href={`/events/${event.slug.split('/').pop()}`} className="block h-full w-full">
                <Card className="hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group h-full overflow-hidden cursor-pointer border-transparent hover:border-armath-blue/20 w-full">
                  <div className="relative overflow-hidden">
                    <Image
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category & Year badges */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Badge className={`${categoryColors[event.category]} text-white shadow-lg`}>
                        {getCategoryName(event.category)}
                      </Badge>
                    </div>

                    {/* Year badge */}
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg">
                        <Calendar className="w-3 h-3 mr-1" />
                        {event.year}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg group-hover:text-armath-blue transition-colors line-clamp-2">
                      {event.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {event.description || ""}
                    </p>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-500 gap-1">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                        {event.location}
                      </span>
                    </div>

                    {/* Learn More link */}
                    <motion.div
                      className="flex items-center text-armath-blue font-semibold text-sm gap-1 pt-2"
                      whileHover={{ x: 4 }}
                    >
                      {t("learnMore")}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        {/* View All Events Button */}
        <AnimatedSection className="text-center">
          <Link href="/events">
            <Button size="lg" className="bg-armath-blue hover:bg-armath-blue/90">
              {t("viewAllEvents")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
