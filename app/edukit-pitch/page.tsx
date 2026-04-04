import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "EduKit - Eco-STEM Pitch Presentation | Armath Arapi",
  description:
    "EduKit: Armenian-language, project-based Eco-STEM educational kits — empowering communities through technology and environmental awareness.",
  openGraph: {
    title: "EduKit - Eco-STEM Pitch Presentation",
    description:
      "Armenian-language, project-based Eco-STEM educational kits — empowering communities through technology and environmental awareness.",
    type: "website",
  },
}

export default function EduKitPitchPage() {
  return (
    <div className="w-full h-screen">
      <iframe
        src="/edukit-pitch.html"
        title="EduKit Pitch Presentation"
        className="w-full h-full border-0"
        allowFullScreen
      />
    </div>
  )
}
