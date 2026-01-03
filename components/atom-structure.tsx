"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import type React from "react"
import { useLayoutEffect, useEffect, useMemo, useRef, useState, createContext, useContext, useCallback } from "react"
import { createPortal } from "react-dom"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

import { type TranslationKey } from "@/lib/translations"

// --- Tooltip Portal Context ---
// This allows tooltips to render outside the stacking context
const TooltipContainerContext = createContext<HTMLElement | null>(null)

// --- Types ---
interface TeamMember {
  id: string
  name: string
  role: string
  isCore: boolean
  contribution?: string
  details?: string
  image?: string
}

// --- Sample Data ---
const getTeamMembers = (t: (key: TranslationKey) => string): TeamMember[] => [
  {
    id: "grisha-kh",
    name: "Grisha Khachatryan",
    role: t("roleLeadCoach"),
    isCore: true,
    details: t("detailsLead"),
    image: "/team/grisha_khachatryan.jpg",
  },
  {
    id: "olya-kh",
    name: "Olya Khachatryan",
    role: t("roleCoach"),
    isCore: true,
    details: t("detailsCoach"),
    image: "/team/olya_khachatryan.jpg",
  },
  {
    id: "narek-sar",
    name: "Narek Saroyan",
    role: t("roleCoach"),
    isCore: true,
    details: t("detailsCoach"),
    image: "/team/narek_saroyan.jpg",
  },
  {
    id: "edgar-har",
    name: "Edgar Harutyunyan",
    role: t("roleSupporter"),
    isCore: false,
    contribution: t("contributionScientific"),
    image: "/team/edgar_harutyunyan.jpg",
  },
  {
    id: "narek-har",
    name: "Narek Harutyunyan",
    role: t("roleSupporter"),
    isCore: false,
    contribution: t("contributionWeb"),
    image: "/team/narek_harutyunyan.jpg",
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

// Hook to detect touch devices for tap-to-toggle behavior
function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    // Check for coarse pointer (touch) OR no fine pointer (hover)
    const touchQuery = window.matchMedia("(pointer: coarse)")
    setIsTouch(touchQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches)
    touchQuery.addEventListener("change", handler)
    return () => touchQuery.removeEventListener("change", handler)
  }, [])

  return isTouch
}

// --- Floating Tooltip Component ---
// Renders in a portal to escape stacking context issues
type FloatingTooltipProps = {
  isVisible: boolean
  anchorRef: React.RefObject<HTMLElement | null>
  children: React.ReactNode
  id: string
  accentColor?: "blue" | "red"
}

