"use client"

import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/language-toggle"
import { AnimatedSection } from "@/components/animated-section"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import { useMemo } from "react"
import { cn } from "@/lib/utils" // Import cn utility
import type { TranslationKey } from "@/lib/translations"
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
import {
  Wrench,
  Cpu,
  Zap,
  Users,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Lightbulb,
  Cog,
  Eye,
  Target,
  Code,
  Gamepad2,
  Printer,
  Scissors,
  Bot,
  Award,
  ExternalLink,
  Heart,
  DollarSign,
  BookOpen,
  UserCheck,
} from "lucide-react"

// Move these arrays outside the component to prevent recreation on re-renders
const getFieldsOfStudy = (t: (key: TranslationKey) => string) => [
  {
    title: t("programmingBasics"),
    items: [
      {
        subtitle: t("visualProgramming"),
        beginner: "Aghves, Scratch",
        next: "MIT App Inventor, Blockly, Snap",
        icon: Gamepad2,
      },
      {
        subtitle: t("textBasedProgramming"),
        beginner: "Kria (Kturtle)",
        next: "C, C++, Python, Bash, JavaScript",
        icon: Code,
      },
    ],
  },
  {
    title: t("electronicsEmbedded"),
    items: [
      {
        subtitle: t("electronicsBasics"),
        beginner: "Arduino, Raspberry Pi",
        next: "ESP, STM32",
        icon: Zap,
      },
    ],
  },
  {
    title: t("modeling3d"),
    items: [
      {
        subtitle: "",
        beginner: "FreeCAD",
        next: "Blender",
        icon: Cpu,
      },
    ],
  },
  {
    title: t("printing3d"),
    items: [
      {
        subtitle: "",
        beginner: "Slic3r, Printrun",
        next: "",
        icon: Printer,
      },
    ],
  },
  {
    title: t("vectorGraphics"),
    items: [
      {
        subtitle: "",
        beginner: "Inkscape",
        next: "",
        icon: Scissors,
      },
    ],
  },
  {
    title: t("cncLaser"),
    items: [
      {
        subtitle: "",
        beginner: "HeeksCAD, bCNC",
        next: "",
        icon: Wrench,
      },
    ],
  },
  {
    title: t("robotics"),
    items: [
      {
        subtitle: "",
        beginner: "SERob Kit",
        next: "Custom-built robots",
        icon: Bot,
      },
    ],
  },
]

const events = [
  {
    title: "DigiCode 2025",
    date: "2025",
    description: "Intensive STEM learning experience in the mountains",
    image: "/placeholder.svg?height=200&width=300&text=Engineering+Camp",
  },
  {
    title: "ArmRobotics 2022",
    date: "2022",
    description: "Our students won multiple awards in national competition",
    image: "/placeholder.svg?height=200&width=300&text=Robotics+Competition",
  },
  {
    title: "DigiCamp",
    date: "2022",
    description: "Intensive STEM learning experience in the mountains",
    image: "/placeholder.svg?height=200&width=300&text=Engineering+Camp",
  },
]

const projects = [
  {
    title: "Line-following Robot",
    description: "Autonomous robot that follows a predetermined path using IR sensors",
    tools: ["Arduino", "IR Sensors", "C++"],
    image: "/placeholder.svg?height=200&width=300&text=Line+Following+Robot",
    link: "#",
  },
  {
    title: "3D-printed Prosthetic Hand",
    description: "Functional prosthetic hand designed and printed for community member",
    tools: ["FreeCAD", "3D Printer", "Arduino"],
    image: "/placeholder.svg?height=200&width=300&text=Prosthetic+Hand",
    link: "#",
  },
  {
    title: "Smart Light with Blynk + ESP32",
    description: "IoT-enabled lighting system controlled via smartphone app",
    tools: ["ESP32", "Blynk", "C++", "Mobile App"],
    image: "/placeholder.svg?height=200&width=300&text=Smart+Light",
    link: "#",
  },
]

export default function HomePage() {
  const { t, language } = useLanguage()
  // Inside the component, replace the fieldsOfStudy definition with:
  const fieldsOfStudy = useMemo(() => getFieldsOfStudy(t), [t])

  return (
    <div className={cn("min-h-screen bg-background", language === "hy" && "font-armenian")}>
      {" "}
      {/* Apply font conditionally */}
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="w-8 h-8 bg-armath-blue rounded-lg flex items-center justify-center"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Cog className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{language === "hy" ? "Արմաթ Առափի" : "Armath Arapi"}</h1>
              <p className="text-sm text-gray-600">
                {language === "hy" ? "Ճարտարագիտական աշխատանոց" : "Engineering Makerspace"}
              </p>
            </div>
          </motion.div>
          <nav className="hidden lg:flex items-center space-x-4">
            {(([
              "aboutUs",
              "structure",
              "fieldsOfStudy",
              "events",
              "ourProjects",
              "joinAsStudent",
              "supportArmath",
              "contact",
            ] as TranslationKey[])).map((item, index) => (
              <motion.a
                key={item}
                href={`#${item}`}
                className="text-gray-600 hover:text-gray-900 transition-colors relative text-sm"
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
                <Button className="bg-armath-red hover:bg-armath-red/90 transform hover:scale-105 transition-all duration-200">
                  {t("joinAsStudent")}
                </Button>
              </motion.div>
            </motion.div>
          </nav>
        </div>
      </motion.header>
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
