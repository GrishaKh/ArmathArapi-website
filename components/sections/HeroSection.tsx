"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"
import { ArrowRight, Users, Cpu, Trophy } from "lucide-react"
import Image from "next/image"

const stats = [
  { icon: Users, valueKey: "statStudents", labelKey: "statStudentsLabel" },
  { icon: Cpu, valueKey: "statFields", labelKey: "statFieldsLabel" },
  { icon: Trophy, valueKey: "statProjects", labelKey: "statProjectsLabel" },
] as const

export function HeroSection() {
  const { t, language } = useLanguage()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.96])

  return (
    <section ref={heroRef} className="relative overflow-hidden bg-surface-dark min-h-[90vh] flex items-center">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-makerspace.jpg"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-dark/60 via-surface-dark/40 to-surface-dark" />
      </div>

      {/* Decorative accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-armath-blue/40 to-transparent" />

      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="container mx-auto px-4 relative z-10 py-20 md:py-28"
      >
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <span className="inline-flex items-center rounded-full border border-armath-blue/30 bg-armath-blue/10 px-4 py-1.5 text-sm font-medium text-armath-blue">
              {t("heroBadge")}
            </span>
          </motion.div>

          <motion.h1
            className={cn(
              "font-bold text-white mb-6 leading-[1.1] text-balance",
              language === "hy"
                ? "text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight"
                : "text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tighter"
            )}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t("armathArapi")}
            <br />
            <span className="text-armath-blue">{t("engineeringMakerspace")}</span>
          </motion.h1>

          <motion.p
            className={cn(
              "mb-10 max-w-2xl text-white/60 leading-relaxed",
              language === "hy" ? "text-lg tracking-tight" : "text-lg md:text-xl"
            )}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            {t("heroSubtitle")}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Button
              size="lg"
              className="rounded-full bg-armath-red hover:bg-armath-red/90 text-white px-8 font-medium shadow-lg shadow-armath-red/20"
              onClick={() => document.getElementById("joinAsStudent")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t("joinAsStudent")}
              <ArrowRight className="ml-1.5 w-4 h-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/20 text-white bg-white/5 hover:bg-white/10 hover:border-white/30 px-8 transition-all"
              onClick={() => document.getElementById("ourProjects")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t("ourProjects")}
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="flex flex-wrap gap-8 md:gap-12 mt-16 pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {stats.map((stat) => (
              <div key={stat.labelKey} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                  <stat.icon className="h-5 w-5 text-armath-blue" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{t(stat.valueKey as never)}</div>
                  <div className="text-xs text-white/50">{t(stat.labelKey as never)}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
