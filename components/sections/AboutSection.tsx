import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Eye, Lightbulb, Target } from "lucide-react"

export function AboutSection() {
  const { t } = useLanguage()
  return (
    <section id="aboutUs" className="py-24 bg-transparent">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{t("aboutUs")}</h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-7 mb-10">
          <AnimatedSection>
            <Card className="h-full border-slate-200/80 bg-white/95 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="rounded-xl bg-armath-blue/10 p-2">
                    <Eye className="w-6 h-6 text-armath-blue" />
                  </div>
                  <CardTitle className="text-armath-blue">
                    {t("vision")}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">{t("visionText")}</p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <Card className="h-full border-slate-200/80 bg-white/95 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="rounded-xl bg-armath-red/10 p-2">
                    <Target className="w-6 h-6 text-armath-red" />
                  </div>
                  <CardTitle className="text-armath-red">
                    {t("mission")}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">{t("missionText")}</p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <Card className="h-full border-slate-200/80 bg-white/95 shadow-sm transition-shadow duration-300 hover:shadow-md">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="rounded-xl bg-armath-blue/10 p-2">
                    <Lightbulb className="w-6 h-6 text-armath-blue" />
                  </div>
                  <CardTitle className="text-armath-blue">
                    {t("whatWeDo")}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed">{t("whatWeDoText")}</p>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
