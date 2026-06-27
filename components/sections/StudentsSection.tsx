"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { getAllStudents } from "@/lib/students"
import { AnimatedSection } from "@/components/animated-section"
import { Card } from "@/components/ui/card"

export function StudentsSection() {
  const { t, language } = useLanguage()
  const students = getAllStudents(language)

  if (students.length === 0) {
    return null
  }

  return (
    <section id="students" className="py-24 bg-transparent">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">{t("students")}</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">{t("studentsDescription")}</p>
        </AnimatedSection>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full">
          {students.map((student, index) => (
            <AnimatedSection
              key={student.id}
              animation="fadeInUp"
              delay={index * 0.1}
              className="w-full min-w-0"
            >
              <Link
                href={`/students/${student.slug}`}
                aria-label={`${student.name} — ${t("viewProfile")}`}
                className="block h-full w-full"
              >
                <Card className="group h-full w-full overflow-hidden border-slate-200/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col rounded-xl">
                  <div className="relative overflow-hidden shrink-0 w-full">
                    <Image
                      src={student.photo || "/placeholder.svg"}
                      alt={student.name}
                      width={400}
                      height={400}
                      className="object-cover group-hover:scale-105 transition-transform duration-700 w-full aspect-square"
                    />
                    {/* Hover name reveal (desktop only) */}
                    <div className="absolute inset-0 hidden md:flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="p-4 text-base font-semibold text-white drop-shadow">
                        {student.name}
                      </span>
                    </div>
                  </div>
                  {/* Always-visible caption (mobile only) */}
                  <div className="md:hidden p-3">
                    <span className="block text-sm font-medium text-slate-900">{student.name}</span>
                  </div>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
