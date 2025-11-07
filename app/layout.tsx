import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Sans_Armenian } from "next/font/google" // Import Noto_Sans_Armenian
import "./globals.css"
import { LanguageProvider } from "@/contexts/language-context"
import { cn } from "@/lib/utils" // Import cn utility

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const notoSansArmenian = Noto_Sans_Armenian({ subsets: ["armenian"], variable: "--font-noto-sans-armenian" }) // Define Noto Sans Armenian

export const metadata: Metadata = {
  title: "Armath Engineering Makerspace - Arapi",
  description:
    "A state-of-the-art makerspace in Arapi where engineers, makers, and innovators come together to create, learn, and transform ideas into reality.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn("font-sans antialiased", inter.variable, notoSansArmenian.variable)}>
        {" "}
        {/* Add both font variables */}
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
