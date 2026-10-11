"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/contexts/language-context"

interface HeaderProps { subtitle?: string; showNav?: boolean }

export function Header({ subtitle, showNav = true }: HeaderProps) {
  const { t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const mobileMenu = useRef<HTMLElement>(null)
  const links = [
    { href: "/#aboutUs", label: t("aboutUs") },
    { href: "/#structure", label: t("structure") },
    { href: "/#fieldsOfStudy", label: t("fieldsOfStudy") },
    { href: "/#ourProjects", label: t("ourProjects") },
    { href: "/#contact", label: t("contact") },
  ]

  useEffect(() => {
    if (!mobileOpen) return
    mobileMenu.current?.querySelector<HTMLAnchorElement>("a")?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener("keydown", closeOnEscape)
    const desktop = window.matchMedia("(min-width: 1280px)")
    const closeOnDesktop = () => { if (desktop.matches) setMobileOpen(false) }
    desktop.addEventListener("change", closeOnDesktop)
    return () => {
      document.removeEventListener("keydown", closeOnEscape)
      desktop.removeEventListener("change", closeOnDesktop)
    }
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-lg">
      <div className="container mx-auto flex min-h-20 items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image src="/logo.png" alt="" width={44} height={44} className="shrink-0 xl:hidden" priority />
          <div className="relative hidden h-12 w-[186px] shrink-0 xl:block">
            <Image src="/ArmathArapi_logo.png" alt={`${t("armathArapi")} — ${t("engineeringMakerspace")}`}
              fill sizes="186px" className="object-contain" priority />
          </div>
          <div className="min-w-0 xl:hidden">
            <span className="block truncate text-base font-bold text-slate-900 sm:text-lg">{t("armathArapi")}</span>
            <span className="hidden text-xs text-slate-600 sm:block">{subtitle || t("engineeringMakerspace")}</span>
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-2 xl:gap-5">
          {showNav && (
            <nav aria-label={t("mainNavigation")} className="hidden items-center gap-4 xl:flex">
              {links.map(link => <Link key={link.href} href={link.href} className="py-3 text-sm font-medium text-slate-700 hover:text-armath-teal">{link.label}</Link>)}
              <Link href="/student/login" className="py-3 text-sm font-semibold text-armath-teal">{t("studentLogin")}</Link>
            </nav>
          )}
          <LanguageToggle />
          {showNav && <>
            <Button asChild className="hidden bg-armath-red text-white hover:bg-armath-red/90 xl:inline-flex">
              <Link href="/#joinAsStudent">{t("applyNow")}</Link>
            </Button>
            <Button ref={menuButton} variant="outline" size="icon" className="h-11 w-11 xl:hidden"
              aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
              aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </Button>
          </>}
        </div>
      </div>
      {showNav && mobileOpen && (
        <nav ref={mobileMenu} id="mobile-navigation" aria-label={t("mainNavigation")} className="container mx-auto grid gap-1 border-t border-slate-200 px-4 py-4 xl:hidden">
          {[...links, { href: "/materials", label: t("learningMaterials") }, { href: "/tutorials/marked-graphs", label: t("interactiveLab") }, { href: "/student/login", label: t("studentLogin") }].map(link => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-3 text-slate-700 hover:bg-slate-100" onClick={() => setMobileOpen(false)}>{link.label}</Link>
          ))}
          <Button asChild className="mt-2 bg-armath-red text-white hover:bg-armath-red/90">
            <Link href="/#joinAsStudent" onClick={() => setMobileOpen(false)}>{t("applyNow")}</Link>
          </Button>
        </nav>
      )}
    </header>
  )
}
