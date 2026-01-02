"use client"

import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import { MultimeterWire } from "@/components/multimeter-wire"
import { Mail, MapPin, Phone, Loader2, CheckCircle, XCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

export function ContactSection() {
  const { t, language } = useLanguage()
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!contactFormData.name.trim() || !contactFormData.email.trim() || !contactFormData.message.trim()) {
      setErrorMessage(t("errorRequired"))
      setSubmitStatus('error')
      return
    }

    setSubmitStatus('loading')
    setErrorMessage("")

    try {
      const response = await fetch('/api/submissions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contactFormData,
          language,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitStatus('success')
        setTimeout(() => {
          setContactFormData({ name: "", email: "", message: "" })
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
                      value: t("fullAddress"),
                    },
                    {
                      icon: Phone,
                      label: t("phone"),
                      value: "+374 77 44 18 40",
                    },
                    {
                      icon: Mail,
                      label: t("email"),
                      value: "grisha.khachatrian@gmail.com",
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
                    {t("contactHint")}
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
                        {t("messageSubmitted")}
                      </h3>
                      <p className="text-gray-600 text-center">
                        {t("messageThankYou")}
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
                          value={contactFormData.name}
                          onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                          placeholder={t("yourName")} 
                          className="focus:ring-armath-blue transition-all duration-300 hover:border-armath-blue/50" 
                          disabled={submitStatus === 'loading'}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">{t("email")}</label>
                        <Input 
                          type="email" 
                          value={contactFormData.email}
                          onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                          placeholder={t("yourEmail")} 
                          className="focus:ring-armath-blue transition-all duration-300 hover:border-armath-blue/50" 
                          disabled={submitStatus === 'loading'}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">{t("message")}</label>
                        <Textarea 
                          value={contactFormData.message}
                          onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
                          placeholder={t("yourMessage")} 
                          className="focus:ring-armath-blue transition-all duration-300 hover:border-armath-blue/50 resize-none" 
                          rows={5} 
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
                        <button 
                          type="submit"
                          className="w-full bg-armath-red hover:bg-armath-red/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-md text-white py-2 text-sm font-medium disabled:opacity-50"
                          disabled={submitStatus === 'loading'}
                        >
                          {submitStatus === 'loading' ? (
                            <span className="flex items-center justify-center space-x-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>{t("sending")}</span>
                            </span>
                          ) : (
                            t("send")
                          )}
                        </button>
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
