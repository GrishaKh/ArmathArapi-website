import { AnimatedSection } from "@/components/animated-section"
import { AtomStructure } from "@/components/atom-structure"
import { useLanguage } from "@/contexts/language-context"

export function StructureSection() {
  const { t } = useLanguage()
  return (
    <section id="structure" className="py-20 bg-gray-50 relative z-10">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t("ourAtom")}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">{t("atomIntro")}</p>
        </AnimatedSection>

        <AnimatedSection>
          <AtomStructure />
        </AnimatedSection>
      </div>
    </section>
  )
}
