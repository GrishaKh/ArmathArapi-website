"use client"

import Image from "next/image"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const { t, language } = useLanguage()

  return (
    <section className="relative overflow-hidden py-12 md:py-20">
      <div className="container mx-auto grid items-center gap-10 px-4 lg:grid-cols-2 lg:gap-14">
        <div className="min-w-0">
          <Badge className="mb-5 bg-armath-blue/10 text-armath-teal hover:bg-armath-blue/15">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
            {t("heroBadge")}
          </Badge>

          <h1 className={cn(
            "mb-6 max-w-xl font-bold leading-tight text-slate-900",
            language === "hy"
              ? "text-4xl tracking-tight sm:text-5xl xl:text-6xl"
              : "text-4xl tracking-tighter sm:text-5xl xl:text-6xl"
          )}>
            {t("armathArapi")}
            <span className="block text-armath-red">{t("engineeringMakerspace")}</span>
          </h1>

          <p className={cn(
            "mb-8 max-w-xl leading-relaxed text-slate-600",
            language === "hy" ? "text-lg tracking-tight" : "text-xl"
          )}>
            {t("heroSubtitle")}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full bg-armath-red px-8 text-white hover:bg-armath-red/90">
              <Link href="/#joinAsStudent">{t("applyNow")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-armath-teal/30 px-8 text-armath-teal hover:bg-armath-blue/10">
              <Link href="/#ourProjects">{t("ourProjects")}</Link>
            </Button>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
            <div>
              <dt className="text-sm text-slate-600">{t("ageGroup")}</dt>
              <dd className="mt-1 font-semibold text-slate-900">10–17 {t("yearsOld")}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-600">{t("participation")}</dt>
              <dd className="mt-1 font-semibold text-slate-900">{t("freeClasses")}</dd>
            </div>
            <div>
              <dt className="text-sm text-slate-600">{t("schedule")}</dt>
              <dd className="mt-1 font-semibold text-slate-900">{t("twiceWeekly")}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">{t("joinInfo")}</p>
        </div>

        <figure className="min-w-0">
          <Link href="/events/first-robotics-2025" className="block overflow-hidden rounded-2xl">
            <Image
              src="/events/first-robotics.jpg"
              alt={t("heroPhotoAlt")}
              width={2048}
              height={1152}
              sizes="(min-width: 1400px) 650px, (min-width: 1024px) 50vw, 100vw"
              priority
              className="h-auto w-full"
            />
          </Link>
          <figcaption className="mt-3 text-sm leading-relaxed text-slate-600">{t("heroPhotoCaption")}</figcaption>
        </figure>
      </div>
    </section>
  )
}
