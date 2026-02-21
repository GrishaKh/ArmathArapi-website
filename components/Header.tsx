"use client"

import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { TranslationKey } from "@/lib/translations"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { MagneticWrapper } from "@/components/magnetic-wrapper"

interface HeaderProps {
  subtitle?: string
  showNav?: boolean
}

const navItems: TranslationKey[] = [
  "aboutUs",
  "structure",
  "fieldsOfStudy",
  "learningMaterials",
  "events",
  "ourProjects",
  "supportArmath",
  "contact",
]

export function Header({ subtitle, showNav = true }: HeaderProps) {
  const { t, language } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 border-b border-slate-200/80 backdrop-blur-lg transition-all duration-200",
        isScrolled ? "bg-white/95 shadow-md" : "bg-white/85 shadow-sm"
      )}
    >
      <div
        className={cn(
          "container mx-auto px-4 flex items-center justify-between transition-all duration-200",
          isScrolled ? "py-3" : "py-4"
        )}
      >
        <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
          <div className="relative h-10 w-10 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm lg:hidden">
            <Image
              src="/logo.png"
              alt={t("armathArapi") + " " + t("logo")}
              fill
              className="object-contain p-1.5"
              sizes="48px"
              priority
            />
          </div>
          <div className="relative hidden h-12 w-[186px] lg:block">
            <Image
              src="/ArmathArapi_logo.png"
              alt={t("armathArapi") + " " + t("logo")}
              fill
              className="object-contain"
              sizes="186px"
              priority
            />
          </div>
          <div className="lg:hidden">
            <h1 className={cn("font-bold text-gray-900", language === "hy" ? "text-base tracking-tight" : "text-lg")}>
              {t("armathArapi")}
            </h1>
            <p className="text-[11px] text-slate-500">{subtitle || t("engineeringMakerspace")}</p>
          </div>
        </Link>

        {showNav ? (
          <>
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.a
                  key={item}
                  href={`/#${item}`}
                  className={cn(
                    "text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap rounded-lg px-2.5 py-1.5 hover:bg-slate-100",
                    language === "hy" ? "text-sm tracking-tight" : "text-base font-medium"
                  )}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 + 0.3 }}
                >
                  {t(item)}
                </motion.a>
              ))}
              <LanguageToggle />
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                <MagneticWrapper>
                  <Button
                    className="bg-armath-red hover:bg-armath-red/90 transition-transform"
                    onClick={() => document.getElementById("joinAsStudent")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    {t("joinAsStudent")}
                  </Button>
                </MagneticWrapper>
              </motion.div>
            </nav>
            <div className="lg:hidden flex items-center gap-2">
              <LanguageToggle />
              <Button
                variant="outline"
                className="border-slate-200 bg-white hover:bg-slate-50"
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
          <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-4">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`/#${item}`}
                  className={cn(
                    "block py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors",
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
