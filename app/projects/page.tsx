"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { projects } from "@/lib/projects"
import { cn } from "@/lib/utils"

export default function ProjectsPage() {
  const { t, language } = useLanguage()

  const categories = Array.from(new Set(projects.map((p) => (language === "hy" ? p.categoryHy : p.category))))

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 border-b bg-white/30 backdrop-blur-xl supports-[backdrop-filter]:bg-white/20"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <motion.div
              className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden border border-armath-blue/20 bg-white shadow-sm"
              whileHover={{ rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="/logo.png"
                alt={language === "hy" ? "Արմաթ Առափի լոգո" : "Armath Arapi logo"}
                fill
                className="object-contain p-1.5"
                sizes="48px"
              />
            </motion.div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg sm:text-xl">
                {language === "hy" ? "Արմաթ Առափի" : "Armath Arapi"}
              </h1>
              <p className="text-sm text-gray-600">{t("ourProjects")}</p>
            </div>
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
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

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <AnimatedSection key={project.id} animation="fadeInUp" delay={index * 0.1}>
                <Link href={`/projects/${project.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-500 hover:scale-105 group overflow-hidden cursor-pointer">
                    <div className="relative">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={language === "hy" ? project.titleHy : project.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {project.featured && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-armath-red text-white">Featured</Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="space-y-2">
                        <Badge variant="outline" className="w-fit text-xs">
                          {language === "hy" ? project.categoryHy : project.category}
                        </Badge>
                        <CardTitle className="group-hover:text-armath-blue transition-colors">
                          {language === "hy" ? project.titleHy : project.title}
                        </CardTitle>
                      </div>
                      <CardDescription>
                        {language === "hy" ? project.shortDescriptionHy : project.shortDescription}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-2">{t("toolsUsed")}</p>
                          <div className="flex flex-wrap gap-1">
                            {(language === "hy" ? project.toolsHy : project.tools).slice(0, 3).map((tool) => (
                              <Badge key={tool} variant="secondary" className="text-xs">
                                {tool}
                              </Badge>
                            ))}
                            {(language === "hy" ? project.toolsHy : project.tools).length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{(language === "hy" ? project.toolsHy : project.tools).length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
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
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
