"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center space-x-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      <Button
        variant={language === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("en")}
        className={`text-xs px-3 py-1 ${
          language === "en" ? "bg-armath-blue text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
        }`}
      >
        EN
      </Button>
      <Button
        variant={language === "hy" ? "default" : "ghost"}
        size="sm"
        onClick={() => setLanguage("hy")}
        className={`text-xs px-3 py-1 ${
          language === "hy" ? "bg-armath-blue text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
        }`}
      >
        ՀՅ
      </Button>
    </div>
  )
}
