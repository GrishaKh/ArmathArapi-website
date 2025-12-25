"use client"

import { use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { projects } from "@/lib/projects"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"
import { LanguageToggle } from "@/components/language-toggle"

interface Props {
  params: Promise<{ slug: string }>
}

export default function ProjectDetailPage({ params }: Props) {
  const { slug } = use(params)
  const { t, language } = useLanguage()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    notFound()
  }

  const title = language === "hy" ? project.titleHy : project.title
  const description = language === "hy" ? project.descriptionHy : project.description
  const category = language === "hy" ? project.categoryHy : project.category
  const challenge = language === "hy" ? project.challengeHy : project.challenge
  const solution = language === "hy" ? project.solutionHy : project.solution
  const results = language === "hy" ? project.resultsHy : project.results
  const impact = language === "hy" ? project.impactHy : project.impact

  return (
    <div className="min-h-screen bg-white">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 border-b bg-white/30 backdrop-blur-xl supports-[backdrop-filter]:bg-white/20"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/projects" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t("backToProjects")}</span>
          </Link>
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <motion.div
              className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden border border-armath-blue/20 bg-white shadow-sm"
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Image src="/logo.png" alt={t("logo")} fill className="object-contain p-1.5" sizes="48px" />
            </motion.div>
          </Link>
          <LanguageToggle />
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-armath-blue/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <Badge className="mb-4 bg-armath-blue text-white">{category}</Badge>
              <h1 className={cn("text-5xl font-bold text-gray-900 mb-4", language === "hy" && "text-4xl")}>{title}</h1>
              <p className="text-xl text-gray-600 mb-8">{description}</p>
              <div className="flex flex-wrap gap-2">
                {(language === "hy" ? project.toolsHy : project.tools).map((tool) => (
                  <Badge key={tool} variant="secondary" className="text-sm">
                    {tool}
                  </Badge>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fadeInUp" delay={0.2}>
              <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                <Image src={project.image || "/placeholder.svg"} alt={title} fill className="object-cover" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            {/* Challenge */}
            <AnimatedSection>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-gray-900">{t("challenge")}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">{challenge}</p>
              </div>
            </AnimatedSection>

            {/* Solution */}
            <AnimatedSection animation="fadeInUp" delay={0.1}>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-gray-900">{t("solution")}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">{solution}</p>
              </div>
            </AnimatedSection>

            {/* Results */}
            <AnimatedSection animation="fadeInUp" delay={0.2}>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-gray-900">{t("results")}</h2>
                <ul className="space-y-3">
                  {results.map((result, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-3 text-gray-600"
                    >
                      <span className="text-armath-blue font-bold mt-1 flex-shrink-0">✓</span>
                      <span className="text-lg leading-relaxed">{result}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            {/* Technologies */}
            <AnimatedSection animation="fadeInUp" delay={0.3}>
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">{t("technologies")}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {project.technologies.map((tech, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg">{tech.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base text-gray-600">
                          {language === "hy" ? tech.descriptionHy : tech.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Impact */}
            <AnimatedSection animation="fadeInUp" delay={0.4}>
              <div className="bg-gradient-to-br from-armath-blue/10 to-transparent p-8 rounded-xl border border-armath-blue/20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t("keyHighlights")}</h2>
                <p className="text-lg text-gray-700 leading-relaxed">{impact}</p>
              </div>
            </AnimatedSection>

            {/* Student Creator Info */}
            <AnimatedSection animation="fadeInUp" delay={0.5}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("studentCreator")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-lg font-semibold text-gray-900">{project.studentName}</p>
                  {project.presentedAt && (
                    <p className="text-gray-600">
                      <span className="font-medium">{t("presentedAt")}:</span> {project.presentedAt}
                    </p>
                  )}
                  <p className="text-gray-600">
                    <span className="font-medium">{t("year")}:</span> {project.year}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-armath-blue/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("interestedInSimilar")}</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">{t("joinCommunityCTA")}</p>
          <Button size="lg" className="bg-armath-red hover:bg-armath-red/90">
            {t("joinAsStudent")}
          </Button>
        </div>
      </section>
    </div>
  )
}
