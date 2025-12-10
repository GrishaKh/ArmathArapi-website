import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FloatingElement } from "@/components/floating-element"
import { useLanguage } from "@/contexts/language-context"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"
import { ArrowRight, Bot, Cog, Cpu } from "lucide-react"

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
    <section ref={heroRef} className="py-20 bg-gradient-to-br from-blue-50 to-red-50 relative overflow-hidden">
      <motion.div style={{ y: heroY, opacity: heroOpacity }} className="container mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <Badge className="mb-4 bg-armath-blue/10 text-armath-blue hover:bg-armath-blue/10 transform hover:scale-105 transition-all duration-200">
            {t("heroBadge")}
          </Badge>
        </motion.div>

        <motion.h1
          className={cn(
            "font-bold text-gray-900 mb-6",
            language === "hy" ? "text-3xl md:text-5xl tracking-tight" : "text-4xl md:text-6xl"
          )}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {t("armathArapi")}
          <motion.span
            className="text-armath-red block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {t("engineeringMakerspace")}
          </motion.span>
        </motion.h1>

        <motion.p
          className={cn(
            "text-gray-600 mb-8 max-w-3xl mx-auto",
            language === "hy" ? "text-lg tracking-tight" : "text-xl"
          )}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {t("heroSubtitle")}
        </motion.p>

        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1 }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="bg-armath-red hover:bg-armath-red/90 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => document.getElementById("joinAsStudent")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t("joinAsStudent")}
              <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                <ArrowRight className="ml-2 w-4 h-4" />
              </motion.div>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              variant="outline"
              className="border-armath-blue text-armath-blue hover:bg-armath-blue hover:text-white bg-transparent shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => document.getElementById("ourProjects")?.scrollIntoView({ behavior: "smooth" })}
            >
              {t("ourProjects")}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating background elements */}
      <FloatingElement className="absolute top-20 left-10 opacity-10" duration={4}>
        <Cog className="w-20 h-20 text-armath-blue" />
      </FloatingElement>
      <FloatingElement className="absolute top-40 right-20 opacity-10" duration={5} yOffset={15}>
        <Cpu className="w-16 h-16 text-armath-red" />
      </FloatingElement>
      <FloatingElement className="absolute bottom-20 left-1/4 opacity-10" duration={6} yOffset={20}>
        <Bot className="w-12 h-12 text-armath-blue" />
      </FloatingElement>
    </section>
  )
}