const FloatingTooltip: React.FC<FloatingTooltipProps> = ({ isVisible, anchorRef, children, id, accentColor = "blue" }) => {
  const container = useContext(TooltipContainerContext)
  const [position, setPosition] = useState({ x: 0, y: 0, flipToBottom: false, arrowOffset: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isVisible || !anchorRef.current) return

    const updatePosition = () => {
      if (!anchorRef.current) return
      const rect = anchorRef.current.getBoundingClientRect()

      // Measure tooltip if possible (fallback to the known width)
      const tooltipWidth = tooltipRef.current?.offsetWidth ?? 280
      const tooltipHeight = tooltipRef.current?.offsetHeight ?? 0
      const gap = 12
      const margin = 8

      // Use viewport dimensions directly (the portal is fixed inset-0)
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Calculate the element's true center position in viewport coordinates
      const elementCenterX = rect.left + rect.width / 2
      const elementCenterY = rect.top + rect.height / 2

      // Clamp tooltip position to prevent horizontal overflow
      const minX = tooltipWidth / 2 + margin
      const maxX = viewportWidth - tooltipWidth / 2 - margin
      const clampedX = Math.max(minX, Math.min(maxX, elementCenterX))

      // Calculate arrow offset (how much the tooltip was shifted from element center)
      const arrowOffset = elementCenterX - clampedX

      // Determine if we need to flip (prefer top, but pick the side that fits best)
      const spaceAbove = rect.top
      const spaceBelow = viewportHeight - rect.bottom
      const needed = tooltipHeight > 0 ? tooltipHeight + gap : 200
      const canFitAbove = spaceAbove >= needed
      const canFitBelow = spaceBelow >= needed

      let flipToBottom = false
      if (!canFitAbove && canFitBelow) flipToBottom = true
      else if (canFitAbove && !canFitBelow) flipToBottom = false
      else if (!canFitAbove && !canFitBelow) flipToBottom = spaceBelow > spaceAbove
      else flipToBottom = false

      setPosition({
        x: clampedX,
        y: flipToBottom ? rect.bottom + gap : rect.top - gap,
        flipToBottom,
        arrowOffset,
      })
    }

    updatePosition()
    // Follow moving electrons smoothly (and stay in sync with rAF-driven motion)
    let rafId = 0
    const loop = () => {
      updatePosition()
      rafId = window.requestAnimationFrame(loop)
    }
    rafId = window.requestAnimationFrame(loop)
    return () => window.cancelAnimationFrame(rafId)
  }, [isVisible, anchorRef])

  if (!container) return null

  const arrowColor = accentColor === "red" ? "border-t-armath-red" : "border-t-armath-blue"
  const arrowColorBottom = accentColor === "red" ? "border-b-armath-red" : "border-b-armath-blue"

  // Clamp arrow offset to stay within tooltip bounds (with some padding)
  // Arrow triangle uses border-l-8/border-r-8, so the base is 16px wide.
  // Keep the arrow tip at least 8px from the tooltip edge so the base doesn't spill outside.
  const tooltipWidthForArrow = tooltipRef.current?.offsetWidth ?? 280
  const arrowHalfBase = 8
  const maxArrowOffset = (tooltipWidthForArrow / 2) - arrowHalfBase
  const clampedArrowOffset = Math.max(-maxArrowOffset, Math.min(maxArrowOffset, position.arrowOffset))

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          key={id}
          id={id}
          role="tooltip"
          initial={{ opacity: 0, y: position.flipToBottom ? -10 : 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position.flipToBottom ? -10 : 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="pointer-events-none absolute z-[9999]"
          style={{
            left: position.x,
            top: position.y,
            transform: position.flipToBottom
              ? "translate(-50%, 0)"
              : "translate(-50%, -100%)",
          }}
        >
          <div className="relative">
            {/* Arrow pointing to element - offset to follow the actual element position */}
            {position.flipToBottom ? (
              <div
                className={`absolute -top-2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent ${arrowColorBottom}`}
                style={{
                  left: '50%',
                  transform: `translateX(calc(-50% + ${clampedArrowOffset}px))`
                }}
              />
            ) : (
              <div
                className={`absolute -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent ${arrowColor}`}
                style={{
                  left: '50%',
                  transform: `translateX(calc(-50% + ${clampedArrowOffset}px))`
                }}
              />
            )}
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
  togglePin: (id: string) => void
}

// Individual core member button with ref for tooltip positioning
type CoreMemberButtonProps = {
  member: TeamMember
  angleDeg: number
  orbitRadius: number
  dotSize: number
  activeId: string | null
  setActiveId: (id: string | null) => void
  togglePin: (id: string) => void
  index: number
}

const CoreMemberButton: React.FC<CoreMemberButtonProps> = ({
  member,
  angleDeg,
  orbitRadius,
  dotSize,
  activeId,
  setActiveId,
  togglePin,
  index,
}) => {
  const reduceMotion = useReducedMotion()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const tipId = `tip-${member.id}`
  const isActive = activeId === member.id
  const isTouch = useIsTouchDevice()

  // Click-to-pin works on all devices (needed for orbiting electrons and accessibility)
  const handleClick = () => togglePin(member.id)

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
          data-atom-member-button="true"
          data-member-id={member.id}
          aria-describedby={isActive ? tipId : undefined}
          aria-label={`${member.name}, ${member.role}`}
          className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-armath-blue"
          initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
          animate={reduceMotion ? {} : { scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.2, type: "spring", stiffness: 300 }}
          onClick={handleClick}
          onMouseEnter={() => !isTouch && setActiveId(member.id)}
          onMouseLeave={() => !isTouch && setActiveId(null)}
          onFocus={() => setActiveId(member.id)}
          onBlur={() => !isTouch && setActiveId(null)}
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

        <FloatingTooltip isVisible={isActive} anchorRef={buttonRef} id={tipId} accentColor="blue">
          <Card className="shadow-2xl border-0 w-[280px] overflow-hidden bg-white">
            {/* Gradient header */}
            <div className="h-2 bg-gradient-to-r from-armath-blue to-armath-blue/70" />
            <CardContent className="p-5">
              <div className="flex flex-col items-center text-center">
                {/* Profile image */}
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-3 ring-armath-blue/20 ring-offset-2 shadow-lg">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-armath-blue to-armath-blue/70 flex items-center justify-center text-white text-lg font-bold">
                        {getInitials(member.name)}
                      </div>
                    )}
                  </div>
                </div>
                {/* Name and role */}
                <h3 className="text-base font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm font-semibold text-armath-blue mb-3">{member.role}</p>
                {/* Details */}
                <p className="text-sm leading-relaxed text-gray-600">{member.details ?? "—"}</p>
              </div>
            </CardContent>
          </Card>
        </FloatingTooltip>
      </div>
    </div>
  )
}

