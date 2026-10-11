import type React from "react"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  animation?: "fadeInUp" | "scaleIn" | "slideInFromBottom"
  delay?: number
}

// Public content is visible immediately, including without JavaScript.
// Keep the existing props so callers can migrate without changing their markup.
export function AnimatedSection({ children, className = "" }: AnimatedSectionProps) {
  return <div className={className}>{children}</div>
}
