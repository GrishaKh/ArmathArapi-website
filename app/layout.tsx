import type React from "react"
import type { Metadata } from "next"
import { Inter, Google_Sans } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { HtmlLangUpdater } from "@/components/html-lang-updater"
import { cn } from "@/lib/utils"
import { getSiteUrlAsURL } from "@/lib/site"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const googleSans = Google_Sans({
  subsets: ["latin", "latin-ext", "armenian"],
  variable: "--font-google-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Armath Engineering Makerspace - Arapi",
  description:
    "A state-of-the-art makerspace in Arapi where engineers, makers, and innovators come together to create, learn, and transform ideas into reality.",
  metadataBase: getSiteUrlAsURL(),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Armath Engineering Makerspace - Arapi",
    description: "A state-of-the-art makerspace where engineers, makers, and innovators create and learn.",
    type: "website",
    url: "/",
  },
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("relative font-sans antialiased", inter.variable, googleSans.variable)}>
        <LanguageProvider>
          <HtmlLangUpdater />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
