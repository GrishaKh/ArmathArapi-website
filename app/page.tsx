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
import { JoinSection } from "@/components/sections/JoinSection"
import { SupportSection } from "@/components/sections/SupportSection"
import { ContactSection } from "@/components/sections/ContactSection"
import { FooterSection } from "@/components/sections/FooterSection"

export default function HomePage() {
  const { language } = useLanguage()

  return (
    <div className={cn("relative min-h-screen bg-background overflow-x-hidden", language === "hy" && "font-armenian")}>
      <Header />
      {/* Hero Section */}
      <HeroSection />
      {/* About Us Section */}
      <AboutSection />
      {/* Structure Section */}
      <StructureSection />
      {/* Fields of Study Section */}
      <FieldsOfStudySection />
      {/* Events Section */}
      <EventsSection />
      {/* Projects Section */}
      <ProjectsSection />
      {/* Join Section */}
      <JoinSection />
      {/* Support Section */}
      <SupportSection />
      {/* Contact Section */}
      <ContactSection />
      {/* Footer */}
      <FooterSection />
    </div>
  )
}
