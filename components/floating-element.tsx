"use client"

import { motion } from "framer-motion"
import type React from "react"

interface FloatingElementProps {
  children: React.ReactNode
  className?: string
  duration?: number
  yOffset?: number
}

export function FloatingElement({ children, className = "", duration = 3, yOffset = 10 }: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-yOffset, yOffset, -yOffset],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}
