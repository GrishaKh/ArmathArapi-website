"use client"

import { useLanguage } from "@/contexts/language-context"
import { AnimatedSection } from "@/components/animated-section"
import { events } from "@/lib/events"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin } from "lucide-react"
import { LanguageToggle } from "@/components/language-toggle"
import { motion } from "framer-motion"

export default function EventsPage() {
  const { t } = useLanguage()

  const categoryColors: Record<string, string> = {
    competition: "bg-armath-red",
    workshop: "bg-armath-blue",
    camp: "bg-green-600",
    exhibition: "bg-purple-600",
  }

  return (
    <main className="min-h-screen pt-24 pb-20">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 z-50 w-full border-b bg-white/30 backdrop-blur-xl supports-[backdrop-filter]:bg-white/20"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <motion.div
              className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden border border-armath-blue/20 bg-white shadow-sm"
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Image src="/logo.png" alt={t("logo")} fill className="object-contain p-1.5" sizes="48px" />
            </motion.div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg sm:text-xl">{t("armathArapi")}</h1>
              <p className="text-sm text-gray-600">{t("events")}</p>
            </div>
          </Link>
          <LanguageToggle />
        </div>
      </motion.header>

      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Events & Achievements</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Explore our participation in competitions, workshops, and educational programs that shaped our community.
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
                    <p className="text-gray-600 text-sm line-clamp-3">{event.description}</p>
                    <div className="mt-4 flex items-center text-sm text-gray-500 gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center py-12 bg-gradient-to-r from-armath-blue/10 to-armath-red/10 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">More Events Coming Soon</h2>
          <p className="text-gray-600">
            We're constantly participating in new competitions and workshops. Check back for updates!
          </p>
        </AnimatedSection>
      </div>
    </main>
  )
}
