"use client"

import { motion } from "motion/react"

interface MultimeterWireProps {
  startX: number
  startY: number
  endX: number
  endY: number
  color?: string
  animated?: boolean
}

export function MultimeterWire({
  startX,
  startY,
  endX,
  endY,
  color = "#A4237E",
  animated = true,
}: MultimeterWireProps) {
  // Create a curved path that looks like a multimeter wire
  const midX = (startX + endX) / 2
  const midY = Math.min(startY, endY) - 50 // Create a curve upward

  const pathData = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
      {/* Wire shadow */}
      <motion.path
        d={pathData}
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        transform="translate(2, 2)"
      />

      {/* Main wire */}
      <motion.path
        d={pathData}
        stroke={color}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={animated ? { pathLength: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Wire highlight */}
      <motion.path
        d={pathData}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={animated ? { pathLength: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
      />

      {/* Multimeter probe at the end */}
      <motion.circle
        cx={endX}
        cy={endY}
        r="6"
        fill={color}
        initial={{ scale: 0 }}
        animate={animated ? { scale: 1 } : {}}
        transition={{ delay: 1.5, type: "spring", stiffness: 300 }}
      />

      {/* Probe tip */}
      <motion.circle
        cx={endX}
        cy={endY}
        r="3"
        fill="white"
        initial={{ scale: 0 }}
        animate={animated ? { scale: 1 } : {}}
        transition={{ delay: 1.7, type: "spring", stiffness: 300 }}
      />
    </svg>
  )
}
