import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { BookOpen, DollarSign, Heart, UserCheck, Wrench } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export function SupportSection() {
  const { t, language } = useLanguage()
  const [supportFormData, setSupportFormData] = useState({
    name: "",
    email: "",
    supportType: "",
    message: "",
  })

  return (
    <section id="supportArmath" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("supportTitle")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">{t("supportDescription")}</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12">
          <AnimatedSection>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t("waysToSupport")}</h3>
              <div className="space-y-4">
                {[
                  { icon: BookOpen, text: t("hostWorkshop") },
                  { icon: Wrench, text: t("donateEquipment") },
                  { icon: DollarSign, text: t("financialSupport") },
                  { icon: UserCheck, text: t("mentoring") },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-armath-blue/5 transition-colors group cursor-pointer"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    <motion.div
                      className="w-12 h-12 bg-armath-blue/10 rounded-lg flex items-center justify-center group-hover:bg-armath-blue/20 transition-colors"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className="w-6 h-6 text-armath-blue" />
                    </motion.div>
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <Card className="hover:shadow-xl transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-2xl text-center flex items-center justify-center space-x-2">
                  <Heart className="w-6 h-6 text-armath-red" />
                  <span>{t("supportUs")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("name")}</label>
                  <Input
                    value={supportFormData.name}
                    onChange={(e) => setSupportFormData({ ...supportFormData, name: e.target.value })}
                    placeholder={language === "hy" ? "Ձեր անունը" : "Your name"}
                    className="focus:ring-armath-blue"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("email")}</label>
                  <Input
                    type="email"
                    value={supportFormData.email}
                    onChange={(e) => setSupportFormData({ ...supportFormData, email: e.target.value })}
                    placeholder={language === "hy" ? "Ձեր էլ. փոստը" : "Your email"}
                    className="focus:ring-armath-blue"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("supportType")}</label>
                  <Select value={supportFormData.supportType} onValueChange={(value) => setSupportFormData({ ...supportFormData, supportType: value })}>
                    <SelectTrigger className="focus:ring-armath-blue">
                      <SelectValue placeholder={language === "hy" ? "Ընտրեք աջակցության տեսակը" : "Select support type"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="workshop">{t("hostWorkshop")}</SelectItem>
                      <SelectItem value="equipment">{t("donateEquipment")}</SelectItem>
                      <SelectItem value="financial">{t("financialSupport")}</SelectItem>
                      <SelectItem value="mentoring">{t("mentoring")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("message")}</label>
                  <Textarea
                    value={supportFormData.message}
                    onChange={(e) => setSupportFormData({ ...supportFormData, message: e.target.value })}
                    placeholder={language === "hy" ? "Ձեր հաղորդագրությունը..." : "Your message..."}
                    className="focus:ring-armath-blue resize-none"
                    rows={4}
                  />
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full bg-armath-blue hover:bg-armath-blue/90 shadow-lg hover:shadow-xl transition-all duration-300">
                    {t("send")}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
