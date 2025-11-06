import { AnimatedSection } from "@/components/animated-section"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"
import { Cog } from "lucide-react"
import { motion } from "framer-motion"
import type { TranslationKey } from "@/lib/translations"

export function FooterSection() {
  const { t, language } = useLanguage()
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
                <h3 className="font-bold">{language === "hy" ? "Արմաթ Առափի" : "Armath Arapi"}</h3>
                <p className="text-sm text-gray-400">{language === "hy" ? "Ճարտարագիտական լաբորատորիա" : "Engineering Lab"}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              {language === "hy" ? "Կերտելով Առափիի ճարտարագետների և ստեղծագործների հաջորդ սերունդը:" : "Empowering the next generation of engineers and makers in Arapi."}
            </p>
          </AnimatedSection>

          {[
            {
              title: language === "hy" ? "Արագ հղումներ" : "Quick Links",
              links: ["aboutUs", "structure", "fieldsOfStudy", "events"] as TranslationKey[],
            },
            {
              title: language === "hy" ? "Ծրագրեր" : "Programs",
              links: ["ourProjects", "joinAsStudent", "supportArmath"] as TranslationKey[],
            },
            {
              title: language === "hy" ? "Կապ" : "Connect",
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
                  <li>{language === "hy" ? "Առափի, Շիրակի մարզ" : "Arapi, Shirak Province"}</li>
                  <li>+374 XX XXX XXX</li>
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
              © 2025 {language === "hy" ? "Առափիի Արմաթ ճարտարագիտական աշխատանոց" : "Armath Arapi Engineering Makerspace"}. {language === "hy" ? " Բոլոր իրավունքները պաշտպանված են:" : " All rights reserved."}
            </p>
          </div>
        </AnimatedSection>
      </div>
    </motion.footer>
  )
}
