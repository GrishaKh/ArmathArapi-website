"use client"

import { use } from "react"
import { useMDXComponent } from "next-contentlayer2/hooks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ExternalLink, Zap } from "lucide-react"
import { getStudentBySlug } from "@/lib/students"
import { getProjectBySlug } from "@/lib/projects"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"
import { LanguageToggle } from "@/components/language-toggle"

// Custom MDX components to match current styling
const mdxComponents = {
  h2: (props: any) => <h2 className="text-3xl font-bold text-slate-900 mb-4 mt-8" {...props} />,
  p: (props: any) => <p className="text-slate-600 text-lg leading-relaxed mb-4" {...props} />,
  ul: (props: any) => <ul className="space-y-4 mb-6" {...props} />,
  li: (props: any) => (
    <li className="flex gap-4" {...props}>
      <Zap className="w-6 h-6 text-armath-blue shrink-0 mt-1" />
      <span className="text-slate-600 text-lg">{props.children}</span>
    </li>
  ),
}

interface Props {
  params: Promise<{ slug: string }>
}

export default function StudentProfilePage({ params }: Props) {
  const { slug } = use(params)
  const { t, language } = useLanguage()
  const student = getStudentBySlug(slug, language)

  if (!student) {
    notFound()
  }

  const MDXContent = useMDXComponent(student.body.code)

  const interests = student.interests || []
  const skills = student.skills || []
  const achievements = student.achievements || []
  const links = student.links || []
  const projectSlugs = student.projects || []
  const linkedProjects = projectSlugs
    .map((projectSlug) => getProjectBySlug(projectSlug, language))
    .filter((project): project is NonNullable<typeof project> => Boolean(project))

  return (
    <div className="min-h-screen">
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/#students" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">{t("backToStudents")}</span>
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

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            {/* Header block: photo + name + tagline */}
            <div className="grid md:grid-cols-[280px_1fr] gap-8 items-center">
              <AnimatedSection animation="fadeInUp" delay={0.2}>
                <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200/80 shadow-lg">
                  <Image src={student.photo || "/placeholder.svg"} alt={student.name} fill className="object-cover" />
                </div>
              </AnimatedSection>
              <AnimatedSection>
                <h1 className={cn("text-5xl font-bold text-slate-900 mb-4", language === "hy" && "text-4xl")}>
                  {student.name}
                </h1>
                {student.tagline && <p className="text-xl text-slate-600 mb-6">{student.tagline}</p>}
                <div className="flex flex-wrap gap-2">
                  {student.grade && (
                    <Badge variant="secondary" className="text-sm">
                      {t("studentGrade")}: {student.grade}
                    </Badge>
                  )}
                  {typeof student.age === "number" && (
                    <Badge variant="secondary" className="text-sm">
                      {t("studentAge")}: {student.age}
                    </Badge>
                  )}
                  {typeof student.joinedYear === "number" && (
                    <Badge variant="secondary" className="text-sm">
                      {t("studentJoined")}: {student.joinedYear}
                    </Badge>
                  )}
                </div>
              </AnimatedSection>
            </div>

            {/* Basics chips: interests + skills */}
            {(interests.length > 0 || skills.length > 0) && (
              <AnimatedSection animation="fadeInUp" delay={0.1}>
                <div className="grid md:grid-cols-2 gap-8">
                  {interests.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-slate-900">{t("studentInterests")}</h2>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                          <Badge key={interest} variant="secondary" className="text-sm">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {skills.length > 0 && (
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-slate-900">{t("studentSkills")}</h2>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            )}

            {/* Bio = MDX body */}
            <AnimatedSection>
              <article className="prose prose-lg max-w-none">
                <MDXContent components={mdxComponents} />
              </article>
            </AnimatedSection>

            {/* Linked projects */}
            {linkedProjects.length > 0 && (
              <AnimatedSection animation="fadeInUp" delay={0.3}>
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-slate-900">{t("studentProjects")}</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {linkedProjects.map((project) => (
                      <Link key={project.slug} href={`/projects/${project.slug}`} className="block h-full w-full">
                        <Card className="group h-full w-full overflow-hidden border-slate-200/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col rounded-xl">
                          <div className="relative overflow-hidden shrink-0 w-full">
                            <Image
                              src={project.image || "/placeholder.svg"}
                              alt={project.title}
                              width={800}
                              height={500}
                              className="object-cover group-hover:scale-105 transition-transform duration-700 w-full h-48"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                          <CardContent className="flex flex-col gap-2 pt-6 md:pt-7">
                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-armath-blue transition-colors line-clamp-2">
                              {project.title}
                            </h3>
                            <div className="flex items-center text-sm font-medium text-armath-blue group-hover:gap-2 transition-all">
                              {t("viewProject")}
                              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <AnimatedSection animation="fadeInUp" delay={0.4}>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-slate-900">{t("studentAchievements")}</h2>
                  <ul className="space-y-4">
                    {achievements.map((achievement, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-3 text-slate-600"
                      >
                        <span className="text-armath-blue font-bold mt-1 shrink-0">✓</span>
                        <span className="text-lg leading-relaxed">{achievement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}

            {/* Links */}
            {links.length > 0 && (
              <AnimatedSection animation="fadeInUp" delay={0.5}>
                <Card>
                  <CardHeader>
                    <CardTitle>{t("studentLinks")}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3">
                    {links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="border-armath-blue/30 text-armath-blue">
                          {link.label}
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </a>
                    ))}
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
