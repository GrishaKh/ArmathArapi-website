"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center space-x-2 text-sm font-medium text-slate-600">
      <button
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        lang="en"
        className={cn(
          "min-h-11 px-1 transition-colors hover:text-slate-900",
          language === "en" ? "text-slate-900" : "text-slate-600"
        )}
      >
        EN
      </button>
      <span className="select-none">|</span>
      <button
        onClick={() => setLanguage("hy")}
        aria-pressed={language === "hy"}
        lang="hy"
        className={cn(
          "min-h-11 px-1 transition-colors hover:text-slate-900",
          language === "hy" ? "text-slate-900" : "text-slate-600"
        )}
      >
        ՀՅ
      </button>
    </div>
  )
}
