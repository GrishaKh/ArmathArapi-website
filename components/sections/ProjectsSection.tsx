"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { ArrowRight, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { getProjectsSortedByYear } from "@/lib/projects"

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
    <section id="ourProjects" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("projectsTitle")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">{t("projectsDescription")}</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <AnimatedSection key={project.id} animation="fadeInUp" delay={index * 0.15}>
              <Link href={`/projects/${project.slug}`} className="block h-full">
                <Card className="hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group h-full overflow-hidden cursor-pointer border-transparent hover:border-armath-blue/20">
                  <div className="relative overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={getProjectTitle(project)}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
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
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg">
                        {project.year}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <div className="space-y-2">
                      {/* Category badge */}
                      <Badge variant="outline" className="w-fit text-xs border-armath-blue/30 text-armath-blue">
                        {getProjectCategory(project)}
                      </Badge>
                      <CardTitle className="text-lg group-hover:text-armath-blue transition-colors line-clamp-2">
                        {getProjectTitle(project)}
                      </CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {getProjectDescription(project)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Tools used */}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">{t("toolsUsed")}:</p>
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
                      <motion.div whileHover={{ x: 4 }}>
                        <div className="flex items-center text-sm font-medium text-armath-blue">
                          {t("viewProject")}
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.div>
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
