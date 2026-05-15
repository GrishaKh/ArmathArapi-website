import type { Metadata } from "next"
import { Fraunces, IBM_Plex_Mono } from "next/font/google"
import { cn } from "@/lib/utils"
import "./bench.css"

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Marked Graphs & Dataflow — An Interactive Bench | Armath Arapi",
  description:
    "A hands-on tutorial on dataflow marked graphs: actors, channels, tokens, firing rules, the balance equation, delays and static scheduling — with a live signal-bench simulator.",
  alternates: { canonical: "/tutorials/marked-graphs" },
  openGraph: {
    title: "Marked Graphs & Dataflow — An Interactive Bench",
    description:
      "Learn synchronous dataflow by firing actors and watching tokens flow. Repetition vectors and static schedules computed live.",
    type: "article",
    url: "/tutorials/marked-graphs",
  },
}

export default function MarkedGraphsLayout({ children }: { children: React.ReactNode }) {
  return <div className={cn("bench-root", fraunces.variable, plexMono.variable)}>{children}</div>
}
