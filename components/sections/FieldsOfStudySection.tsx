"use client"

import { AnimatedSection } from "@/components/animated-section"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import type { TranslationKey } from "@/lib/translations"
import { motion } from "framer-motion"
import { Bot, Code, Box, Boxes, Gamepad2, Scissors, Wrench, Zap } from "lucide-react"
import { useMemo } from "react"
import { cn } from "@/lib/utils"

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
        subtitle: t("modeling3d"),
        beginner: "FreeCAD",
        next: "Blender",
        icon: Box,
      },
    ],
  },
  {
    title: t("printing3d"),
    items: [
      {
        subtitle: t("printing3d"),
        beginner: "Slic3r, Printrun",
        next: "",
        icon: Boxes,
      },
    ],
  },
  {
    title: t("vectorGraphics"),
    items: [
      {
        subtitle: t("vectorGraphics"),
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
        subtitle: t("cncLaser"),
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
        subtitle: t("robotics"),
        beginner: "SERob Kit",
        next: t("customBuiltRobots"),
        icon: Bot,
      },
    ],
  },
]

export function FieldsOfStudySection() {
  const { t, language } = useLanguage()
  const fieldsOfStudy = useMemo(() => getFieldsOfStudy(t), [t])

  return (
    <section id="fieldsOfStudy" className="py-20 bg-white relative z-10">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-16">
          <h2 className={cn(
            "font-bold text-gray-900 mb-4",
            language === "hy" 
              ? "text-3xl sm:text-4xl" 
              : "text-4xl"
          )}>{t("fieldsOfStudy")}</h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fieldsOfStudy.map((field, index) => (
            <AnimatedSection key={`field-${index}`} animation="fadeInUp" delay={index * 0.1}>
              <Card className="hover:shadow-xl transition-all duration-500 hover:scale-105 group h-full">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-armath-blue transition-colors">
                    {field.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {field.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="space-y-2">
                      {item.subtitle && (
                        <div className="flex items-center space-x-2">
                          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                            <item.icon className="w-4 h-4 text-armath-red" />
                          </motion.div>
                          <h4 className="font-medium text-sm">{item.subtitle}</h4>
                        </div>
                      )}
                      <div className="text-sm text-gray-600 space-y-1">
                        {item.beginner && (
                          <div>
                            <Badge variant="outline" className="text-xs mr-2">
                              {t("beginner")}
                            </Badge>
                            {item.beginner}
                          </div>
                        )}
                        {item.next && (
                          <div>
                            <Badge variant="outline" className="text-xs mr-2">
                              {t("next")}
                            </Badge>
                            {item.next}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center mt-12">
          <Card className="bg-armath-blue/5 border-armath-blue/20">
            <CardContent className="p-6">
              <p className="text-gray-600 italic">{t("openToNew")}</p>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>
    </section>
  )
}
