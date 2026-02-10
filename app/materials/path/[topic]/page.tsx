"use client"

import { use } from "react"
import { Header } from "@/components/Header"
import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import {
  getMaterialsByTopic,
  getMaterialTopicFromRouteSegment,
  MATERIAL_DIFFICULTY_LABELS,
  MATERIAL_DIFFICULTY_STYLES,
  MATERIAL_FORMAT_LABELS,
  MATERIAL_TOPIC_LABELS,
  MATERIAL_TOPIC_STYLES,
} from "@/lib/materials"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Clock3, GraduationCap, ListChecks } from "lucide-react"

interface Props {
  params: Promise<{ topic: string }>
}

export default function MaterialPathPage({ params }: Props) {
  const { topic: rawTopic } = use(params)
  const { t, language } = useLanguage()
  const topic = getMaterialTopicFromRouteSegment(rawTopic)

  if (!topic) {
    notFound()
  }

  const pathMaterials = getMaterialsByTopic(language, topic)
  const totalDuration = pathMaterials.reduce((sum, material) => sum + material.durationMinutes, 0)

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header subtitle={t("learningPaths")} showNav={false} />

      <div className="container mx-auto px-4 pt-10 pb-16">
        <AnimatedSection className="mb-10">
          <div className="mb-6">
            <Link href="/materials" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              {t("backToMaterials")}
            </Link>
          </div>
          <Card className="border-slate-200/80 bg-white/95 shadow-sm">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="outline" className={MATERIAL_TOPIC_STYLES[topic]}>
                  {t(MATERIAL_TOPIC_LABELS[topic])}
                </Badge>
                <Badge variant="secondary" className="inline-flex items-center gap-1">
                  <ListChecks className="h-3.5 w-3.5" />
                  {pathMaterials.length} {t("materialsInPath")}
                </Badge>
                <Badge variant="secondary" className="inline-flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5" />
                  {totalDuration} {t("minutes")}
                </Badge>
              </div>
              <CardTitle className="text-3xl">{t("learningPathLabel")}</CardTitle>
              <CardDescription className="text-base">{t("learningPathsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {pathMaterials.length > 0 && (
                <Link href={`/materials/${pathMaterials[0].slug}`}>
                  <Button className="bg-armath-blue hover:bg-armath-blue/90">
                    {t("startPath")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Link href="/materials">
                <Button variant="outline">{t("viewAllMaterials")}</Button>
              </Link>
            </CardContent>
          </Card>
        </AnimatedSection>

        {pathMaterials.length > 0 ? (
          <section className="space-y-4">
            {pathMaterials.map((material, index) => (
              <AnimatedSection key={material.id} animation="fadeInUp" delay={index * 0.05}>
                <Card className="border-slate-200/80 bg-white/95 shadow-sm">
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-armath-blue text-sm font-semibold text-white">
                          {index + 1}
                        </div>
                        {index < pathMaterials.length - 1 && (
                          <div className="mt-2 h-full min-h-6 w-px bg-slate-200" />
                        )}
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className={MATERIAL_DIFFICULTY_STYLES[material.difficulty]}>
                            {t(MATERIAL_DIFFICULTY_LABELS[material.difficulty])}
                          </Badge>
                          <Badge variant="outline">{t(MATERIAL_FORMAT_LABELS[material.format])}</Badge>
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900">{material.title}</h2>
                        <p className="text-slate-600">{material.summary}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-4 w-4" />
                            {material.durationMinutes} {t("minutes")}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            {material.ageGroup}
                          </span>
                        </div>
                        <Link href={`/materials/${material.slug}`} className="inline-flex items-center gap-1 text-sm font-medium text-armath-blue">
                          {t("viewMaterial")}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </section>
        ) : (
          <AnimatedSection className="text-center py-12 rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{t("noMaterialsFound")}</h2>
            <p className="text-slate-600 mb-6">{t("checkBackForMaterialsUpdates")}</p>
            <Link href="/materials">
              <Button variant="outline">{t("viewAllMaterials")}</Button>
            </Link>
          </AnimatedSection>
        )}
      </div>
    </main>
  )
}
