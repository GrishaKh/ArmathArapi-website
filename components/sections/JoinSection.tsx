"use client"

import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { Users, Calendar, Loader2, CheckCircle, XCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useFormSubmission } from "@/hooks/use-form-submission"

export function JoinSection() {
  const { t, language } = useLanguage()
  const [joinFormData, setJoinFormData] = useState({
    studentName: "",
    age: "",
    parentContact: "",
    interests: "",
  })
  const { submitStatus, errorMessage, submitForm, resetSubmissionState, setFormError } = useFormSubmission()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!joinFormData.studentName.trim()) {
      setFormError(t("errorRequired"))
      return
    }
    if (!joinFormData.age) {
      setFormError(t("errorSelectAge"))
      return
    }
    if (!joinFormData.parentContact.trim()) {
      setFormError(t("errorRequired"))
      return
    }

    await submitForm({
      endpoint: '/api/submissions/student',
      payload: { ...joinFormData, language },
      connectionErrorMessage: t("errorConnection"),
      onSuccess: () => setJoinFormData({ studentName: "", age: "", parentContact: "", interests: "" }),
    })
  }

  return (
    <section id="joinAsStudent" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-armath-blue/5 via-slate-50/80 to-armath-red/5 -z-10" />
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">{t("joinTitle")}</h2>
              <p className="text-slate-600 mb-6 text-lg leading-relaxed">{t("joinDescription")}</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3 rounded-2xl border border-slate-200/80 bg-white/85 p-3 shadow-sm">
                  <div className="w-8 h-8 bg-armath-blue/15 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-armath-blue" />
                  </div>
                  <span className="text-slate-700">{t("joinInfo")}</span>
                </div>
                <div className="flex items-center space-x-3 rounded-2xl border border-slate-200/80 bg-white/85 p-3 shadow-sm">
                  <div className="w-8 h-8 bg-armath-red/15 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-armath-red" />
                  </div>
                  <span className="text-slate-700">{t("classFrequency")}</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <Card className="border-slate-200/80 bg-white/95 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-slate-900">{t("applyNow")}</CardTitle>
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
                        {t("applicationSubmitted")}
                      </h3>
                      <p className="text-slate-600 text-center">
                        {t("applicationThankYou")}
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
                        <label htmlFor="join-student-name" className="text-sm font-medium text-slate-700 block mb-1">{t("studentName")}</label>
                        <Input
                          id="join-student-name"
                          value={joinFormData.studentName}
                          onChange={(e) => setJoinFormData({ ...joinFormData, studentName: e.target.value })}
                          placeholder={t("studentNamePlaceholder")}
                          className="focus:ring-armath-blue"
                          disabled={submitStatus === 'loading'}
                          required
                          autoComplete="name"
                        />
                      </div>

                      <div>
                        <label id="join-age-label" className="text-sm font-medium text-slate-700 block mb-1">{t("age")}</label>
                        <Select 
                          value={joinFormData.age} 
                          onValueChange={(value) => setJoinFormData({ ...joinFormData, age: value })}
                          disabled={submitStatus === 'loading'}
                        >
                          <SelectTrigger className="focus:ring-armath-blue" aria-labelledby="join-age-label">
                            <SelectValue placeholder={t("selectAgePlaceholder")} />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 8 }, (_, i) => i + 10).map((age) => (
                              <SelectItem key={age} value={age.toString()}>
                                {age} {t("yearsOld")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label htmlFor="join-parent-contact" className="text-sm font-medium text-slate-700 block mb-1">{t("parentContact")}</label>
                        <Input
                          id="join-parent-contact"
                          value={joinFormData.parentContact}
                          onChange={(e) => setJoinFormData({ ...joinFormData, parentContact: e.target.value })}
                          placeholder={t("parentContactPlaceholder")}
                          className="focus:ring-armath-blue"
                          disabled={submitStatus === 'loading'}
                          required
                          autoComplete="tel"
                        />
                      </div>

                      <div>
                        <label htmlFor="join-interests" className="text-sm font-medium text-slate-700 block mb-1">{t("interests")}</label>
                        <Textarea
                          id="join-interests"
                          value={joinFormData.interests}
                          onChange={(e) => setJoinFormData({ ...joinFormData, interests: e.target.value })}
                          placeholder={t("interestsPlaceholder")}
                          className="focus:ring-armath-blue resize-none"
                          rows={3}
                          disabled={submitStatus === 'loading'}
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
                        className="w-full bg-armath-red hover:bg-armath-red/90 shadow-md"
                        disabled={submitStatus === 'loading'}
                      >
                        {submitStatus === 'loading' ? (
                          <span className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{t("submitting")}</span>
                          </span>
                        ) : (
                          t("applyNow")
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
