"use client"

import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/contexts/language-context"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import type { TranslationKey } from "@/lib/translations"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown, Menu, X } from "lucide-react"

interface HeaderProps {
  subtitle?: string
  showNav?: boolean
}

const primaryNavItems: TranslationKey[] = [
  "aboutUs",
  "structure",
  "fieldsOfStudy",
  "learningMaterials",
  "events",
  "ourProjects",
]

const secondaryNavItems: TranslationKey[] = [
  "joinAsStudent",
  "supportArmath",
  "contact",
]

export function Header({ subtitle, showNav = true }: HeaderProps) {
  const { t, language } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!moreOpen) return

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null
      if (!target || !moreRef.current) return
      if (!moreRef.current.contains(target)) {
        setMoreOpen(false)
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false)
    }

    window.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [moreOpen])

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
          <motion.div
            className="relative h-10 w-10 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm lg:hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
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
          <motion.div
            className="relative hidden h-12 w-[186px] lg:block"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src="/ArmathArapi_logo.png"
              alt={t("armathArapi") + " " + t("logo")}
              fill
              className="object-contain"
              sizes="186px"
              priority
            />
          </motion.div>
          <div className="lg:hidden">
            <h1 className={cn("font-bold text-gray-900", language === "hy" ? "text-base tracking-tight" : "text-lg")}>
              {t("armathArapi")}
            </h1>
            <p className="text-[11px] text-slate-500">{subtitle || t("engineeringMakerspace")}</p>
          </div>
        </Link>

        {showNav ? (
          <>
            <nav className="hidden lg:flex items-center space-x-4">
              {primaryNavItems.map((item, index) => (
                <motion.a
                  key={item}
                  href={`/#${item}`}
                  className={cn(
                    "text-slate-600 hover:text-slate-900 transition-colors relative whitespace-nowrap py-1",
                    language === "hy" ? "text-xs tracking-tight" : "text-sm"
                  )}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  whileHover={{ y: -1 }}
                >
                  {t(item)}
                  <motion.div
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-armath-blue"
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
              <div className="relative" ref={moreRef}>
                <motion.button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={moreOpen}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3 py-1 text-slate-600 hover:text-slate-900 transition-colors",
                    language === "hy" ? "text-xs tracking-tight" : "text-sm"
                  )}
                  onClick={() => setMoreOpen((open) => !open)}
                  whileHover={{ y: -2 }}
                >
                  {t("more")}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      moreOpen && "rotate-180"
                    )}
                  />
                </motion.button>
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      role="menu"
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white shadow-lg p-2 z-50"
                    >
                      {secondaryNavItems.map((item) => (
                        <a
                          key={item}
                          role="menuitem"
                          href={`/#${item}`}
                          className={cn(
                            "block rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors",
                            language === "hy" ? "text-sm tracking-tight" : "text-sm"
                          )}
                          onClick={() => setMoreOpen(false)}
                        >
                          {t(item)}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <LanguageToggle />
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className="bg-armath-red hover:bg-armath-red/90 shadow-md hover:shadow-lg"
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
              {[...primaryNavItems, ...secondaryNavItems].map((item) => (
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
