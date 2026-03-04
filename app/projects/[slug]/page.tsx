"use client"

import { use } from "react"
import { useMDXComponent } from "next-contentlayer/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Zap } from "lucide-react"
import { getProjectBySlug } from "@/lib/projects"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"
import { LanguageToggle } from "@/components/language-toggle"

interface Props {
  params: Promise<{ slug: string }>
}

export default function ProjectDetailPage({ params }: Props) {
  const { slug } = use(params)
  const { t, language } = useLanguage()
  const project = getProjectBySlug(slug, language)

  if (!project) {
    notFound()
  }

  const MDXContent = useMDXComponent(project.body.code)

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

  const title = project.title
  const description = project.description || ""
  const category = project.categoryHy && language === "hy" ? project.categoryHy : project.category
  const challenge = project.challengeHy && language === "hy" ? project.challengeHy : project.challenge
  const solution = project.solutionHy && language === "hy" ? project.solutionHy : project.solution
  const results = project.resultsHy && language === "hy" ? (project.resultsHy || []) : (project.results || [])
  const impact = project.impactHy && language === "hy" ? project.impactHy : project.impact
  const tools = project.toolsHy && language === "hy" ? (project.toolsHy || []) : (project.tools || [])
  const technologies = project.technologies ? (Array.isArray(project.technologies) ? project.technologies : []) : []

  return (
    <div className="min-h-screen">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/projects" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t("backToProjects")}</span>
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

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <Badge className="mb-4 bg-armath-blue/90 text-white">{category}</Badge>
              <h1 className={cn("text-5xl font-bold text-slate-900 mb-4", language === "hy" && "text-4xl")}>{title}</h1>
              <p className="text-xl text-slate-600 mb-8">{description}</p>
              {tools.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tools.map((tool) => (
                    <Badge key={tool} variant="secondary" className="text-sm">
                      {tool}
                    </Badge>
                  ))}
                </div>
              )}
            </AnimatedSection>
            <AnimatedSection animation="fadeInUp" delay={0.2}>
              <div className="relative aspect-video overflow-hidden rounded-3xl border border-slate-200/80 shadow-lg">
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
            {/* MDX Content */}
            <AnimatedSection>
              <article className="prose prose-lg max-w-none">
                <MDXContent components={mdxComponents} />
              </article>
            </AnimatedSection>

            {/* Challenge */}
            {challenge && (
              <AnimatedSection>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-slate-900">{t("challenge")}</h2>
                  <p className="text-lg text-slate-600 leading-relaxed">{challenge}</p>
                </div>
              </AnimatedSection>
            )}

            {/* Solution */}
            {solution && (
              <AnimatedSection animation="fadeInUp" delay={0.1}>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-slate-900">{t("solution")}</h2>
                  <p className="text-lg text-slate-600 leading-relaxed">{solution}</p>
                </div>
              </AnimatedSection>
            )}

            {/* Results */}
            {results && results.length > 0 && (
              <AnimatedSection animation="fadeInUp" delay={0.2}>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-slate-900">{t("results")}</h2>
                  <ul className="space-y-3">
                    {results.map((result: string, index: number) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-3 text-slate-600"
                      >
                        <span className="text-armath-blue font-bold mt-1 flex-shrink-0">✓</span>
                        <span className="text-lg leading-relaxed">{result}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}

            {/* Technologies */}
            {technologies.length > 0 && (
              <AnimatedSection animation="fadeInUp" delay={0.3}>
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-slate-900">{t("technologies")}</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {technologies.map((tech: any, index: number) => (
                      <Card key={index} className="border-slate-200/80 bg-white/95 shadow-sm transition-shadow hover:shadow-md">
                        <CardHeader>
                          <CardTitle className="text-lg">{tech.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base text-slate-600">
                            {language === "hy" && tech.descriptionHy ? tech.descriptionHy : tech.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Impact */}
            {impact && (
              <AnimatedSection animation="fadeInUp" delay={0.4}>
                <div className="rounded-3xl border border-armath-blue/20 bg-armath-blue/5 p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">{t("keyHighlights")}</h2>
                  <p className="text-lg text-slate-700 leading-relaxed">{impact}</p>
                </div>
              </AnimatedSection>
            )}

            {/* Student Creator Info */}
            <AnimatedSection animation="fadeInUp" delay={0.5}>
              <Card>
                <CardHeader>
                  <CardTitle>{t("studentCreator")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {project.studentName && (
                    <p className="text-lg font-semibold text-slate-900">{project.studentName}</p>
                  )}
                  {project.presentedAt && (
                    <p className="text-slate-600">
                      <span className="font-medium">{t("presentedAt")}:</span> {project.presentedAt}
                    </p>
                  )}
                  <p className="text-slate-600">
                    <span className="font-medium">{t("year")}:</span> {project.year}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-transparent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{t("interestedInSimilar")}</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">{t("joinCommunityCTA")}</p>
          <Button size="lg" className="bg-armath-red hover:bg-armath-red/90">
            {t("joinAsStudent")}
          </Button>
        </div>
      </section>
    </div>
  )
}
