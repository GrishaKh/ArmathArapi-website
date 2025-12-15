import { AnimatedSection } from "@/components/animated-section"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"
import { Cog } from "lucide-react"
import { motion } from "framer-motion"
import type { TranslationKey } from "@/lib/translations"

export function FooterSection() {
  const { t } = useLanguage()
  return (
    <motion.footer className="bg-armath-black text-white py-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <AnimatedSection animation="fadeInUp">
            <div className="flex items-center space-x-2 mb-4">
              <motion.div className="w-8 h-8 bg-armath-blue rounded-lg flex items-center justify-center" whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                <Cog className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 className="font-bold">{t("armathArapi")}</h3>
                <p className="text-sm text-gray-400">{t("engineeringLab")}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
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
                <ul className="space-y-2 text-sm text-gray-400">
                  {section.links.map((link, linkIndex) => (
                    <motion.li key={link} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: linkIndex * 0.1 }}>
                      <motion.a href={`#${link}`} className="hover:text-white transition-colors" whileHover={{ x: 5 }}>
                        {t(link)}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>{t("address")}</li>
                  <li>+374 77 44 18 40</li>
                  <li>info@armath-arapi.am</li>
                </ul>
              )}
            </AnimatedSection>
          ))}
        </div>

        <Separator className="my-8 bg-gray-800" />

        <AnimatedSection animation="fadeInUp" delay={0.5}>
          <div className="text-center text-sm text-gray-400">
            <p>
              © 2025 {t("footerRights")}
            </p>
          </div>
        </AnimatedSection>
      </div>
    </motion.footer>
  )
}
