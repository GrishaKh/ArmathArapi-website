"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getProjectsSortedByYear } from "@/lib/projects"
import { cn } from "@/lib/utils"
import { Header } from "@/components/Header"

export default function ProjectsPage() {
  const { t, language } = useLanguage()
  const projects = getProjectsSortedByYear(language)

  return (
    <div className="min-h-screen bg-white">
      <Header subtitle={t("ourProjects")} showNav={false} />

      <section className="py-20 bg-gradient-to-br from-armath-blue/5 to-transparent">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-16">
            <h1 className={cn("text-5xl font-bold text-gray-900 mb-4", language === "hy" && "text-4xl")}>
              {t("ourProjects")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t("projectsDescription")}</p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const category = project.categoryHy && language === "hy" ? project.categoryHy : project.category
              const shortDescription = project.shortDescription || project.description || ""
              const tools = project.toolsHy && language === "hy" ? (project.toolsHy || []) : (project.tools || [])

              return (
                <AnimatedSection key={project.id} animation="fadeInUp" delay={index * 0.1}>
                  <Link href={`/projects/${project.slug}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-500 hover:scale-105 group overflow-hidden cursor-pointer">
                      <div className="relative">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          width={400}
                          height={250}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {project.featured && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-armath-red text-white">{t("featured")}</Badge>
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <div className="space-y-2">
                          <Badge variant="outline" className="w-fit text-xs">
                            {category}
                          </Badge>
                          <CardTitle className="group-hover:text-armath-blue transition-colors">
                            {project.title}
                          </CardTitle>
                        </div>
                        <CardDescription>{shortDescription}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {tools.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-600 mb-2">{t("toolsUsed")}</p>
                              <div className="flex flex-wrap gap-1">
                                {tools.slice(0, 3).map((tool) => (
                                  <Badge key={tool} variant="secondary" className="text-xs">
                                    {tool}
                                  </Badge>
                                ))}
                                {tools.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{tools.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                          <motion.div whileHover={{ x: 4 }}>
                            <div className="flex items-center text-sm font-medium text-armath-blue group-hover:gap-2 transition-all">
                              {t("learnMore")}
                              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}