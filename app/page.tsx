"use client"

import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { Header } from "@/components/Header"
import { HeroSection } from "@/components/sections/HeroSection"
import { EventsSection } from "@/components/sections/EventsSection"
import { ProjectsSection } from "@/components/sections/ProjectsSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { StructureSection } from "@/components/sections/StructureSection"
import { FieldsOfStudySection } from "@/components/sections/FieldsOfStudySection"
import { MaterialsSection } from "@/components/sections/MaterialsSection"
import { StudentsSection } from "@/components/sections/StudentsSection"
import { JoinSection } from "@/components/sections/JoinSection"
import { SupportSection } from "@/components/sections/SupportSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { FooterSection } from "@/components/sections/FooterSection"

export default function HomePage() {
  const { language } = useLanguage()

  return (
    <div className={cn("relative min-h-screen bg-background overflow-x-hidden", language === "hy" && "font-armenian")}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:p-4 focus:text-armath-teal">{language === "hy" ? "Անցնել բովանդակությանը" : "Skip to content"}</a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        <AboutSection />
        <StructureSection />
        <FieldsOfStudySection />
        <ProjectsSection />
        <EventsSection />
        <MaterialsSection />
        <StudentsSection />
        <JoinSection />
        <SupportSection />
        <ContactSection />
      </main>
      {/* Footer */}
      <FooterSection />
    </div>
  )
}
