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

// --- Configuration ---
const ATOM_CONFIG = {
  GOLDEN_ANGLE: 137.5,
  MIN_NUCLEUS_DIAMETER: 110,
  MIN_ORBIT_RADIUS_MULTIPLIER: 0.9,
  SIZE_THRESHOLDS: { tiny: 280, small: 360 },
  NUCLEUS_PULSE_DURATION: 3,
  ELECTRON_TRAIL_OPACITY: 0.4,
} as const

// --- Sample Data ---
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

// Nucleus Glow Effect
const NucleusGlow: React.FC<{ diameter: number; reduceMotion: boolean | null }> = ({ diameter, reduceMotion }) => (
  <>
    {/* Outer pulsing glow */}
    <motion.div
      className="absolute rounded-full bg-gradient-to-br from-armath-blue/30 to-cyan-400/20 blur-2xl"
      style={{ width: diameter * 1.5, height: diameter * 1.5 }}
      animate={reduceMotion ? {} : {
        scale: [1, 1.2, 1],
        opacity: [0.4, 0.2, 0.4],
      }}
      transition={{
        duration: ATOM_CONFIG.NUCLEUS_PULSE_DURATION,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    {/* Inner bright glow */}
    <motion.div
      className="absolute rounded-full bg-armath-blue/20 blur-xl"
      style={{ width: diameter * 1.2, height: diameter * 1.2 }}
      animate={reduceMotion ? {} : {
        scale: [1, 1.1, 1],
        opacity: [0.6, 0.3, 0.6],
      }}
      transition={{
        duration: ATOM_CONFIG.NUCLEUS_PULSE_DURATION * 0.8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5,
      }}
    />
  </>
)

type NucleusProps = {
  diameter: number
  coreMembers: TeamMember[]
  activeId: string | null
  setActiveId: (id: string | null) => void
}

const Nucleus: React.FC<NucleusProps> = ({ diameter, coreMembers, activeId, setActiveId }) => {
  const reduceMotion = useReducedMotion()

  if (coreMembers.length === 0) {
    return null
  }

  const count = coreMembers.length
  const dotSize = Math.round(Math.max(20, Math.min(32, diameter * 0.18)))
  
  const minSafeRadius = count > 1 
    ? (dotSize * 0.75) / Math.sin(Math.PI / count) 
    : 0
  
  const padding = 6
  const maxRadius = diameter / 2 - dotSize / 2 - padding
  const orbitRadius = Math.min(maxRadius, Math.max(minSafeRadius, maxRadius * 0.7))

  return (
    <div className="relative z-10 flex items-center justify-center">
      {/* Glow effects */}
      <NucleusGlow diameter={diameter} reduceMotion={reduceMotion} />
      
      {/* Main nucleus body */}
      <motion.div
        className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-armath-blue via-armath-blue/90 to-blue-600 shadow-2xl border-4 border-white/80"
        style={{ 
          width: diameter, 
          height: diameter,
          boxShadow: '0 0 40px rgba(59, 130, 246, 0.35), inset 0 -4px 20px rgba(0,0,0,0.1), inset 0 4px 20px rgba(255,255,255,0.2)'
        }}
        initial={reduceMotion ? false : { scale: 0 }}
        animate={reduceMotion ? {} : { scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      >
        {/* Inner nucleus texture */}
        <div 
          className="absolute inset-2 rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 50%)',
          }}
        />
        
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
                    {/* Hover glow */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-armath-blue/40 blur-md"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: activeId === member.id ? 1.5 : 0.8, opacity: activeId === member.id ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                    
                    <div
                      className="relative flex flex-col items-center justify-center rounded-full border-2 border-armath-blue/30 bg-white text-xs font-bold text-armath-blue shadow-lg cursor-pointer hover:bg-armath-blue/5 transition-colors"
                      style={{ 
                        width: dotSize, 
                        height: dotSize,
                        boxShadow: '0 2px 10px rgba(59, 130, 246, 0.2)'
                      }}
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
                          <Card className="shadow-xl border-armath-blue/20 backdrop-blur-sm">
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
    </div>
  )
}

type OrbitProps = { 
  radius: number
  delay: number
  dashed?: boolean
  tiltDeg?: number
  index: number
}

const Orbit: React.FC<OrbitProps> = ({ radius, delay, dashed, tiltDeg = 0, index }) => {
  const reduceMotion = useReducedMotion()
  
  return (
    <motion.div
      aria-hidden
      className="absolute"
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
      animate={reduceMotion ? {} : { scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.8 }}
    >
      <motion.div
        className={`rounded-full border ${dashed ? "border-dashed border-armath-blue/15" : "border-armath-blue/25"}`}
        style={{ 
          width: radius * 2, 
          height: radius * 2,
          transform: `rotateX(${tiltDeg}deg)`,
          boxShadow: dashed ? 'none' : `0 0 ${15 + index * 5}px rgba(59, 130, 246, 0.08)`,
        }}
      />
    </motion.div>
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
  direction: number
  tiltDeg: number
}

const Electron: React.FC<ElectronProps> = ({
  supporter,
  orbitRadius,
  duration,
  startingAngle,
  activeId,
  setActiveId,
  size,
  direction,
  tiltDeg,
}) => {
  const reduceMotion = useReducedMotion()
  const isActive = activeId === supporter.id
  const tipId = `tip-${supporter.id}`

  const transition = useMemo(() => {
    if (reduceMotion) return undefined
    return { duration, ease: "linear" as const, repeat: Number.POSITIVE_INFINITY as number }
  }, [duration, reduceMotion])

  const initials = useMemo(() => getInitials(supporter.name), [supporter.name])
  
  const rotateEnd = startingAngle + (360 * direction)

  return (
    <motion.div
      className="absolute"
      style={{ 
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{ 
          transform: `translate(-50%, -50%) rotateX(${tiltDeg}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          style={{ transform: "translate(-50%, -50%)" }}
          initial={{ rotate: startingAngle }}
          animate={reduceMotion ? { rotate: startingAngle } : { rotate: rotateEnd }}
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
              whileHover={reduceMotion ? undefined : { scale: 1.15, zIndex: 40 }}
            >
              <motion.div
                className="relative"
                style={{ transform: `rotateX(${-tiltDeg}deg)` }}
                initial={{ rotate: -startingAngle }}
                animate={reduceMotion ? { rotate: -startingAngle } : { rotate: -rotateEnd }}
                transition={reduceMotion ? { duration: 0 } : transition}
              >
                {/* Electron trail/glow effect */}
                <motion.div
                  className="absolute rounded-full bg-armath-red/30 blur-md"
                  style={{ 
                    width: size * 1.8, 
                    height: size * 1.8,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={reduceMotion ? {} : {
                    scale: [1, 1.2, 1],
                    opacity: [ATOM_CONFIG.ELECTRON_TRAIL_OPACITY, ATOM_CONFIG.ELECTRON_TRAIL_OPACITY * 0.5, ATOM_CONFIG.ELECTRON_TRAIL_OPACITY],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                
                {/* Active state glow */}
                <motion.div
                  className="absolute rounded-full bg-armath-red/50 blur-lg"
                  style={{ 
                    width: size * 2.2, 
                    height: size * 2.2,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: isActive ? 0.8 : 0, 
                    scale: isActive ? 1.2 : 0.8 
                  }}
                  transition={{ duration: 0.2 }}
                />
                
                {/* Main electron body */}
                <div
                  className="relative flex items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-armath-red to-red-600 text-sm font-bold text-white cursor-pointer hover:from-armath-red/90 hover:to-red-500 transition-colors"
                  style={{ 
                    width: size, 
                    height: size,
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4), inset 0 1px 2px rgba(255,255,255,0.3)'
                  }}
                >
                  {/* Inner highlight */}
                  <div 
                    className="absolute inset-1 rounded-full opacity-20"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 50%)',
                    }}
                  />
                  <span className="relative z-10">{initials}</span>
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
                      <Card className="min-w-max max-w-[200px] sm:max-w-none border-armath-red/20 bg-white/95 backdrop-blur-sm shadow-xl">
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
      </motion.div>
    </motion.div>
  )
}

// --- Legend Component ---
const Legend: React.FC = () => {
  const { t } = useLanguage()
  return (
    <motion.div 
      className="mt-6 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      <p className="text-sm font-medium text-gray-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-armath-blue to-blue-600 shadow-sm" />
          {t("coreTeam")} ({t("nucleus")})
        </span>
        <span className="mx-3 text-gray-300">•</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-armath-red to-red-600 shadow-sm" />
          {t("supporters")} ({t("orbitingElectrons")})
        </span>
      </p>
    </motion.div>
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

  useEscapeKey(() => setActiveMemberId(null))

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
    const isSmall = shortest < ATOM_CONFIG.SIZE_THRESHOLDS.small
    const isTiny = shortest < ATOM_CONFIG.SIZE_THRESHOLDS.tiny

    const computedNucleusDiameter = Math.max(
      ATOM_CONFIG.MIN_NUCLEUS_DIAMETER,
      shortest * (isTiny ? 0.42 : isSmall ? 0.38 : 0.28)
    )

    const baseRadius = shortest / 2
    const innerOrbit = Math.max(
      computedNucleusDiameter * ATOM_CONFIG.MIN_ORBIT_RADIUS_MULTIPLIER,
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
        { radius: innerOrbit, duration: 18, direction: 1, tiltDeg: 65 },
        { radius: outerOrbit, duration: 28, direction: -1, tiltDeg: 72 },
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
        style={{ perspective: '1200px' }}
      >
        {/* Background ambient glow */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 60%)',
          }}
        />
        
        {/* Nucleus */}
        <Nucleus
          diameter={nucleusDiameter}
          coreMembers={coreMembers}
          activeId={activeMemberId}
          setActiveId={setActiveMemberId}
        />

        {/* Orbits with 3D tilt */}
        {orbits.map((o, i) => (
          <Orbit 
            key={i} 
            radius={o.radius} 
            delay={0.8 + i * 0.2} 
            dashed={i === orbits.length - 1}
            tiltDeg={o.tiltDeg}
            index={i}
          />
        ))}

        {/* Electrons with counter-rotation and trails */}
        {supporters.length > 0 &&
          supporters.map((supporter, index) => {
            const orbit = orbits[index % orbits.length]
            const startingAngle = index * ATOM_CONFIG.GOLDEN_ANGLE
            return (
              <Electron
                key={supporter.id}
                supporter={supporter}
                orbitRadius={orbit.radius}
                duration={orbit.duration}
                startingAngle={startingAngle}
                activeId={activeMemberId}
                setActiveId={setActiveMemberId}
                size={electronSize}
                direction={orbit.direction}
                tiltDeg={orbit.tiltDeg}
              />
            )
          })}
      </div>

      {/* Legend */}
      <Legend />
    </div>
  )
}
