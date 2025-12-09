"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { ExternalLink, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { projects } from "@/lib/projects"

export function ProjectsSection() {
  const { t } = useLanguage()

  return (
    <section id="ourProjects" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("projectsTitle")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">{t("projectsDescription")}</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <AnimatedSection key={project.id} animation="fadeInUp" delay={index * 0.2}>
              <Link href={`/projects/${project.slug}`} className="block h-full">
                <Card className="hover:shadow-xl transition-all duration-500 hover:scale-105 group h-full overflow-hidden cursor-pointer">
                  <div className="relative">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-armath-blue transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">{t("toolsUsed")}:</p>
                        <div className="flex flex-wrap gap-1">
                          {project.tools.map((tool) => (
                            <Badge key={tool} variant="secondary" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full group-hover:bg-armath-blue group-hover:text-white transition-colors bg-transparent"
                        >
                          {t("viewProject")}
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </Button>
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
              {t("viewAllProjects") || "View All Projects"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
