"use client"

import { useMemo, useState } from "react"
import { Header } from "@/components/Header"
import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { getMaterialsSortedByYear, type Material, type MaterialDifficulty, type MaterialFormat, type MaterialTopic } from "@/lib/materials"
import type { TranslationKey } from "@/lib/translations"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock3, GraduationCap, Search } from "lucide-react"

type TopicFilter = MaterialTopic | "all"
type DifficultyFilter = MaterialDifficulty | "all"
type FormatFilter = MaterialFormat | "all"

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

function matchesSearch(material: Material, query: string): boolean {
  if (!query) return true
  const normalized = query.toLowerCase()
  const haystacks = [material.title, material.summary, ...(material.tools ?? [])]
  return haystacks.some((value) => value.toLowerCase().includes(normalized))
}

export default function MaterialsPage() {
  const { t, language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [topic, setTopic] = useState<TopicFilter>("all")
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all")
  const [format, setFormat] = useState<FormatFilter>("all")

  const materials = getMaterialsSortedByYear(language)

  const topicOptions = useMemo(
    () => Array.from(new Set(materials.map((material) => material.topic))),
    [materials]
  )

  const difficultyOptions = useMemo(
    () => Array.from(new Set(materials.map((material) => material.difficulty))),
    [materials]
  )

  const formatOptions = useMemo(
    () => Array.from(new Set(materials.map((material) => material.format))),
    [materials]
  )

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      if (topic !== "all" && material.topic !== topic) return false
      if (difficulty !== "all" && material.difficulty !== difficulty) return false
      if (format !== "all" && material.format !== format) return false
      return matchesSearch(material, searchQuery)
    })
  }, [materials, topic, difficulty, format, searchQuery])

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header subtitle={t("learningMaterials")} showNav={false} />

      <div className="container mx-auto px-4 pt-10 pb-16">
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">{t("materialsAndLessons")}</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">{t("materialsDescriptionLong")}</p>
        </AnimatedSection>

        <AnimatedSection className="mb-10">
          <Card className="border-slate-200/80 bg-white/95 shadow-sm">
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="relative md:col-span-2 lg:col-span-1">
                  <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t("searchMaterialsPlaceholder")}
                    className="pl-9"
                  />
                </div>
                <Select value={topic} onValueChange={(value) => setTopic(value as TopicFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("filterByTopic")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allTopics")}</SelectItem>
                    {topicOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {t(topicLabelKey[option])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={difficulty} onValueChange={(value) => setDifficulty(value as DifficultyFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("filterByDifficulty")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allDifficulties")}</SelectItem>
                    {difficultyOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {t(difficultyLabelKey[option])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={format} onValueChange={(value) => setFormat(value as FormatFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("filterByFormat")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allFormats")}</SelectItem>
                    {formatOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {t(formatLabelKey[option])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {filteredMaterials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMaterials.map((material, index) => (
              <AnimatedSection key={material.id} animation="fadeInUp" delay={index * 0.08}>
                <Link href={`/materials/${material.slug}`} className="block h-full">
                  <Card className="group h-full overflow-hidden border-slate-200/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative overflow-hidden">
                      <Image
                        src={material.image || "/placeholder.svg"}
                        alt={material.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="border-armath-blue/30 text-armath-blue">
                          {t(topicLabelKey[material.topic])}
                        </Badge>
                        <Badge variant="outline" className={difficultyColor[material.difficulty]}>
                          {t(difficultyLabelKey[material.difficulty])}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2 transition-colors group-hover:text-armath-blue">
                        {material.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">{material.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
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
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
            <h2 className="text-2xl font-bold text-slate-900 mb-4">{t("noMaterialsFound")}</h2>
            <p className="text-slate-600">{t("checkBackForMaterialsUpdates")}</p>
          </AnimatedSection>
        )}
      </div>
    </main>
  )
}
