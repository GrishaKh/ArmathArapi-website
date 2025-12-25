"use client"

import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { TranslationKey } from "@/lib/translations"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"

interface HeaderProps {
  subtitle?: string
  showNav?: boolean
}

const navItems: TranslationKey[] = [
  "aboutUs",
  "structure",
  "fieldsOfStudy",
  "events",
  "ourProjects",
  "joinAsStudent",
  "supportArmath",
  "contact",
]

export function Header({ subtitle, showNav = true }: HeaderProps) {
  const { t, language } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b bg-white/30 backdrop-blur-xl supports-[backdrop-filter]:bg-white/20"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <motion.div
            className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-xl overflow-hidden border border-armath-blue/20 bg-white shadow-sm"
            whileHover={{ rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="/logo.png"
              alt={t("armathArapi") + " " + t("logo")}
              fill
              className="object-contain p-1.5"
              sizes="48px"
              priority
            />
          </motion.div>
          <div>
            <h1 className={cn("font-bold text-gray-900", language === "hy" ? "text-lg tracking-tight" : "text-xl")}>
              {t("armathArapi")}
            </h1>
            <p className="text-sm text-gray-600">{subtitle || t("engineeringMakerspace")}</p>
          </div>
        </Link>

        {showNav ? (
          <>
            <nav className="hidden lg:flex items-center space-x-4">
              {navItems.map((item, index) => (
                <motion.a
                  key={item}
                  href={`/#${item}`}
                  className={cn(
                    "text-gray-600 hover:text-gray-900 transition-colors relative",
                    language === "hy" ? "text-xs tracking-tight" : "text-sm"
                  )}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  {t(item)}
                  <motion.div
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-armath-blue"
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
              <LanguageToggle />
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className="bg-armath-red hover:bg-armath-red/90 transform hover:scale-105 transition-all duration-200"
                    onClick={() => document.getElementById("joinAsStudent")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    {t("joinAsStudent")}
                  </Button>
                </motion.div>
              </motion.div>
            </nav>
            <div className="lg:hidden flex items-center gap-2">
              <LanguageToggle />
              <Button
                variant="outline"
                className="border-white/30 bg-white/30 backdrop-blur-md hover:bg-white/40"
                size="icon"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((o) => !o)}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </>
        ) : (
          <LanguageToggle />
        )}
      </div>

      {showNav && mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="lg:hidden container mx-auto px-4 pb-4"
        >
          <div className="rounded-2xl border border-white/30 bg-white/30 backdrop-blur-xl shadow-lg p-4">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`/#${item}`}
                  className={cn(
                    "block py-2 px-3 rounded-lg text-gray-800 hover:bg-white/40 transition-colors",
                    language === "hy" ? "text-sm tracking-tight" : "text-base"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {t(item)}
                </a>
              ))}
            </div>
            <div className="mt-3">
              <Button
                className="w-full bg-armath-red hover:bg-armath-red/90"
                onClick={() => {
                  document.getElementById("joinAsStudent")?.scrollIntoView({ behavior: "smooth" })
                  setMobileOpen(false)
                }}
              >
                {t("joinAsStudent")}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
