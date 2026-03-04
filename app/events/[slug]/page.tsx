"use client"

import { use } from "react"
import { useMDXComponent } from "next-contentlayer/hooks"
import { CardTitle, CardHeader, Card } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { AnimatedSection } from "@/components/animated-section"
import { getEventBySlug, getEventsSortedByYear } from "@/lib/events"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, Award, Users, Zap } from "lucide-react"
import { notFound } from "next/navigation"
import { LanguageToggle } from "@/components/language-toggle"
import { motion } from "framer-motion"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function EventDetailPage({ params }: PageProps) {
  const { slug } = use(params)
  const { t, language } = useLanguage()
  const event = getEventBySlug(slug, language)

  if (!event) {
    notFound()
  }

  const MDXContent = useMDXComponent(event.body.code)

  // Fetch related events (excluding current one)
  const relatedEvents = getEventsSortedByYear(language)
    .filter((e) => e.id !== event.id)
    .slice(0, 3)

  const categoryLabels: Record<string, string> = {
    competition: t("competition"),
    workshop: t("workshop"),
    camp: t("camp"),
    exhibition: t("exhibition"),
  }

  const categoryColors: Record<string, string> = {
    competition: "bg-armath-red",
    workshop: "bg-armath-blue",
    camp: "bg-green-600",
    exhibition: "bg-purple-600",
  }

  // Custom MDX components to match current styling
  const mdxComponents = {
    h2: (props: any) => <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8" {...props} />,
    p: (props: any) => <p className="text-slate-600 text-lg leading-relaxed mb-4" {...props} />,
    ul: (props: any) => <ul className="space-y-4 mb-6" {...props} />,
    li: (props: any) => (
      <li className="flex gap-4" {...props}>
        <Zap className="w-6 h-6 text-armath-blue flex-shrink-0 mt-1" />
        <span className="text-slate-600 text-lg">{props.children}</span>
      </li>
    ),
  }

  return (
    <main className="min-h-screen">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/events" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t("backToEvents")}</span>
          </Link>
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <motion.div
              className="relative h-10 w-10 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm sm:hidden"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <Image src="/logo.png" alt={t("logo")} fill className="object-contain p-1.5" sizes="48px" />
            </motion.div>
            <motion.div
              className="relative hidden h-11 w-[176px] sm:block"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src="/ArmathArapi_logo.png"
                alt={t("armathArapi") + " " + t("logo")}
                fill
                className="object-contain"
                sizes="176px"
              />
            </motion.div>
          </Link>
          <LanguageToggle />
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8">

        {/* Hero Image */}
        <AnimatedSection className="mb-12">
          <div className="relative w-full h-96 overflow-hidden rounded-3xl border border-slate-200/80 shadow-lg">
            <Image
              src={event.image || "/placeholder.svg?height=400&width=1200"}
              alt={event.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end p-8">
              <div className="text-white">
                <Badge className={`${categoryColors[event.category]} text-white mb-4`}>
                  {categoryLabels[event.category] || event.category}
                </Badge>
                <h1 className="text-5xl font-bold mb-4">{event.title}</h1>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Metadata Bar */}
            <AnimatedSection className="mb-12">
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm">
                  <Calendar className="w-6 h-6 text-armath-blue" />
                  <div>
                    <p className="text-sm text-slate-600">{t("eventYear")}</p>
                    <p className="text-lg font-semibold text-slate-900">{event.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm">
                  <MapPin className="w-6 h-6 text-armath-red" />
                  <div>
                    <p className="text-sm text-slate-600">{t("eventLocation")}</p>
                    <p className="text-lg font-semibold text-slate-900">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm">
                  <Award className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-slate-600">{t("eventCategory")}</p>
                    <p className="text-lg font-semibold text-slate-900">{categoryLabels[event.category] || event.category}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* MDX Content */}
            <AnimatedSection className="mb-12">
              <article className="prose prose-lg max-w-none">
                <MDXContent components={mdxComponents} />
              </article>
            </AnimatedSection>

            {/* Highlights (from Frontmatter) */}
            {event.highlights && event.highlights.length > 0 && (
              <AnimatedSection className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">{t("eventHighlights")}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {event.highlights.map((highlight, index) => (
                    <div key={index} className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm">
                      <p className="text-slate-700 font-semibold">{highlight}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Technologies */}
            {event.technologies && event.technologies.length > 0 && (
              <AnimatedSection className="mb-12 rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm sticky top-28">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{t("eventTechnologies")}</h3>
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
            {event.participants && Array.isArray((event.participants as any).schools) && (
              <AnimatedSection className="mb-12 rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {t("participatingSchools")}
                </h3>
                <ul className="space-y-2">
                  {((event.participants as any).schools as string[]).map((school, index) => (
                    <li key={index} className="text-slate-600 flex items-start gap-2">
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
        {relatedEvents.length > 0 && (
          <AnimatedSection className="mt-20 pt-12 border-t">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">{t("relatedEvents")}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedEvents.map((relatedEvent) => (
                <Link key={relatedEvent.id} href={`/events/${relatedEvent.slug.split('/').pop()}`}>
                  <Card className="group h-full overflow-hidden border-slate-200/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
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
        )}
      </div>
    </main>
  )
}
