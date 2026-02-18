import { AnimatedSection } from "@/components/animated-section"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"
import { motion } from "framer-motion"
import type { TranslationKey } from "@/lib/translations"
import Image from "next/image"

export function FooterSection() {
  const { t } = useLanguage()
  return (
    <motion.footer
      className="bg-armath-black text-white pt-16 pb-14 relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-armath-blue/30 to-transparent" />
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <AnimatedSection animation="fadeInUp">
            <div className="mb-4">
              <div className="relative h-14 w-full max-w-[260px]">
                <Image
                  src="/ArmathArapi_logo.png"
                  alt={t("armathArapi") + " " + t("logo")}
                  fill
                  className="object-contain"
                  sizes="260px"
                />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-white/20 bg-white/10 p-1">
                  <Image src="/logo.png" alt={t("logo")} fill className="object-contain" sizes="32px" />
                </div>
                <p className="text-sm text-slate-400">{t("engineeringLab")}</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t("footerDescription")}
            </p>
          </AnimatedSection>

          {[
            {
              title: t("quickLinks"),
              links: ["aboutUs", "structure", "fieldsOfStudy", "learningMaterials", "events"] as TranslationKey[],
            },
            {
              title: t("programs"),
              links: ["ourProjects", "joinAsStudent", "supportArmath"] as TranslationKey[],
            },
            {
              title: t("connect"),
              links: [] as TranslationKey[],
            },
          ].map((section, index) => (
            <AnimatedSection key={section.title} animation="fadeInUp" delay={index * 0.1}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              {section.links.length > 0 ? (
                <ul className="space-y-2 text-sm text-slate-400">
                  {section.links.map((link, linkIndex) => (
                    <motion.li key={link} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: linkIndex * 0.1 }}>
                      <a href={`#${link}`} className="hover:text-white transition-colors">
                        {t(link)}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>{t("address")}</li>
                  <li>+374 77 44 18 40</li>
                  <li>grisha.khachatrian@gmail.com</li>
                </ul>
              )}
            </AnimatedSection>
          ))}
        </div>

        <Separator className="my-8 bg-slate-700/70" />

        <AnimatedSection animation="fadeInUp" delay={0.5}>
          <div className="text-center text-sm text-slate-400">
            <p>
              © 2025 {t("footerRights")}
            </p>
          </div>
        </AnimatedSection>
      </div>
    </motion.footer>
  )
}
