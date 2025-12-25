"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { LanguageToggle } from "@/components/language-toggle"
import { motion } from "motion/react"

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-red-50 relative">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      <div className="text-center px-4">
        <motion.h1
          className="text-6xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.h1>
        <motion.h2
          className="text-2xl font-semibold text-gray-700 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t("pageNotFound")}
        </motion.h2>
        <motion.p
          className="text-gray-600 mb-8 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t("pageNotFoundMessage")}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-armath-red text-white font-medium rounded-lg hover:bg-armath-red/90 transition-colors shadow-lg hover:shadow-xl"
          >
            {t("goHome")}
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
