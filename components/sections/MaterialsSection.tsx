"use client"

import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { getFeaturedMaterials, getMaterialsSortedByYear, type Material, type MaterialDifficulty, type MaterialFormat, type MaterialTopic } from "@/lib/materials"
import type { TranslationKey } from "@/lib/translations"
import { ArrowRight, Clock3, GraduationCap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const topicLabelKey: Record<MaterialTopic, TranslationKey> = {
  programming: "topicProgramming",
  electronics: "topicElectronics",
  robotics: "topicRobotics",
  modeling3d: "topicModeling3d",
  cncLaser: "topicCncLaser",
}

const formatLabelKey: Record<MaterialFormat, TranslationKey> = {
  lesson: "formatLesson",
  "project-guide": "formatProjectGuide",
  worksheet: "formatWorksheet",
  video: "formatVideo",
}

const difficultyLabelKey: Record<MaterialDifficulty, TranslationKey> = {
  beginner: "beginner",
  next: "next",
  advanced: "advanced",
}

const difficultyColor: Record<MaterialDifficulty, string> = {
  beginner: "bg-emerald-100 text-emerald-700 border-emerald-200",
  next: "bg-blue-100 text-blue-700 border-blue-200",
  advanced: "bg-rose-100 text-rose-700 border-rose-200",
}

function getPreviewMaterials(language: "en" | "hy"): Material[] {
  const featured = getFeaturedMaterials(language, 3)
  if (featured.length > 0) {
    return featured
  }

  return getMaterialsSortedByYear(language).slice(0, 3)
}

export function MaterialsSection() {
  const { t, language } = useLanguage()
  const materials = getPreviewMaterials(language)

  return (
    <section id="learningMaterials" className="py-24 bg-transparent">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">{t("materialsTitle")}</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">{t("materialsDescription")}</p>
        </AnimatedSection>

        {materials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {materials.map((material, index) => (
              <AnimatedSection key={material.id} animation="fadeInUp" delay={index * 0.15} className="w-full min-w-0">
                <Link href={`/materials/${material.slug}`} className="block h-full w-full">
                  <Card className="group h-full w-full overflow-hidden border-slate-200/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative overflow-hidden">
                      <Image
                        src={material.image || "/placeholder.svg"}
                        alt={material.title}
                        width={400}
                        height={250}
                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <Badge variant="outline" className="border-armath-blue/30 text-armath-blue">
                          {t(topicLabelKey[material.topic])}
                        </Badge>
                        <Badge variant="outline" className={difficultyColor[material.difficulty]}>
                          {t(difficultyLabelKey[material.difficulty])}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-2 text-lg transition-colors group-hover:text-armath-blue">
                        {material.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">{material.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-slate-500">{t(formatLabelKey[material.format])}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-4 w-4" />
                            {material.durationMinutes} {t("minutes")}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            {material.ageGroup}
                          </span>
                        </div>
                        <div className="flex items-center text-sm font-medium text-armath-blue">
                          {t("viewMaterial")}
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection className="text-center py-12 rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{t("moreMaterialsComingSoon")}</h3>
            <p className="text-slate-600">{t("checkBackForMaterialsUpdates")}</p>
          </AnimatedSection>
        )}

        <AnimatedSection className="text-center mt-16">
          <Link href="/materials">
            <Button size="lg" className="bg-armath-blue hover:bg-armath-blue/90">
              {t("viewAllMaterials")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
