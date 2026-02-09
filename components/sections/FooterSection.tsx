import { AnimatedSection } from "@/components/animated-section"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"
import { Cog } from "lucide-react"
import { motion } from "framer-motion"
import type { TranslationKey } from "@/lib/translations"

export function FooterSection() {
  const { t } = useLanguage()
  return (
    <motion.footer
      className="border-t border-slate-200/70 bg-[#0f1624] text-white py-14"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <AnimatedSection animation="fadeInUp">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-armath-blue/90 flex items-center justify-center shadow-md">
                <Cog className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold">{t("armathArapi")}</h3>
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
              links: ["aboutUs", "structure", "fieldsOfStudy", "events"] as TranslationKey[],
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
