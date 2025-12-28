import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Sans_Armenian } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { HtmlLangUpdater } from "@/components/html-lang-updater"
import { cn } from "@/lib/utils"
import { SnowEffect } from "@/components/snow-effect"
import { FestiveCursor } from "@/components/festive-cursor"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const notoSansArmenian = Noto_Sans_Armenian({ subsets: ["armenian"], variable: "--font-noto-sans-armenian" })

export const metadata: Metadata = {
  title: "Armath Engineering Makerspace - Arapi",
  description:
    "A state-of-the-art makerspace in Arapi where engineers, makers, and innovators come together to create, learn, and transform ideas into reality.",
  metadataBase: new URL("https://armath-arapi.am"),
  openGraph: {
    title: "Armath Engineering Makerspace - Arapi",
    description: "A state-of-the-art makerspace where engineers, makers, and innovators create and learn.",
    type: "website",
  },
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("relative font-sans antialiased", inter.variable, notoSansArmenian.variable)}>
        <LanguageProvider>
          <HtmlLangUpdater />
          <SnowEffect />
          <FestiveCursor />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
