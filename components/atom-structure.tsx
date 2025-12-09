"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import type React from "react"
import { useLayoutEffect, useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"

// --- Types ---
interface TeamMember {
  id: string
  name: string
  role: string
  isCore: boolean
  contribution?: string
  details?: string
}

// --- Sample Data (unchanged, but with ids) ---
const defaultTeamMembers: TeamMember[] = [
  {
    id: "grisha-kh",
    name: "Grisha Khachatryan",
    role: "Lead Coach",
    isCore: true,
    details: "Leads the lab, coordinates projects, and mentors students in advanced engineering concepts.",
  },
  {
    id: "olya-kh",
    name: "Olya Khachatryan",
    role: "Coach",
    isCore: true,
    details: "Assistant to the Lead Coach; Beginners' coach.",
  },
  {
    id: "narek-sar",
    name: "Narek Saroyan",
    role: "Coach",
    isCore: true,
    details: "Assistant to the Lead Coach; Beginners' coach.",
  },
  {
    id: "edgar-har",
    name: "Edgar Harutyunyan",
    role: "Supporter",
    isCore: false,
    contribution: "Scientific researcher; Provided equipment",
  },
  {
    id: "narek-har",
    name: "Narek Harutyunyan",
    role: "Supporter",
    isCore: false,
    contribution: "Volunteering as website developer",
  },
]

// --- Constants ---
const GOLDEN_ANGLE = 137.5 // Golden angle in degrees for optimal spacing
const MIN_NUCLEUS_DIAMETER = 110 // Increased for better mobile spacing
const MIN_ORBIT_RADIUS_MULTIPLIER = 0.9

// --- Helpers ---
const getInitials = (full: string): string => {
  if (!full || typeof full !== "string") return "?"
  return full
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase()
}

// Observe element size
function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [rect, setRect] = useState({ width: 0, height: 0 })

  useLayoutEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect
      setRect({ width: cr.width, height: cr.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { ref, ...rect }
}

// Hook to handle keyboard events (Escape key)
function useEscapeKey(callback: () => void) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        callback()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [callback])
}

// --- Subcomponents ---

type NucleusProps = {
  diameter: number
  coreMembers: TeamMember[]
  activeId: string | null
  setActiveId: (id: string | null) => void
}

