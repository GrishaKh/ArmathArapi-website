"use client"

import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/contexts/language-context"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import type { TranslationKey } from "@/lib/translations"
import Image from "next/image"
import Link from "next/link"
import { Menu, X, ArrowRight } from "lucide-react"

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
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-surface-elevated/80 backdrop-blur-xl shadow-[0_1px_3px_0_rgb(0_0_0/0.05),0_1px_2px_-1px_rgb(0_0_0/0.05)] border-b border-border"
          : "bg-transparent"
      )}
    >
      <div
        className={cn(
          "container mx-auto px-4 flex items-center justify-between transition-all duration-300",
          isScrolled ? "py-2.5" : "py-4"
        )}
      >
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="relative h-9 w-9 rounded-xl overflow-hidden bg-card shadow-sm xl:hidden">
            <Image
              src="/logo.png"
              alt={t("armathArapi") + " " + t("logo")}
              fill
              className="object-contain p-1"
              sizes="36px"
              priority
            />
          </div>
          <div className="relative hidden h-11 w-[170px] xl:block">
            <Image
              src="/ArmathArapi_logo.png"
              alt={t("armathArapi") + " " + t("logo")}
              fill
              className="object-contain"
              sizes="170px"
              priority
            />
          </div>
          <div className="xl:hidden">
            <h1 className={cn("font-semibold text-foreground", language === "hy" ? "text-sm tracking-tight" : "text-base")}>
              {t("armathArapi")}
            </h1>
            <p className="text-[10px] text-muted-foreground">{subtitle || t("engineeringMakerspace")}</p>
          </div>
        </Link>

        {showNav ? (
          <>
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item, index) => (
                <motion.a
                  key={item}
                  href={`/#${item}`}
                  className={cn(
                    "relative px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors whitespace-nowrap",
                    language === "hy" ? "text-[13px] tracking-normal" : "text-[13px] font-medium"
                  )}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 + 0.2 }}
                >
                  {t(item)}
                </motion.a>
              ))}
              <div className="ml-2">
                <LanguageToggle />
              </div>
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="ml-2">
                <Button
                  size="sm"
                  className="rounded-full bg-armath-red text-white hover:bg-armath-red/90 shadow-sm px-5 font-medium"
                  onClick={() => document.getElementById("joinAsStudent")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {t("joinAsStudent")}
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </motion.div>
            </nav>
            <div className="xl:hidden flex items-center gap-2">
              <LanguageToggle />
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground"
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

      <AnimatePresence>
        {showNav && mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="xl:hidden overflow-hidden border-t border-border bg-surface-elevated/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <a
                    key={item}
                    href={`/#${item}`}
                    className={cn(
                      "block py-2.5 px-4 rounded-lg text-foreground hover:bg-secondary transition-colors",
                      language === "hy" ? "text-sm tracking-tight" : "text-sm font-medium"
                    )}
                    onClick={() => setMobileOpen(false)}
                  >
                    {t(item)}
                  </a>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Button
                  className="w-full bg-armath-red hover:bg-armath-red/90 text-white"
                  onClick={() => {
                    document.getElementById("joinAsStudent")?.scrollIntoView({ behavior: "smooth" })
                    setMobileOpen(false)
                  }}
                >
                  {t("joinAsStudent")}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
