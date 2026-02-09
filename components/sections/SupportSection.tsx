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
import { useFormSubmission } from "@/hooks/use-form-submission"

export function SupportSection() {
  const { t, language } = useLanguage()
  const [supportFormData, setSupportFormData] = useState({
    name: "",
    email: "",
    supportType: "",
    message: "",
  })
  const { submitStatus, errorMessage, submitForm, resetSubmissionState, setFormError } = useFormSubmission()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!supportFormData.name.trim() || !supportFormData.email.trim() || !supportFormData.supportType || !supportFormData.message.trim()) {
      setFormError(t("errorRequired"))
      return
    }

    await submitForm({
      endpoint: '/api/submissions/support',
      payload: { ...supportFormData, language },
      connectionErrorMessage: t("errorConnection"),
      onSuccess: () => setSupportFormData({ name: "", email: "", supportType: "", message: "" }),
    })
  }

  return (
    <section id="supportArmath" className="py-24 bg-transparent">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">{t("supportTitle")}</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">{t("supportDescription")}</p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12">
          <AnimatedSection>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">{t("waysToSupport")}</h3>
              <div className="space-y-4">
                {[
                  { icon: BookOpen, text: t("hostWorkshop") },
                  { icon: Wrench, text: t("donateEquipment") },
                  { icon: DollarSign, text: t("financialSupport") },
                  { icon: UserCheck, text: t("mentoring") },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="w-12 h-12 bg-armath-blue/12 rounded-xl flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-armath-blue" />
                    </div>
                    <span className="text-slate-700">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <Card className="border-slate-200/80 bg-white/95 shadow-lg">
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
                      <h3 className="text-xl font-semibold text-slate-900">
                        {t("supportSubmitted")}
                      </h3>
                      <p className="text-slate-600 text-center">
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
                      noValidate
                    >
                      <div>
                        <label htmlFor="support-name" className="text-sm font-medium text-slate-700 block mb-1">{t("name")}</label>
                        <Input
                          id="support-name"
                          value={supportFormData.name}
                          onChange={(e) => setSupportFormData({ ...supportFormData, name: e.target.value })}
                          placeholder={t("yourName")}
                          className="focus:ring-armath-blue"
                          disabled={submitStatus === 'loading'}
                          required
                          autoComplete="name"
                        />
                      </div>

                      <div>
                        <label htmlFor="support-email" className="text-sm font-medium text-slate-700 block mb-1">{t("email")}</label>
                        <Input
                          id="support-email"
                          type="email"
                          value={supportFormData.email}
                          onChange={(e) => setSupportFormData({ ...supportFormData, email: e.target.value })}
                          placeholder={t("yourEmail")}
                          className="focus:ring-armath-blue"
                          disabled={submitStatus === 'loading'}
                          required
                          autoComplete="email"
                        />
                      </div>

                      <div>
                        <label id="support-type-label" className="text-sm font-medium text-slate-700 block mb-1">{t("supportType")}</label>
                        <Select 
                          value={supportFormData.supportType} 
                          onValueChange={(value) => setSupportFormData({ ...supportFormData, supportType: value })}
                          disabled={submitStatus === 'loading'}
                        >
                          <SelectTrigger className="focus:ring-armath-blue" aria-labelledby="support-type-label">
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
                        <label htmlFor="support-message" className="text-sm font-medium text-slate-700 block mb-1">{t("message")}</label>
                        <Textarea
                          id="support-message"
                          value={supportFormData.message}
                          onChange={(e) => setSupportFormData({ ...supportFormData, message: e.target.value })}
                          placeholder={t("yourMessage")}
                          className="focus:ring-armath-blue resize-none"
                          rows={4}
                          disabled={submitStatus === 'loading'}
                          required
                        />
                      </div>

                      {submitStatus === 'error' && errorMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                          role="alert"
                          aria-live="assertive"
                        >
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <p className="text-sm text-red-600">{errorMessage}</p>
                          <button 
                            type="button" 
                            onClick={resetSubmissionState}
                            className="ml-auto text-red-500 hover:text-red-700"
                            aria-label={t("close")}
                          >
                            ✕
                          </button>
                        </motion.div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-armath-blue hover:bg-armath-blue/90 shadow-md"
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