const Nucleus: React.FC<NucleusProps> = ({ diameter, coreMembers, activeId, setActiveId, togglePin }) => {
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
            togglePin={togglePin}
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
  togglePin: (id: string) => void
  size: number
}

const Electron: React.FC<ElectronProps> = ({
  supporter,
  orbitRadius,
  duration,
  startingAngle,
  activeId,
  setActiveId,
  togglePin,
  size,
}) => {
  const reduceMotion = useReducedMotion()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isActive = activeId === supporter.id
  const tipId = `tip-${supporter.id}`
  const isTouch = useIsTouchDevice()

  const transition = useMemo(() => {
    if (reduceMotion) {
      return { duration: 0 as number }
    }
    return { duration, ease: "linear" as const, repeat: Number.POSITIVE_INFINITY as number }
  }, [duration, reduceMotion])

  // Memoize initials to avoid recalculating on every render
  const initials = useMemo(() => getInitials(supporter.name), [supporter.name])

  // Click-to-pin works on all devices (hover can't reliably stay on a moving electron)
  const handleClick = () => togglePin(supporter.id)

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
          data-atom-member-button="true"
          data-member-id={supporter.id}
          aria-describedby={isActive ? tipId : undefined}
          aria-label={`${supporter.name}, ${supporter.role}`}
          className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-armath-red"
          onClick={handleClick}
          onMouseEnter={() => !isTouch && setActiveId(supporter.id)}
          onMouseLeave={() => !isTouch && setActiveId(null)}
          onFocus={() => setActiveId(supporter.id)}
          onBlur={() => !isTouch && setActiveId(null)}
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

        <FloatingTooltip isVisible={isActive} anchorRef={buttonRef} id={tipId} accentColor="red">
          <Card className="shadow-2xl border-0 w-[280px] overflow-hidden bg-white">
            {/* Gradient header */}
            <div className="h-2 bg-gradient-to-r from-armath-red to-armath-red/70" />
            <CardContent className="p-5">
              <div className="flex flex-col items-center text-center">
                {/* Profile image */}
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-3 ring-armath-red/20 ring-offset-2 shadow-lg">
                    {supporter.image ? (
                      <Image
                        src={supporter.image}
                        alt={supporter.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-armath-red to-armath-red/70 flex items-center justify-center text-white text-lg font-bold">
                        {initials}
                      </div>
                    )}
                  </div>
                </div>
                {/* Name and role */}
                <h3 className="text-base font-bold text-gray-900 mb-1">{supporter.name}</h3>
                <p className="text-sm font-semibold text-armath-red mb-3">{supporter.role}</p>
                {/* Contribution */}
                <p className="text-sm leading-relaxed text-gray-600">{supporter.contribution ?? "—"}</p>
              </div>
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
  const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null)
  const [pinnedMemberId, setPinnedMemberId] = useState<string | null>(null)
  const activeMemberId = pinnedMemberId ?? hoveredMemberId

  const [tooltipContainer, setTooltipContainer] = useState<HTMLElement | null>(null)

  const togglePin = useCallback((id: string) => {
    setPinnedMemberId((prev) => (prev === id ? null : id))
    setHoveredMemberId(null)
  }, [])

  // Create a fixed full-viewport tooltip layer so coordinates are always viewport-correct.
  useEffect(() => {
    const layer = document.createElement("div")
    layer.setAttribute("data-atom-tooltip-layer", "true")
    layer.className = "pointer-events-none fixed inset-0 z-[9999]"
    document.body.appendChild(layer)
    setTooltipContainer(layer)

    return () => {
      document.body.removeChild(layer)
    }
  }, [])

  // Close pinned tooltip on outside click/tap.
  useEffect(() => {
    if (!pinnedMemberId) return

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return
      if (target.closest?.('[data-atom-member-button="true"]')) return
      setPinnedMemberId(null)
      setHoveredMemberId(null)
    }

    window.addEventListener("pointerdown", onPointerDown)
    return () => window.removeEventListener("pointerdown", onPointerDown)
  }, [pinnedMemberId])

  // Handle escape key to close tooltip (at component level to avoid multiple listeners)
  const closeAllTooltips = useCallback(() => {
    setHoveredMemberId(null)
    setPinnedMemberId(null)
  }, [])
  useEscapeKey(closeAllTooltips)

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
          {/* Nucleus */}
          <Nucleus
            diameter={nucleusDiameter}
            coreMembers={coreMembers}
            activeId={activeMemberId}
            setActiveId={setHoveredMemberId}
            togglePin={togglePin}
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
                  setActiveId={setHoveredMemberId}
                  togglePin={togglePin}
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
