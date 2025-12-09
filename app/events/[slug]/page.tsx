"use client"

import { CardTitle } from "@/components/ui/card"

import { CardHeader } from "@/components/ui/card"

import { Card } from "@/components/ui/card"

import { useLanguage } from "@/contexts/language-context"
import { AnimatedSection } from "@/components/animated-section"
import { getEventBySlug, events } from "@/lib/events"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, Award, Users, Zap } from "lucide-react"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    slug: string
  }
}

export default function EventDetailPage({ params }: PageProps) {
  const { t } = useLanguage()
  const event = getEventBySlug(params.slug)

  if (!event) {
    notFound()
  }

  const categoryLabels: Record<string, string> = {
    competition: "Competition",
    workshop: "Workshop",
    camp: "Camp",
    exhibition: "Exhibition",
  }

  const categoryColors: Record<string, string> = {
    competition: "bg-armath-red",
    workshop: "bg-armath-blue",
    camp: "bg-green-600",
    exhibition: "bg-purple-600",
  }

  return (
    <main className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <AnimatedSection>
          <Link href="/events">
            <Button variant="ghost" className="gap-2 mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </Button>
          </Link>
        </AnimatedSection>

        {/* Hero Image */}
        <AnimatedSection className="mb-12">
          <div className="relative w-full h-96 rounded-lg overflow-hidden">
            <Image
              src={event.image || "/placeholder.svg?height=400&width=1200"}
              alt={event.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end p-8">
              <div className="text-white">
                <Badge className={`${categoryColors[event.category]} text-white mb-4`}>
                  {categoryLabels[event.category]}
                </Badge>
                <h1 className="text-5xl font-bold mb-4">{event.title}</h1>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Overview */}
            <AnimatedSection className="mb-12">
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-armath-blue" />
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="text-lg font-semibold text-gray-900">{event.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="w-6 h-6 text-armath-red" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-lg font-semibold text-gray-900">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Award className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="text-lg font-semibold text-gray-900">{categoryLabels[event.category]}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Summary */}
            <AnimatedSection className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{event.summary}</p>
            </AnimatedSection>

            {/* Challenge */}
            <AnimatedSection className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The Challenge</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{event.challenge}</p>
            </AnimatedSection>

            {/* Achievements */}
            <AnimatedSection className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Achievements</h2>
              <ul className="space-y-4">
                {event.achievements.map((achievement, index) => (
                  <li key={index} className="flex gap-4">
                    <Zap className="w-6 h-6 text-armath-blue flex-shrink-0 mt-1" />
                    <span className="text-gray-600 text-lg">{achievement}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            {/* Results */}
            <AnimatedSection className="mb-12 p-8 bg-armath-blue/10 rounded-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Results</h2>
              <p className="text-gray-600 text-lg leading-relaxed">{event.results}</p>
            </AnimatedSection>

            {/* Highlights */}
            <AnimatedSection className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Highlights</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {event.highlights.map((highlight, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-armath-blue">
                    <p className="text-gray-700 font-semibold">{highlight}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div>
            {/* Technologies */}
            {event.technologies.length > 0 && (
              <AnimatedSection className="mb-12 p-6 bg-gray-50 rounded-lg sticky top-28">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Technologies & Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {event.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="bg-armath-blue/20 text-armath-blue">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </AnimatedSection>
            )}

            {/* Participants */}
            {event.participants.schools.length > 0 && (
              <AnimatedSection className="mb-12 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Participating Schools
                </h3>
                <ul className="space-y-2">
                  {event.participants.schools.map((school, index) => (
                    <li key={index} className="text-gray-600 flex items-start gap-2">
                      <span className="text-armath-blue font-bold">•</span>
                      {school}
                    </li>
                  ))}
                </ul>
              </AnimatedSection>
            )}
          </div>
        </div>

        {/* Related Events */}
        <AnimatedSection className="mt-20 pt-12 border-t">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">More Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events
              .filter((e) => e.id !== event.id)
              .slice(0, 3)
              .map((relatedEvent, index) => (
                <Link key={relatedEvent.id} href={`/events/${relatedEvent.slug}`}>
                  <Card className="hover:shadow-xl transition-all duration-500 hover:scale-105 group overflow-hidden cursor-pointer h-full">
                    <div className="relative overflow-hidden">
                      <Image
                        src={relatedEvent.image || "/placeholder.svg"}
                        alt={relatedEvent.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-armath-blue transition-colors line-clamp-2">
                        {relatedEvent.title}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
          </div>
        </AnimatedSection>
      </div>
    </main>
  )
}
