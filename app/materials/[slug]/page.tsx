"use client"

import type React from "react"
import { use } from "react"
import { useMDXComponent } from "next-contentlayer/hooks"
import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/contexts/language-context"
import {
  getMaterialPathHref,
  getMaterialBySlug,
  getMaterialsByTopic,
  getMaterialsSortedByYear,
  MATERIAL_DIFFICULTY_LABELS,
  MATERIAL_DIFFICULTY_ORDER,
  MATERIAL_DIFFICULTY_STYLES,
  MATERIAL_FORMAT_LABELS,
  MATERIAL_TOPIC_LABELS,
  MATERIAL_TOPIC_STYLES,
} from "@/lib/materials"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, CheckCircle2, CircleDot, Clock3, Download, GraduationCap, Zap } from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
}

export default function MaterialDetailPage({ params }: Props) {
  const { slug } = use(params)
  const { t, language } = useLanguage()
  const material = getMaterialBySlug(slug, language)

  if (!material) {
    notFound()
  }

  const MDXContent = useMDXComponent(material.body.code)
  const topicPathMaterials = getMaterialsByTopic(language, material.topic)
  const currentPathIndex = topicPathMaterials.findIndex((item) => item.id === material.id)
  const nextInPath = currentPathIndex >= 0 ? topicPathMaterials[currentPathIndex + 1] : undefined
  const pathHref = getMaterialPathHref(material.topic)
  const relatedMaterials = getMaterialsSortedByYear(language)
    .filter((item) => item.id !== material.id)
    .sort((a, b) => {
      const sameTopicWeight = Number(b.topic === material.topic) - Number(a.topic === material.topic)
      if (sameTopicWeight !== 0) return sameTopicWeight
      return MATERIAL_DIFFICULTY_ORDER[a.difficulty] - MATERIAL_DIFFICULTY_ORDER[b.difficulty]
    })
    .slice(0, 3)

  const mdxComponents = {
    h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
      <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8" {...props} />
    ),
    p: (props: React.ComponentPropsWithoutRef<"p">) => (
      <p className="text-slate-600 text-lg leading-relaxed mb-4" {...props} />
    ),
    ul: (props: React.ComponentPropsWithoutRef<"ul">) => <ul className="space-y-4 mb-6" {...props} />,
    li: (props: React.ComponentPropsWithoutRef<"li">) => (
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
          <Link href="/materials" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t("backToMaterials")}</span>
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

      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className={MATERIAL_TOPIC_STYLES[material.topic]}>
                  {t(MATERIAL_TOPIC_LABELS[material.topic])}
                </Badge>
                <Badge variant="secondary">{t(MATERIAL_FORMAT_LABELS[material.format])}</Badge>
                <Badge variant="outline" className={MATERIAL_DIFFICULTY_STYLES[material.difficulty]}>
                  {t(MATERIAL_DIFFICULTY_LABELS[material.difficulty])}
                </Badge>
              </div>
              <h1 className="text-5xl font-bold text-slate-900 mb-4">{material.title}</h1>
              <p className="text-xl text-slate-600 mb-8">{material.summary}</p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-4 w-4 text-armath-blue" />
                  {t("estimatedTime")}: {material.durationMinutes} {t("minutes")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <GraduationCap className="h-4 w-4 text-armath-red" />
                  {t("ageGroup")}: {material.ageGroup}
                </span>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fadeInUp" delay={0.2}>
              <div className="relative aspect-video overflow-hidden rounded-3xl border border-slate-200/80 shadow-lg">
                <Image src={material.image || "/placeholder.svg"} alt={material.title} fill className="object-cover" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {material.learningObjectives && material.learningObjectives.length > 0 && (
                <AnimatedSection>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">{t("whatYouWillLearn")}</h2>
                  <ul className="space-y-3">
                    {material.learningObjectives.map((objective, index) => (
                      <li key={`${objective}-${index}`} className="flex gap-3 text-slate-700">
                        <span className="text-armath-blue font-bold mt-1 flex-shrink-0">✓</span>
                        <span className="text-lg leading-relaxed">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </AnimatedSection>
              )}

              <AnimatedSection>
                <article className="prose prose-lg max-w-none">
                  <MDXContent components={mdxComponents} />
                </article>
              </AnimatedSection>
            </div>

            <div className="space-y-6">
              {topicPathMaterials.length > 0 && (
                <AnimatedSection>
                  <Card className="border-slate-200/80 bg-white/95 shadow-sm">
                    <CardHeader>
                      <CardTitle>{t("pathProgress")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-slate-600">
                        {Math.max(currentPathIndex + 1, 1)} / {topicPathMaterials.length} {t("materialsInPath")}
                      </p>
                      {topicPathMaterials.map((pathMaterial, index) => {
                        const status = index < currentPathIndex ? "completed" : index === currentPathIndex ? "current" : "upcoming"
                        const statusLabel = status === "completed" ? t("completed") : status === "current" ? t("current") : t("upcoming")

                        return (
                          <Link
                            key={pathMaterial.id}
                            href={`/materials/${pathMaterial.slug}`}
                            className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {status === "completed" ? (
                                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                              ) : status === "current" ? (
                                <CircleDot className="h-4 w-4 flex-shrink-0 text-armath-blue" />
                              ) : (
                                <CircleDot className="h-4 w-4 flex-shrink-0 text-slate-300" />
                              )}
                              <span className="line-clamp-1 text-slate-700">{pathMaterial.title}</span>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                status === "completed"
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                  : status === "current"
                                    ? "border-armath-blue/20 bg-armath-blue/10 text-armath-blue"
                                    : "border-slate-200 bg-slate-50 text-slate-500"
                              }
                            >
                              {statusLabel}
                            </Badge>
                          </Link>
                        )
                      })}
                      <Link href={pathHref} className="inline-flex items-center text-sm font-medium text-armath-blue">
                        {t("viewFullPath")}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              )}

              <AnimatedSection>
                <Card className="border-slate-200/80 bg-white/95 shadow-sm">
                  <CardHeader>
                    <CardTitle>{nextInPath ? t("nextInPath") : t("pathCompleted")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {nextInPath ? (
                      <>
                        <p className="text-sm text-slate-600">{nextInPath.title}</p>
                        <Link href={`/materials/${nextInPath.slug}`}>
                          <Button className="w-full bg-armath-blue hover:bg-armath-blue/90">
                            {t("continuePath")}
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-slate-600">{t("pathCompleteMessage")}</p>
                        <Link href={pathHref}>
                          <Button variant="outline" className="w-full">
                            {t("viewFullPath")}
                          </Button>
                        </Link>
                      </>
                    )}
                  </CardContent>
                </Card>
              </AnimatedSection>

              {material.prerequisites && material.prerequisites.length > 0 && (
                <AnimatedSection>
                  <Card className="border-slate-200/80 bg-white/95 shadow-sm">
                    <CardHeader>
                      <CardTitle>{t("prerequisites")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {material.prerequisites.map((requirement, index) => (
                        <p key={`${requirement}-${index}`} className="text-sm text-slate-600">
                          • {requirement}
                        </p>
                      ))}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              )}

              {material.tools && material.tools.length > 0 && (
                <AnimatedSection>
                  <Card className="border-slate-200/80 bg-white/95 shadow-sm">
                    <CardHeader>
                      <CardTitle>{t("toolsUsed")}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {material.tools.map((tool) => (
                        <Badge key={tool} variant="secondary">
                          {tool}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              )}

              {material.downloads && material.downloads.length > 0 && (
                <AnimatedSection>
                  <Card className="border-slate-200/80 bg-white/95 shadow-sm">
                    <CardHeader>
                      <CardTitle>{t("downloads")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {material.downloads.map((download) => {
                        const isExternal = download.url.startsWith("http://") || download.url.startsWith("https://")
                        return (
                          <a
                            key={`${download.label}-${download.url}`}
                            href={download.url}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noreferrer" : undefined}
                            className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <span>{download.label}</span>
                            <Download className="h-4 w-4 text-armath-blue" />
                          </a>
                        )
                      })}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              )}
            </div>
          </div>
        </div>
      </section>

      {relatedMaterials.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-slate-900 mb-8">{t("relatedMaterials")}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedMaterials.map((relatedMaterial) => (
                  <Link key={relatedMaterial.id} href={`/materials/${relatedMaterial.slug}`}>
                    <Card className="group h-full overflow-hidden border-slate-200/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={relatedMaterial.image || "/placeholder.svg"}
                          alt={relatedMaterial.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-2 transition-colors group-hover:text-armath-blue">
                          {relatedMaterial.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="inline-flex items-center text-sm font-medium text-armath-blue">
                          {t("viewMaterial")}
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}
    </main>
  )
}
