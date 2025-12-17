"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import type React from "react"
import { useLayoutEffect, useEffect, useMemo, useRef, useState, createContext, useContext } from "react"
import { createPortal } from "react-dom"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"

import { type TranslationKey } from "@/lib/translations"

// --- Tooltip Portal Context ---
// This allows tooltips to render outside the stacking context
const TooltipContainerContext = createContext<HTMLDivElement | null>(null)

// --- Types ---
interface TeamMember {
  id: string
  name: string
  role: string
  isCore: boolean
  contribution?: string
  details?: string
}

// --- Sample Data ---
const getTeamMembers = (t: (key: TranslationKey) => string): TeamMember[] => [
  {
    id: "grisha-kh",
    name: "Grisha Khachatryan",
    role: t("roleLeadCoach"),
    isCore: true,
    details: t("detailsLead"),
  },
  {
    id: "olya-kh",
    name: "Olya Khachatryan",
    role: t("roleCoach"),
    isCore: true,
    details: t("detailsCoach"),
  },
  {
    id: "narek-sar",
    name: "Narek Saroyan",
    role: t("roleCoach"),
    isCore: true,
    details: t("detailsCoach"),
  },
  {
    id: "edgar-har",
    name: "Edgar Harutyunyan",
    role: t("roleSupporter"),
    isCore: false,
    contribution: t("contributionScientific"),
  },
  {
    id: "narek-har",
    name: "Narek Harutyunyan",
    role: t("roleSupporter"),
    isCore: false,
    contribution: t("contributionWeb"),
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

// --- Floating Tooltip Component ---
// Renders in a portal to escape stacking context issues
type FloatingTooltipProps = {
  isVisible: boolean
  anchorRef: React.RefObject<HTMLElement | null>
  children: React.ReactNode
  id: string
}

const FloatingTooltip: React.FC<FloatingTooltipProps> = ({ isVisible, anchorRef, children, id }) => {
  const container = useContext(TooltipContainerContext)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!isVisible || !anchorRef.current) return

    const updatePosition = () => {
      if (!anchorRef.current || !container) return
      const rect = anchorRef.current.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()

      setPosition({
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top - containerRect.top,
      })
    }

    updatePosition()
    // Update position on scroll/resize
    const interval = setInterval(updatePosition, 16) // ~60fps for smooth following
    return () => clearInterval(interval)
  }, [isVisible, anchorRef, container])

  if (!container) return null

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={id}
          id={id}
          role="tooltip"
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          className="pointer-events-none absolute z-[9999]"
          style={{
            left: position.x,
            top: position.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="mb-3">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    container
  )
}

// --- Subcomponents ---

type NucleusProps = {
  diameter: number
  coreMembers: TeamMember[]
  activeId: string | null
  setActiveId: (id: string | null) => void
}

// Individual core member button with ref for tooltip positioning
type CoreMemberButtonProps = {
  member: TeamMember
  angleDeg: number
  orbitRadius: number
  dotSize: number
  activeId: string | null
  setActiveId: (id: string | null) => void
  index: number
}

