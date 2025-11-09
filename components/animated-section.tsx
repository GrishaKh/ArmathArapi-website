"use client"

import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import type React from "react"

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  animation?: "fadeInUp" | "scaleIn" | "slideInFromBottom"
  delay?: number
}

const animations = {
  fadeInUp: {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
  slideInFromBottom: {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
  },
}

export function AnimatedSection({ children, className = "", animation = "fadeInUp", delay = 0 }: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <motion.div
      ref={ref}
      initial={animations[animation].initial}
      animate={isVisible ? animations[animation].animate : animations[animation].initial}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay: delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
