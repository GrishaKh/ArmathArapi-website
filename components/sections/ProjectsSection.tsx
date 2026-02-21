"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { ArrowRight, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getProjectsSortedByYear } from "@/lib/projects"
import { cn } from "@/lib/utils"

export function ProjectsSection() {
  const { t, language } = useLanguage()
  const projects = getProjectsSortedByYear(language).slice(0, 3) // Show only first 3 for preview

  // Get localized project content
  const getProjectTitle = (project: typeof projects[0]) => project.title

  const getProjectDescription = (project: typeof projects[0]) =>
    project.shortDescription || project.description || ""

  const getProjectCategory = (project: typeof projects[0]) =>
    project.categoryHy && language === "hy" ? project.categoryHy : project.category

  const getProjectTools = (project: typeof projects[0]) =>
    project.toolsHy && language === "hy" ? (project.toolsHy || []) : (project.tools || [])

  return (
    <section id="ourProjects" className="py-24 bg-transparent">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">{t("projectsTitle")}</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">{t("projectsDescription")}</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full auto-rows-[1fr]">
          {projects.map((project, index) => (
            <AnimatedSection
              key={project.id}
              animation="fadeInUp"
              delay={index * 0.15}
              className={cn(
                "w-full min-w-0 h-full",
                index === 0 ? "md:col-span-2 lg:col-span-2 lg:row-span-2" : "col-span-1"
              )}
            >
              <Link href={`/projects/${project.slug}`} className="block h-full w-full">
                <Card className={cn(
                  "group h-full w-full overflow-hidden border-slate-200/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col",
                  index === 0 ? "rounded-2xl" : "rounded-xl"
                )}>
                  <div className="relative overflow-hidden shrink-0">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={getProjectTitle(project)}
                      width={800}
                      height={500}
                      className={cn(
                        "w-full object-cover group-hover:scale-105 transition-transform duration-700",
                        index === 0 ? "h-64 sm:h-80 lg:h-96" : "h-48"
                      )}
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Featured badge */}
                    {project.featured && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-armath-red text-white shadow-lg">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          {t("featured")}
                        </Badge>
                      </div>
                    )}

                    {/* Year badge */}
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-slate-700 shadow-lg">
                        {project.year}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2 grow">
                    <div className="space-y-2">
                      {/* Category badge */}
                      <Badge variant="outline" className="w-fit text-xs border-armath-blue/30 text-armath-blue">
                        {getProjectCategory(project)}
                      </Badge>
                      <CardTitle className={cn(
                        "group-hover:text-armath-blue transition-colors line-clamp-2",
                        index === 0 ? "text-xl sm:text-2xl" : "text-lg"
                      )}>
                        {getProjectTitle(project)}
                      </CardTitle>
                    </div>
                    <CardDescription className={cn(
                      "leading-relaxed",
                      index === 0 ? "line-clamp-3 text-base" : "line-clamp-2"
                    )}>
                      {getProjectDescription(project)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="shrink-0">
                    <div className="space-y-4">
                      {/* Tools used */}
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-2">{t("toolsUsed")}:</p>
                        <div className="flex flex-wrap gap-1">
                          {getProjectTools(project).slice(0, 3).map((tool) => (
                            <Badge key={tool} variant="secondary" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                          {getProjectTools(project).length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-armath-blue/10 text-armath-blue">
                              +{getProjectTools(project).length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* View Project link */}
                      <div className="flex items-center text-sm font-medium text-armath-blue">
                        {t("viewProject")}
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center mt-16">
          <Link href="/projects">
            <Button size="lg" className="bg-armath-blue hover:bg-armath-blue/90">
              {t("viewAllProjects")}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
