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

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

export function JoinSection() {
  const { t, language } = useLanguage()
  const [joinFormData, setJoinFormData] = useState({
    studentName: "",
    age: "",
    parentContact: "",
    interests: "",
  })
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!joinFormData.studentName.trim()) {
      setErrorMessage(t("errorRequired"))
      setSubmitStatus('error')
      return
    }
    if (!joinFormData.age) {
      setErrorMessage(t("errorSelectAge"))
      setSubmitStatus('error')
      return
    }
    if (!joinFormData.parentContact.trim()) {
      setErrorMessage(t("errorRequired"))
      setSubmitStatus('error')
      return
    }

    setSubmitStatus('loading')
    setErrorMessage("")

    try {
      const response = await fetch('/api/submissions/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...joinFormData,
          language,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitStatus('success')
        // Reset form after 3 seconds
        setTimeout(() => {
          setJoinFormData({ studentName: "", age: "", parentContact: "", interests: "" })
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
                        {t("applicationSubmitted")}
                      </h3>
                      <p className="text-gray-600 text-center">
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
                    >
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">{t("studentName")}</label>
                        <Input
                          value={joinFormData.studentName}
                          onChange={(e) => setJoinFormData({ ...joinFormData, studentName: e.target.value })}
                          placeholder={t("studentNamePlaceholder")}
                          className="focus:ring-armath-blue"
                          disabled={submitStatus === 'loading'}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">{t("age")}</label>
                        <Select 
                          value={joinFormData.age} 
                          onValueChange={(value) => setJoinFormData({ ...joinFormData, age: value })}
                          disabled={submitStatus === 'loading'}
                        >
                          <SelectTrigger className="focus:ring-armath-blue">
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
                        <label className="text-sm font-medium text-gray-700 block mb-1">{t("parentContact")}</label>
                        <Input
                          value={joinFormData.parentContact}
                          onChange={(e) => setJoinFormData({ ...joinFormData, parentContact: e.target.value })}
                          placeholder={t("parentContactPlaceholder")}
                          className="focus:ring-armath-blue"
                          disabled={submitStatus === 'loading'}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">{t("interests")}</label>
                        <Textarea
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
                          className="w-full bg-armath-red hover:bg-armath-red/90 shadow-lg hover:shadow-xl transition-all duration-300"
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
