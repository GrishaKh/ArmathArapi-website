"use client"

import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { BookOpen, DollarSign, Heart, UserCheck, Wrench, Loader2, CheckCircle, XCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

export function SupportSection() {
  const { t, language } = useLanguage()
  const [supportFormData, setSupportFormData] = useState({
    name: "",
    email: "",
    supportType: "",
    message: "",
  })
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supportFormData.name.trim() || !supportFormData.email.trim() || !supportFormData.supportType || !supportFormData.message.trim()) {
      setErrorMessage(t("errorRequired"))
      setSubmitStatus('error')
      return
    }

    setSubmitStatus('loading')
    setErrorMessage("")

    try {
      const response = await fetch('/api/submissions/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...supportFormData,
          language,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitStatus('success')
        setTimeout(() => {
          setSupportFormData({ name: "", email: "", supportType: "", message: "" })
          setSubmitStatus('idle')
        }, 3000)
      } else {
        setErrorMessage(data.error || data.message || t("errorConnection"))
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setErrorMessage(t("errorConnection"))
      setSubmitStatus('error')
    }
  }

  const resetForm = () => {
    setSubmitStatus('idle')
    setErrorMessage("")
  }

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
              <CardContent>
                <AnimatePresence mode="wait">
                  {submitStatus === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex flex-col items-center justify-center py-8 space-y-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.1 }}
                        className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle className="w-8 h-8 text-emerald-600" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {t("supportSubmitted")}
                      </h3>
                      <p className="text-gray-600 text-center">
                        {t("supportThankYou")}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">{t("name")}</label>
                        <Input
                          value={supportFormData.name}
                          onChange={(e) => setSupportFormData({ ...supportFormData, name: e.target.value })}
                          placeholder={t("yourName")}
                          className="focus:ring-armath-blue"
                          disabled={submitStatus === 'loading'}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">{t("email")}</label>
                        <Input
                          type="email"
                          value={supportFormData.email}
                          onChange={(e) => setSupportFormData({ ...supportFormData, email: e.target.value })}
                          placeholder={t("yourEmail")}
                          className="focus:ring-armath-blue"
                          disabled={submitStatus === 'loading'}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">{t("supportType")}</label>
                        <Select 
                          value={supportFormData.supportType} 
                          onValueChange={(value) => setSupportFormData({ ...supportFormData, supportType: value })}
                          disabled={submitStatus === 'loading'}
                        >
                          <SelectTrigger className="focus:ring-armath-blue">
                          <SelectValue placeholder={t("selectSupportType")} />
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
                          placeholder={t("yourMessage")}
                          className="focus:ring-armath-blue resize-none"
                          rows={4}
                          disabled={submitStatus === 'loading'}
                        />
                      </div>

                      {submitStatus === 'error' && errorMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                        >
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <p className="text-sm text-red-600">{errorMessage}</p>
                          <button 
                            type="button" 
                            onClick={resetForm}
                            className="ml-auto text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </motion.div>
                      )}

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          type="submit"
                          className="w-full bg-armath-blue hover:bg-armath-blue/90 shadow-lg hover:shadow-xl transition-all duration-300"
                          disabled={submitStatus === 'loading'}
                        >
                          {submitStatus === 'loading' ? (
                            <span className="flex items-center space-x-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>{t("sending")}</span>
                            </span>
                          ) : (
                            t("send")
                          )}
                        </Button>
                      </motion.div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