const Nucleus: React.FC<NucleusProps> = ({ diameter, coreMembers, activeId, setActiveId }) => {
  const reduceMotion = useReducedMotion()

  // Early return if no core members
  if (coreMembers.length === 0) {
    return null
  }

  const count = coreMembers.length
  
  // Calculate dot size - smaller minimum for mobile, scales with diameter
  const dotSize = Math.round(Math.max(20, Math.min(32, diameter * 0.18)))
  
  // Calculate minimum orbit radius needed to prevent overlap
  // For n items evenly spaced on a circle, the minimum radius to avoid overlap is:
  // r >= dotSize / (2 * sin(π / n))
  // We use 0.75 multiplier to add extra breathing room between elements
  const minSafeRadius = count > 1 
    ? (dotSize * 0.75) / Math.sin(Math.PI / count) 
    : 0
  
  // Available radius from nucleus edge
  const padding = 6
  const maxRadius = diameter / 2 - dotSize / 2 - padding
  
  // Use the larger of minimum safe radius or 70% of max, capped at max
  const orbitRadius = Math.min(maxRadius, Math.max(minSafeRadius, maxRadius * 0.7))

  return (
    <motion.div
      className="relative z-10 flex items-center justify-center rounded-full bg-gradient-to-br from-armath-blue to-armath-blue/80 shadow-xl border-4 border-white shadow-[0_0_30px_rgba(59,130,246,0.25)]"
      style={{ width: diameter, height: diameter }}
      initial={reduceMotion ? false : { scale: 0 }}
      animate={reduceMotion ? {} : { scale: 1 }}
      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
    >
      {coreMembers.map((member, index) => {
        const angleDeg = (360 / count) * index - 90
        const tipId = `tip-${member.id}`

        return (
          <div
            key={member.id}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `translate(-50%, -50%) rotate(${angleDeg}deg)` }}
          >
            <div className="absolute" style={{ left: `${orbitRadius}px`, transform: "translate(-50%, -50%)" }}>
              <motion.button
                type="button"
                aria-describedby={activeId === member.id ? tipId : undefined}
                aria-label={`${member.name}, ${member.role}`}
                className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-armath-blue"
                initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
                animate={reduceMotion ? {} : { scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.2, type: "spring", stiffness: 300 }}
                onMouseEnter={() => setActiveId(member.id)}
                onMouseLeave={() => setActiveId(null)}
                onFocus={() => setActiveId(member.id)}
                onBlur={() => setActiveId(null)}
                whileHover={reduceMotion ? undefined : { scale: 1.2, zIndex: 30 }}
              >
                <div style={{ transform: `rotate(${-angleDeg}deg)` }}>
                  <div
                    className="flex flex-col items-center justify-center rounded-full border-2 border-armath-blue/20 bg-white text-xs font-bold text-armath-blue shadow-md cursor-pointer hover:bg-armath-blue/5 transition-colors"
                    style={{ width: dotSize, height: dotSize }}
                  >
                    <span>{getInitials(member.name)}</span>
                  </div>

                  <AnimatePresence>
                    {activeId === member.id && (
                      <motion.div
                        key={tipId}
                        id={tipId}
                        role="tooltip"
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 mb-3 w-max max-w-[200px] sm:max-w-xs -translate-x-1/2 z-[100]"
                        style={{
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      >
                        <Card className="shadow-xl border-armath-blue/20">
                          <CardContent className="p-4 text-center">
                            <p className="text-sm font-bold text-gray-900 mb-1">{member.name}</p>
                            <p className="text-xs font-medium text-armath-blue mb-2">{member.role}</p>
                            <p className="text-xs leading-relaxed text-gray-600">{member.details ?? "—"}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}

type OrbitProps = { radius: number; delay: number; dashed?: boolean }
const Orbit: React.FC<OrbitProps> = ({ radius, delay, dashed }) => {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      aria-hidden
      className={`absolute rounded-full border border-armath-blue/20 ${dashed ? "border-dashed" : ""}`}
      style={{ width: radius * 2, height: radius * 2 }}
      initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
      animate={reduceMotion ? {} : { scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.8 }}
    />
  )
}

type ElectronProps = {
  supporter: TeamMember
  orbitRadius: number
  duration: number
  startingAngle: number
  activeId: string | null
  setActiveId: (id: string | null) => void
  size: number
}

const Electron: React.FC<ElectronProps> = ({
  supporter,
  orbitRadius,
  duration,
  startingAngle,
  activeId,
  setActiveId,
  size,
}) => {
  const reduceMotion = useReducedMotion()
  const isActive = activeId === supporter.id
  const tipId = `tip-${supporter.id}`

  const transition = useMemo(() => {
    if (reduceMotion) return undefined
    return { duration, ease: "linear" as const, repeat: Number.POSITIVE_INFINITY as number }
  }, [duration, reduceMotion])

  // Memoize initials to avoid recalculating on every render
  const initials = useMemo(() => getInitials(supporter.name), [supporter.name])

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ transform: "translate(-50%, -50%)" }}
      initial={{ rotate: startingAngle }}
      animate={reduceMotion ? { rotate: startingAngle } : { rotate: startingAngle + 360 }}
      transition={reduceMotion ? { duration: 0 } : transition}
    >
      <div className="absolute" style={{ left: `${orbitRadius}px`, transform: "translate(-50%, -50%)" }}>
        <motion.button
          type="button"
          aria-describedby={isActive ? tipId : undefined}
          aria-label={`${supporter.name}, ${supporter.role}`}
          className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-armath-red"
          onMouseEnter={() => setActiveId(supporter.id)}
          onMouseLeave={() => setActiveId(null)}
          onFocus={() => setActiveId(supporter.id)}
          onBlur={() => setActiveId(null)}
          whileHover={reduceMotion ? undefined : { scale: 1.1, zIndex: 40 }}
        >
          <motion.div
            className="relative"
            initial={{ rotate: -startingAngle }}
            animate={reduceMotion ? { rotate: -startingAngle } : { rotate: -(startingAngle + 360) }}
            transition={reduceMotion ? { duration: 0 } : transition}
          >
            <div
              className="relative flex items-center justify-center rounded-full border-2 border-white bg-armath-red text-sm font-bold text-white shadow-lg cursor-pointer hover:bg-armath-red/90 transition-colors"
              style={{ width: size, height: size }}
            >
              {initials}
            </div>
            <AnimatePresence>
              {isActive && (
                <motion.div
                  key={tipId}
                  id={tipId}
                  role="tooltip"
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="pointer-events-none absolute bottom-full left-1/2 z-[100] mb-3 -translate-x-1/2"
                  style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <Card className="min-w-max max-w-[200px] sm:max-w-none border-armath-red/20 bg-white shadow-xl">
                    <CardContent className="p-3 text-center">
                      <p className="text-sm font-medium text-gray-900 break-words mb-1">{supporter.name}</p>
                      <p className="text-xs break-words text-gray-600">{supporter.contribution ?? "—"}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  )
}

// --- Legend Component ---
const Legend: React.FC = () => {
  const { t } = useLanguage()
  return (
    <div className="mt-4 text-center">
      <p className="text-sm font-medium text-gray-600">
        <span className="text-armath-blue">●</span> {t("coreTeam")} ({t("nucleus")}) •
        <span className="ml-2 text-armath-red">●</span> {t("supporters")} ({t("orbitingElectrons")})
      </p>
    </div>
  )
}

type AtomStructureProps = {
  teamMembers?: TeamMember[]
  coreMembers?: TeamMember[]
  supporters?: TeamMember[]
}

// --- Main Component ---
export function AtomStructure({
  teamMembers: providedTeamMembers,
  coreMembers: providedCoreMembers,
  supporters: providedSupporters,
}: AtomStructureProps = {}) {
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null)

  // Handle escape key to close tooltip (at component level to avoid multiple listeners)
  useEscapeKey(() => setActiveMemberId(null))

  // Measure container to scale radii proportionally
  const { ref, width, height } = useMeasure<HTMLDivElement>()
  const resolvedTeamMembers = useMemo(
    () => providedTeamMembers ?? defaultTeamMembers,
    [providedTeamMembers]
  )
  const coreMembers = useMemo(
    () => providedCoreMembers ?? resolvedTeamMembers.filter((m) => m.isCore),
    [providedCoreMembers, resolvedTeamMembers]
  )
  const supporters = useMemo(
    () => providedSupporters ?? resolvedTeamMembers.filter((m) => !m.isCore),
    [providedSupporters, resolvedTeamMembers]
  )

  const { nucleusDiameter, orbits, electronSize } = useMemo(() => {
    const shortest = Math.max(0, Math.min(width, height))
    const isSmall = shortest < 360
    const isTiny = shortest < 280

    const computedNucleusDiameter = Math.max(
      MIN_NUCLEUS_DIAMETER,
      shortest * (isTiny ? 0.42 : isSmall ? 0.38 : 0.28)
    )

    const baseRadius = shortest / 2
    const innerOrbit = Math.max(
      computedNucleusDiameter * MIN_ORBIT_RADIUS_MULTIPLIER,
      baseRadius * (isTiny ? 0.58 : isSmall ? 0.52 : 0.45)
    )
    const outerOrbit = Math.max(
      computedNucleusDiameter * 1.25,
      baseRadius * (isTiny ? 0.82 : isSmall ? 0.76 : 0.62)
    )

    const computedElectronSize = Math.round(
      Math.max(24, Math.min(44, shortest * (isTiny ? 0.1 : isSmall ? 0.11 : 0.12)))
    )

    return {
      nucleusDiameter: computedNucleusDiameter,
      orbits: [
        { radius: innerOrbit, duration: 20 },
        { radius: outerOrbit, duration: 25 },
      ],
      electronSize: computedElectronSize,
    }
  }, [height, width])

  return (
    <div className="w-full">
      {/* Scene container */}
      <div
        ref={ref}
        className="relative mx-auto flex h-[clamp(20rem,65vw,28rem)] max-w-full items-center justify-center overflow-hidden touch-pan-y"
      >
        {/* Nucleus */}
        <Nucleus
          diameter={nucleusDiameter}
          coreMembers={coreMembers}
          activeId={activeMemberId}
          setActiveId={setActiveMemberId}
        />

        {/* Orbits */}
        {orbits.map((o, i) => (
          <Orbit key={i} radius={o.radius} delay={0.8 + i * 0.2} dashed={i === orbits.length - 1} />
        ))}

        {/* Electrons */}
        {supporters.length > 0 &&
          supporters.map((supporter, index) => {
            const { radius, duration } = orbits[index % orbits.length]
            const startingAngle = index * GOLDEN_ANGLE
            return (
              <Electron
                key={supporter.id}
                supporter={supporter}
                orbitRadius={radius}
                duration={duration}
                startingAngle={startingAngle}
                activeId={activeMemberId}
                setActiveId={setActiveMemberId}
                size={electronSize}
              />
            )
          })}
      </div>

      {/* Legend (moved outside absolute scene for consistent placement) */}
      <Legend />
    </div>
  )
}
