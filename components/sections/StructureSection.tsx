import { AnimatedSection } from "@/components/animated-section"
import { AtomStructure } from "@/components/atom-structure"
import { useLanguage } from "@/contexts/language-context"

export function StructureSection() {
  const { t } = useLanguage()
  return (
    <section id="structure" className="pt-24 pb-28 bg-transparent relative z-20 overflow-visible">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{t("ourAtom")}</h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">{t("atomIntro")}</p>
        </AnimatedSection>

        <AnimatedSection>
          <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-4 md:p-6 shadow-lg">
            <AtomStructure />
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
