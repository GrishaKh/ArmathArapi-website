"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react"
import type { TranslationKey } from "@/lib/translations"

export function HeroSection() {
  const { t, language } = useLanguage()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const quickLinks: Array<{ key: TranslationKey; href: string }> = [
    { key: "fieldsOfStudy", href: "#fieldsOfStudy" },
    { key: "ourProjects", href: "#ourProjects" },
    { key: "events", href: "#events" },
    { key: "supportArmath", href: "#supportArmath" },
  ]

  return (
    <section ref={heroRef} className="relative overflow-hidden py-24 md:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-28 -left-16 h-72 w-72 rounded-full bg-armath-blue/15 blur-3xl" />
        <div className="absolute top-16 -right-20 h-80 w-80 rounded-full bg-armath-red/10 blur-3xl" />
      </div>

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="container mx-auto px-4 relative z-10"
      >
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="mb-5 bg-armath-blue/10 text-armath-blue hover:bg-armath-blue/15">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                {t("heroBadge")}
              </Badge>
            </motion.div>

            <motion.h1
              className={cn(
                "font-bold text-slate-900 mb-6 leading-tight",
                language === "hy" ? "text-3xl sm:text-5xl tracking-tight" : "text-4xl sm:text-6xl"
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
                "mb-8 max-w-2xl text-slate-600",
                language === "hy" ? "text-lg tracking-tight" : "text-xl"
              )}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              {t("heroSubtitle")}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3"
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

          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.45 }}
          >
            <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-xl">
              <p className="text-xs font-semibold tracking-wider uppercase text-slate-500 mb-4">
                {t("engineeringMakerspace")}
              </p>
              <div className="space-y-3">
                {quickLinks.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-slate-700 hover:border-armath-blue/40 hover:bg-slate-50 transition-all"
                  >
                    <span className={cn(language === "hy" && "tracking-tight")}>{t(item.key)}</span>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-armath-blue transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