const CoreMemberButton: React.FC<CoreMemberButtonProps> = ({
  member,
  angleDeg,
  orbitRadius,
  dotSize,
  activeId,
  setActiveId,
  index,
}) => {
  const reduceMotion = useReducedMotion()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const tipId = `tip-${member.id}`
  const isActive = activeId === member.id

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{
        transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
        zIndex: isActive ? 50 : 1,
      }}
    >
      <div className="absolute" style={{ left: `${orbitRadius}px`, transform: "translate(-50%, -50%)" }}>
        <motion.button
          ref={buttonRef}
          type="button"
          aria-describedby={isActive ? tipId : undefined}
          aria-label={`${member.name}, ${member.role}`}
          className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-armath-blue"
          initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
          animate={reduceMotion ? {} : { scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.2, type: "spring", stiffness: 300 }}
          onMouseEnter={() => setActiveId(member.id)}
          onMouseLeave={() => setActiveId(null)}
          onFocus={() => setActiveId(member.id)}
          onBlur={() => setActiveId(null)}
          whileHover={reduceMotion ? undefined : { scale: 1.2 }}
        >
          <div style={{ transform: `rotate(${-angleDeg}deg)` }}>
            <div
              className="flex flex-col items-center justify-center rounded-full border-2 border-armath-blue/20 bg-white text-xs font-bold text-armath-blue shadow-md cursor-pointer hover:bg-armath-blue/5 transition-colors"
              style={{ width: dotSize, height: dotSize }}
            >
              <span>{getInitials(member.name)}</span>
            </div>
          </div>
        </motion.button>

        <FloatingTooltip isVisible={isActive} anchorRef={buttonRef} id={tipId}>
          <Card className="shadow-xl border-armath-blue/20 w-max max-w-[200px] sm:max-w-xs">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-bold text-gray-900 mb-1">{member.name}</p>
              <p className="text-xs font-medium text-armath-blue mb-2">{member.role}</p>
              <p className="text-xs leading-relaxed text-gray-600">{member.details ?? "—"}</p>
            </CardContent>
          </Card>
        </FloatingTooltip>
      </div>
    </div>
  )
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
      className="relative z-20 flex items-center justify-center rounded-full bg-gradient-to-br from-armath-blue to-armath-blue/80 shadow-xl border-4 border-white shadow-[0_0_30px_rgba(59,130,246,0.25)]"
      style={{ width: diameter, height: diameter }}
      initial={reduceMotion ? false : { scale: 0 }}
      animate={reduceMotion ? {} : { scale: 1 }}
      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
    >
      {coreMembers.map((member, index) => {
        const angleDeg = (360 / count) * index - 90
        return (
          <CoreMemberButton
            key={member.id}
            member={member}
            angleDeg={angleDeg}
            orbitRadius={orbitRadius}
            dotSize={dotSize}
            activeId={activeId}
            setActiveId={setActiveId}
            index={index}
          />
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
      className={`absolute rounded-full border border-armath-blue/20 pointer-events-none z-10 ${dashed ? "border-dashed" : ""}`}
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
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isActive = activeId === supporter.id
  const tipId = `tip-${supporter.id}`

  const transition = useMemo(() => {
    if (reduceMotion) {
      return { duration: 0 as number }
    }
    return { duration, ease: "linear" as const, repeat: Number.POSITIVE_INFINITY as number }
  }, [duration, reduceMotion])

  // Memoize initials to avoid recalculating on every render
  const initials = useMemo(() => getInitials(supporter.name), [supporter.name])

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        transform: "translate(-50%, -50%)",
        zIndex: isActive ? 40 : 15, // Lift active electron above orbits and other electrons
      }}
      initial={{ rotate: startingAngle }}
      animate={{ rotate: startingAngle + 360 }}
      transition={transition}
    >
      <div className="absolute" style={{ left: `${orbitRadius}px`, transform: "translate(-50%, -50%)" }}>
        <motion.button
          ref={buttonRef}
          type="button"
          aria-describedby={isActive ? tipId : undefined}
          aria-label={`${supporter.name}, ${supporter.role}`}
          className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-armath-red"
          onMouseEnter={() => setActiveId(supporter.id)}
          onMouseLeave={() => setActiveId(null)}
          onFocus={() => setActiveId(supporter.id)}
          onBlur={() => setActiveId(null)}
          whileHover={reduceMotion ? undefined : { scale: 1.1 }}
        >
          <motion.div
            className="relative"
            initial={{ rotate: -startingAngle }}
            animate={{ rotate: -(startingAngle + 360) }}
            transition={transition}
          >
            <div
              className="relative flex items-center justify-center rounded-full border-2 border-white bg-armath-red text-sm font-bold text-white shadow-lg cursor-pointer hover:bg-armath-red/90 transition-colors"
              style={{ width: size, height: size }}
            >
              {initials}
            </div>
          </motion.div>
        </motion.button>

        <FloatingTooltip isVisible={isActive} anchorRef={buttonRef} id={tipId}>
          <Card className="min-w-max max-w-[200px] sm:max-w-none border-armath-red/20 bg-white shadow-xl">
            <CardContent className="p-3 text-center">
              <p className="text-sm font-medium text-gray-900 break-words mb-1">{supporter.name}</p>
              <p className="text-xs break-words text-gray-600">{supporter.contribution ?? "—"}</p>
            </CardContent>
          </Card>
        </FloatingTooltip>
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

// --- Main Component ---
export function AtomStructure() {
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null)
  const tooltipContainerRef = useRef<HTMLDivElement>(null)
  const [tooltipContainer, setTooltipContainer] = useState<HTMLDivElement | null>(null)

  // Set tooltip container after mount
  useEffect(() => {
    setTooltipContainer(tooltipContainerRef.current)
  }, [])

  // Handle escape key to close tooltip (at component level to avoid multiple listeners)
  useEscapeKey(() => setActiveMemberId(null))

  // Measure container to scale radii proportionally
  const { ref, width, height } = useMeasure<HTMLDivElement>()
  const shortest = Math.max(0, Math.min(width, height))
  const baseRadius = shortest / 2

  const isSmall = shortest < 360
  const isTiny = shortest < 280

  // Nucleus needs to be larger on mobile to fit core members without overlap
  const nucleusDiameter = Math.max(
    MIN_NUCLEUS_DIAMETER,
    shortest * (isTiny ? 0.42 : isSmall ? 0.38 : 0.28)
  )

  // Adjust orbit radii to accommodate larger nucleus on mobile
  const innerOrbit = Math.max(nucleusDiameter * MIN_ORBIT_RADIUS_MULTIPLIER, baseRadius * (isTiny ? 0.58 : isSmall ? 0.52 : 0.45))
  const outerOrbit = Math.max(nucleusDiameter * 1.25, baseRadius * (isTiny ? 0.82 : isSmall ? 0.76 : 0.62))

  const orbits = [
    { radius: innerOrbit, duration: 20 },
    { radius: outerOrbit, duration: 25 },
  ]

  const { t } = useLanguage()
  const teamMembers = useMemo(() => getTeamMembers(t), [t])
  const coreMembers = teamMembers.filter((m) => m.isCore)
  const supporters = teamMembers.filter((m) => !m.isCore)

  return (
    <TooltipContainerContext.Provider value={tooltipContainer}>
      <div className="w-full">
        {/* Scene container - removed overflow-hidden to prevent tooltip clipping */}
        <div
          ref={ref}
          className="relative mx-auto flex h-[clamp(20rem,65vw,28rem)] max-w-full items-center justify-center touch-pan-y"
        >
          {/* Tooltip container - renders tooltips above everything */}
          <div
            ref={tooltipContainerRef}
            className="absolute inset-0 pointer-events-none z-[9999]"
            aria-hidden="true"
          />

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
              const electronSize = Math.round(Math.max(24, Math.min(44, shortest * (isTiny ? 0.1 : isSmall ? 0.11 : 0.12))))
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
    </TooltipContainerContext.Provider>
  )
}
