"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function FestiveCursor() {
    const [isVisible, setIsVisible] = useState(false)
    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

    const springConfig = { damping: 25, stiffness: 700 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    useEffect(() => {
        if (window.location.pathname.startsWith('/admin')) {
            return
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return
        }

        // Don't enable on touch devices or devices without hover capability
        if (window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(hover: none)").matches) {
            return
        }

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
            // Show cursor only after first movement to avoid initial flash at (0,0) or off-screen
            if (!isVisible) setIsVisible(true)
        }

        const handleMouseEnter = () => setIsVisible(true)
        const handleMouseLeave = () => setIsVisible(false)

        window.addEventListener("mousemove", moveCursor)
        document.addEventListener("mouseenter", handleMouseEnter)
        document.addEventListener("mouseleave", handleMouseLeave)

        return () => {
            window.removeEventListener("mousemove", moveCursor)
            document.removeEventListener("mouseenter", handleMouseEnter)
            document.removeEventListener("mouseleave", handleMouseLeave)
        }
    }, [cursorX, cursorY, isVisible])



    if (!isVisible) return null

    return (
        <motion.div
            className="pointer-events-none fixed left-0 top-0 z-[100] flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-2xl"
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
            }}
        >
            ❄️
        </motion.div>
    )
}
