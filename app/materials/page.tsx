"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Header } from "@/components/Header"
import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import {
  buildMaterialPaths,
  getMaterialPathHref,
  getMaterialsSortedByYear,
  MATERIAL_DIFFICULTY_LABELS,
  MATERIAL_DIFFICULTY_STYLES,
  MATERIAL_FORMAT_LABELS,
  MATERIAL_TOPIC_LABELS,
  MATERIAL_TOPIC_STYLES,
  type Material,
  type MaterialDifficulty,
  type MaterialFormat,
  type MaterialPath,
  type MaterialTopic,
} from "@/lib/materials"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock3, Filter, GraduationCap, Search, X } from "lucide-react"

type TopicFilter = MaterialTopic | "all"
type DifficultyFilter = MaterialDifficulty | "all"
type FormatFilter = MaterialFormat | "all"

const MAX_PATH_ITEMS = 3

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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

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

  const learningPaths = useMemo<MaterialPath[]>(() => buildMaterialPaths(filteredMaterials), [filteredMaterials])

  const activeFilterCount = Number(topic !== "all") + Number(difficulty !== "all") + Number(format !== "all")
  const hasQuery = searchQuery.trim().length > 0
  const hasFilters = hasQuery || activeFilterCount > 0

  const clearFilters = () => {
    setSearchQuery("")
    setTopic("all")
    setDifficulty("all")
    setFormat("all")
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Header subtitle={t("learningMaterials")} showNav={false} />

      <div className="container mx-auto px-4 pt-10 pb-16">
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">{t("materialsAndLessons")}</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">{t("materialsDescriptionLong")}</p>
        </AnimatedSection>

        <AnimatedSection className="mb-10">
          <Card className="border-slate-200/80 bg-white/95 shadow-sm">
            <CardContent className="pt-6 space-y-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t("searchMaterialsPlaceholder")}
                  className="pl-9"
                />
              </div>

              <div className="md:hidden">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 justify-between"
                    onClick={() => setMobileFiltersOpen((open) => !open)}
                    aria-expanded={mobileFiltersOpen}
                    aria-controls="mobile-material-filters"
                  >
                    <span>{mobileFiltersOpen ? t("hideFilters") : t("showFilters")}</span>
                    <span className="inline-flex items-center gap-2">
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="rounded-full px-2 text-xs">
                          {activeFilterCount}
                        </Badge>
                      )}
                      <Filter className="h-4 w-4" />
                    </span>
                  </Button>
                  {hasFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-600"
                      onClick={clearFilters}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="mt-3 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                  <Button
                    variant={topic === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTopic("all")}
                    className={cn("shrink-0", topic === "all" ? "bg-armath-blue hover:bg-armath-blue/90" : "text-slate-600")}
                  >
                    {t("allTopics")}
                  </Button>
                  {topicOptions.map((option) => (
                    <Button
                      key={option}
                      variant={topic === option ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTopic(option)}
                      className={cn(
                        "shrink-0",
                        topic === option ? "bg-armath-blue hover:bg-armath-blue/90" : MATERIAL_TOPIC_STYLES[option]
                      )}
                    >
                      {t(MATERIAL_TOPIC_LABELS[option])}
                    </Button>
                  ))}
                </div>

                <AnimatePresence initial={false}>
                  {mobileFiltersOpen && (
                    <motion.div
                      id="mobile-material-filters"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                      className="mt-3 grid gap-3"
                    >
                      <Select value={difficulty} onValueChange={(value) => setDifficulty(value as DifficultyFilter)}>
                        <SelectTrigger>
                          <SelectValue placeholder={t("filterByDifficulty")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("allDifficulties")}</SelectItem>
                          {difficultyOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {t(MATERIAL_DIFFICULTY_LABELS[option])}
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
                              {t(MATERIAL_FORMAT_LABELS[option])}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {hasFilters && (
                        <Button variant="outline" onClick={clearFilters}>
                          {t("clearFilters")}
                        </Button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Select value={topic} onValueChange={(value) => setTopic(value as TopicFilter)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("filterByTopic")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("allTopics")}</SelectItem>
                    {topicOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {t(MATERIAL_TOPIC_LABELS[option])}
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
                        {t(MATERIAL_DIFFICULTY_LABELS[option])}
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
                        {t(MATERIAL_FORMAT_LABELS[option])}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={clearFilters} disabled={!hasFilters}>
                  {t("clearFilters")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        {learningPaths.length > 0 && (
          <AnimatedSection className="mb-14">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t("learningPaths")}</h2>
              <p className="text-slate-600 mt-2">{t("learningPathsDescription")}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {learningPaths.map((path, index) => (
                <AnimatedSection key={path.topic} animation="fadeInUp" delay={index * 0.08}>
                  <Card className="h-full border-slate-200/80 bg-white/95 shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant="outline" className={MATERIAL_TOPIC_STYLES[path.topic]}>
                          {t(MATERIAL_TOPIC_LABELS[path.topic])}
                        </Badge>
                        {path.levels.map((level) => (
                          <Badge key={`${path.topic}-${level}`} variant="outline" className={MATERIAL_DIFFICULTY_STYLES[level]}>
                            {t(MATERIAL_DIFFICULTY_LABELS[level])}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-xl">{t("learningPathLabel")}</CardTitle>
                      <CardDescription>
                        {path.materials.length} {t("materialsInPath")} • {path.totalDurationMinutes} {t("minutes")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {path.materials.slice(0, MAX_PATH_ITEMS).map((material) => (
                        <Link
                          key={material.id}
                          href={`/materials/${material.slug}`}
                          className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 transition-colors"
                        >
                          <span className="line-clamp-1 text-slate-700">{material.title}</span>
                          <Badge variant="outline" className={MATERIAL_DIFFICULTY_STYLES[material.difficulty]}>
                            {t(MATERIAL_DIFFICULTY_LABELS[material.difficulty])}
                          </Badge>
                        </Link>
                      ))}
                      {path.materials.length > 0 && (
                        <Link href={getMaterialPathHref(path.topic)} className="inline-flex items-center text-sm font-medium text-armath-blue">
                          {t("startPath")}
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        )}

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
                        <Badge variant="outline" className={MATERIAL_TOPIC_STYLES[material.topic]}>
                          {t(MATERIAL_TOPIC_LABELS[material.topic])}
                        </Badge>
                        <Badge variant="outline" className={MATERIAL_DIFFICULTY_STYLES[material.difficulty]}>
                          {t(MATERIAL_DIFFICULTY_LABELS[material.difficulty])}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2 transition-colors group-hover:text-armath-blue">
                        {material.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">{material.summary}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-slate-500">{t(MATERIAL_FORMAT_LABELS[material.format])}</p>
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
