"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  const { t, language } = useLanguage()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <section ref={heroRef} className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-28 left-1/4 h-96 w-96 rounded-full bg-armath-blue/12 blur-3xl" />
        <div className="absolute top-20 right-1/4 h-80 w-80 rounded-full bg-armath-red/8 blur-3xl" />
      </div>

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge className="mb-5 bg-armath-blue/10 text-armath-blue hover:bg-armath-blue/15">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              {t("heroBadge")}
            </Badge>
          </motion.div>

          <motion.h1
            className={cn(
              "font-bold text-slate-900 mb-6 leading-tight",
              language === "hy" ? "text-4xl sm:text-5xl md:text-6xl tracking-tight" : "text-4xl sm:text-5xl md:text-7xl"
            )}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
          >
            {t("armathArapi")}
            <span className="block text-armath-red">{t("engineeringMakerspace")}</span>
          </motion.h1>

          <motion.p
            className={cn(
              "mb-10 max-w-2xl mx-auto text-slate-600",
              language === "hy" ? "text-lg tracking-tight" : "text-xl"
            )}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            {t("heroSubtitle")}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35 }}
          >
            <Button
              size="lg"
              className="bg-armath-red hover:bg-armath-red/90"
              onClick={() => document.getElementById("joinAsStudent")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t("joinAsStudent")}
              <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-armath-blue/30 text-armath-blue hover:bg-armath-blue/10"
              onClick={() => document.getElementById("ourProjects")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t("ourProjects")}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
