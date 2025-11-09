import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Users, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export function JoinSection() {
  const { t, language } = useLanguage()
  const [joinFormData, setJoinFormData] = useState({
    studentName: "",
    age: "",
    parentContact: "",
    interests: "",
  })

  return (
    <section id="joinAsStudent" className="py-20 bg-gradient-to-br from-armath-blue/10 to-armath-red/10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{t("joinTitle")}</h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">{t("joinDescription")}</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-armath-blue/20 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-armath-blue" />
                  </div>
                  <span className="text-gray-700">{t("joinInfo")}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-armath-red/20 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-armath-red" />
                  </div>
                  <span className="text-gray-700">{t("classFrequency")}</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <Card className="hover:shadow-xl transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-2xl text-center">{t("applyNow")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("studentName")}</label>
                  <Input
                    value={joinFormData.studentName}
                    onChange={(e) => setJoinFormData({ ...joinFormData, studentName: e.target.value })}
                    placeholder={language === "hy" ? "Ուսանողի անունը" : "Student's full name"}
                    className="focus:ring-armath-blue"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("age")}</label>
                  <Select value={joinFormData.age} onValueChange={(value) => setJoinFormData({ ...joinFormData, age: value })}>
                    <SelectTrigger className="focus:ring-armath-blue">
                      <SelectValue placeholder={language === "hy" ? "Ընտրեք տարիքը" : "Select age"} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 8 }, (_, i) => i + 10).map((age) => (
                        <SelectItem key={age} value={age.toString()}>
                          {age} {language === "hy" ? "տարեկան" : "years old"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("parentContact")}</label>
                  <Input
                    value={joinFormData.parentContact}
                    onChange={(e) => setJoinFormData({ ...joinFormData, parentContact: e.target.value })}
                    placeholder={language === "hy" ? "Ծնողի հեռախոսահամար" : "Parent's phone number"}
                    className="focus:ring-armath-blue"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">{t("interests")}</label>
                  <Textarea
                    value={joinFormData.interests}
                    onChange={(e) => setJoinFormData({ ...joinFormData, interests: e.target.value })}
                    placeholder={language === "hy" ? "Ինչ ոլորտներն են հետաքրքրում..." : "What areas are you interested in..."}
                    className="focus:ring-armath-blue resize-none"
                    rows={3}
                  />
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full bg-armath-red hover:bg-armath-red/90 shadow-lg hover:shadow-xl transition-all duration-300">
                    {t("applyNow")}
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
