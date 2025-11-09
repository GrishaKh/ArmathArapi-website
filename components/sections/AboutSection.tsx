import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Eye, Lightbulb, Target } from "lucide-react"
import { motion } from "framer-motion"

export function AboutSection() {
  const { t } = useLanguage()
  return (
    <section id="aboutUs" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("aboutUs")}</h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <AnimatedSection>
            <Card className="border-armath-blue/20 hover:shadow-xl transition-all duration-500 hover:scale-105 group h-full">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                    <Eye className="w-6 h-6 text-armath-blue" />
                  </motion.div>
                  <CardTitle className="text-armath-blue group-hover:text-armath-blue/80 transition-colors">
                    {t("vision")}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{t("visionText")}</p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <Card className="border-armath-red/20 hover:shadow-xl transition-all duration-500 hover:scale-105 group h-full">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
                    <Target className="w-6 h-6 text-armath-red" />
                  </motion.div>
                  <CardTitle className="text-armath-red group-hover:text-armath-red/80 transition-colors">
                    {t("mission")}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{t("missionText")}</p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <Card className="border-armath-blue/20 hover:shadow-xl transition-all duration-500 hover:scale-105 group h-full">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                    <Lightbulb className="w-6 h-6 text-armath-blue" />
                  </motion.div>
                  <CardTitle className="text-armath-blue group-hover:text-armath-blue/80 transition-colors">
                    {t("whatWeDo")}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{t("whatWeDoText")}</p>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
