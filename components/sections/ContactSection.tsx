import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import { MultimeterWire } from "@/components/multimeter-wire"
import { Calendar, Mail, MapPin, Phone } from "lucide-react"
import { motion } from "framer-motion"

export function ContactSection() {
  const { t, language } = useLanguage()
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("contactTitle")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">{t("getInTouch")}</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12">
          <AnimatedSection>
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{t("getInTouch")}</h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: MapPin,
                      label: t("location"),
                      value: language === "hy" ? "Առափի, Շիրակի մարզ, Հայաստան" : "Arapi, Shirak Province, Armenia",
                    },
                    {
                      icon: Phone,
                      label: t("phone"),
                      value: "+374 XX XXX XXX",
                    },
                    {
                      icon: Mail,
                      label: t("email"),
                      value: "info@armath-arapi.am",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      className="flex items-center space-x-4 p-4 bg-white rounded-lg hover:shadow-md transition-all duration-300 group cursor-pointer"
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 10 }}
                    >
                      <motion.div
                        className="w-12 h-12 bg-armath-blue/10 rounded-lg flex items-center justify-center group-hover:bg-armath-blue/20 transition-colors"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.3 }}
                      >
                        <item.icon className="w-6 h-6 text-armath-blue group-hover:text-armath-red transition-colors" />
                      </motion.div>
                      <div>
                        <div className="font-medium group-hover:text-armath-blue transition-colors">{item.label}</div>
                        <div className="text-gray-600 group-hover:text-gray-800 transition-colors">{item.value}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <MultimeterWire startX={50} startY={50} endX={200} endY={150} color="#3EC1CF" animated={true} />
                <div className="text-center mt-8">
                  <p className="text-sm text-gray-500 italic">
                    {language === "hy" ? "Մեզ հետ կապվելու համար օգտագործեք վերևի կապի միջոցները" : "Use the contact methods above to connect with us"}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <Card className="hover:shadow-xl transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-2xl text-center">{t("sendMessage")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("name")}</label>
                  <Input placeholder={language === "hy" ? "Ձեր անունը" : "Your name"} className="focus:ring-armath-blue transition-all duration-300 hover:border-armath-blue/50" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("email")}</label>
                  <Input type="email" placeholder={language === "hy" ? "Ձեր էլ. փոստը" : "Your email"} className="focus:ring-armath-blue transition-all duration-300 hover:border-armath-blue/50" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("message")}</label>
                  <Textarea placeholder={language === "hy" ? "Ձեր հաղորդագրությունը..." : "Your message..."} className="focus:ring-armath-blue transition-all duration-300 hover:border-armath-blue/50 resize-none" rows={5} />
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <button className="w-full bg-armath-red hover:bg-armath-red/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-md text-white py-2 text-sm font-medium">
                    {t("send")}
                  </button>
                </motion.div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
