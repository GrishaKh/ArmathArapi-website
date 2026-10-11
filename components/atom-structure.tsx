"use client"

import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from "framer-motion"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import type React from "react"
import { useLanguage } from "@/contexts/language-context"
import { type TranslationKey } from "@/lib/translations"
import { getAtomLayout, getTooltipPosition, advanceOrbit } from "@/lib/atom-layout"

interface TeamMember {
  id: string
  name: string
  role: string
  isCore: boolean
  contribution?: string
  details?: string
  image?: string
}

// Team profiles share the existing translated names, roles, and descriptions.
const getTeamMembers = (t: (key: TranslationKey) => string): TeamMember[] => [
  {
    id: "grisha-kh",
    name: t("nameGrishaKh"),
    role: t("roleLeadCoach"),
    isCore: true,
    details: t("detailsLead"),
    image: "/team/grisha_khachatryan.jpg",
  },
  {
    id: "olya-kh",
    name: t("nameOlyaKh"),
    role: t("roleCoach"),
    isCore: true,
    details: t("detailsCoach"),
    image: "/team/olya_khachatryan.jpg",
  },
  {
    id: "narek-sar",
    name: t("nameNarekSar"),
    role: t("roleCoach"),
    isCore: true,
    details: t("detailsCoach"),
    image: "/team/narek_saroyan.jpg",
  },
  {
    id: "edgar-har",
    name: t("nameEdgarHar"),
    role: t("roleSupporter"),
    isCore: false,
    contribution: t("contributionScientific"),
    image: "/team/edgar_harutyunyan.jpg",
  },
  {
    id: "hayk_sar",
    name: t("nameHaykSar"),
    role: t("roleSupporter"),
    isCore: false,
    contribution: t("contributionWeb"),
    image: "/team/hayk_sarafyan.jpg",
  },
]


const subscribeTouch = (callback: () => void) => {
  const query = window.matchMedia("(pointer: coarse)")
  query.addEventListener("change", callback)
  return () => query.removeEventListener("change", callback)
}
const touchSnapshot = () => window.matchMedia("(pointer: coarse)").matches
const serverSnapshot = () => false
const initials = (name: string) => name.trim().split(/\s+/).map(word => word[0]).join("").toUpperCase()

function Profile({ member, compact = false }: { member: TeamMember; compact?: boolean }) {
  return <div className="rounded-2xl bg-white p-5 text-center shadow-2xl border border-slate-100">
    <div className={`h-1.5 w-16 mx-auto mb-5 rounded-full ${member.isCore ? "bg-armath-blue" : "bg-armath-red"}`} />
    {member.image && <Image src={member.image} alt="" width={compact ? 64 : 96} height={compact ? 64 : 96} className={`mx-auto mb-4 rounded-full object-cover ${compact ? "h-16 w-16" : "h-24 w-24"}`} />}
    <h3 id={`profile-name-${member.id}`} className="text-lg font-bold text-gray-900">{member.name}</h3>
    <p className="mt-1 text-sm font-semibold text-armath-teal">{member.role}</p>
    <p className="mt-3 text-sm leading-relaxed text-gray-600">{member.details ?? member.contribution}</p>
  </div>
}

function Tooltip({ member, anchor, onEnter, onLeave }: {
  member: TeamMember; anchor: React.RefObject<HTMLButtonElement | null>; onEnter: () => void; onLeave: () => void
}) {
  const panel = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 8, y: 8 })
  const reduceMotion = useReducedMotion()
  useLayoutEffect(() => {
    const update = () => {
      if (!anchor.current || !panel.current) return
      const next = getTooltipPosition(anchor.current.getBoundingClientRect(), panel.current.offsetWidth,
        panel.current.offsetHeight, window.innerWidth, window.innerHeight)
      setPosition(prev => prev.x === next.x && prev.y === next.y ? prev : next)
    }
    update()
    const observer = new ResizeObserver(update)
    if (panel.current) observer.observe(panel.current)
    if (anchor.current) observer.observe(anchor.current)
    window.addEventListener("resize", update)
    window.addEventListener("scroll", update, true)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
      window.removeEventListener("scroll", update, true)
    }
  }, [anchor])
  return createPortal(<div ref={panel} id={`tip-${member.id}`} role="tooltip" data-atom-profile="true"
    onMouseEnter={onEnter} onMouseLeave={onLeave}
    className="fixed z-[9999] w-[280px] max-w-[calc(100vw-16px)] max-h-[calc(100dvh-16px)] overflow-y-auto rounded-2xl"
    style={{ left: position.x, top: position.y }}>
    <motion.div initial={reduceMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
      <Profile member={member} compact />
    </motion.div>
  </div>, document.body)
}

function MobileProfileSheet({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const { t } = useLanguage()
  const reduceMotion = useReducedMotion()
  useLayoutEffect(() => {
    const element = dialog.current
    if (!element) return
    const opener = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = "hidden"
    return () => {
      element.close()
      document.body.style.overflow = overflow
      if (opener?.isConnected) opener.focus()
    }
  }, [])
  return createPortal(<dialog ref={dialog} aria-modal="true" aria-labelledby={`profile-name-${member.id}`}
    className="fixed inset-x-0 top-auto bottom-0 m-0 w-full max-w-none max-h-[90dvh] overflow-y-auto rounded-t-3xl border-0 bg-white p-0 backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => { if (event.target === event.currentTarget) {
      const bounds = event.currentTarget.getBoundingClientRect()
      if (event.clientY < bounds.top || event.clientY > bounds.bottom || event.clientX < bounds.left || event.clientX > bounds.right) onClose()
    } }}>
    <motion.div initial={reduceMotion ? false : { y: 80 }} animate={{ y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }} className="relative pt-14 pb-6 px-4">
      <button type="button" autoFocus onClick={onClose} aria-label={t("close")}
        className="absolute right-3 top-2 flex h-11 w-11 items-center justify-center rounded-full text-2xl text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-armath-teal">×</button>
      <Profile member={member} />
    </motion.div>
  </dialog>, document.body)
}

function MemberButton({ member, active, isTouch, onHover, onLeave, onFocus, onBlur, onSelect, size }: {
  member: TeamMember; active: boolean; isTouch: boolean; size: number;
  onHover: () => void; onLeave: () => void; onFocus: () => void; onBlur: () => void; onSelect: () => void
}) {
  const anchor = useRef<HTMLButtonElement>(null)
  return <>
    <button ref={anchor} type="button" data-atom-member-button="true" data-member-id={member.id}
      aria-label={`${member.name}, ${member.role}`} aria-describedby={!isTouch && active ? `tip-${member.id}` : undefined}
      aria-haspopup={isTouch ? "dialog" : undefined} aria-expanded={isTouch ? active : undefined}
      onMouseEnter={() => { if (!isTouch) onHover() }} onMouseLeave={() => { if (!isTouch) onLeave() }}
      onFocus={onFocus} onBlur={onBlur} onClick={onSelect}
      className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-armath-teal">
      <span className={`flex items-center justify-center rounded-full border-2 shadow-md text-xs font-bold ${member.isCore ? "border-armath-blue/20 bg-white text-armath-teal" : "border-white bg-armath-red text-white"}`}
        style={{ width: size, height: size }}>{initials(member.name)}</span>
    </button>
    {!isTouch && active && <Tooltip member={member} anchor={anchor} onEnter={onHover} onLeave={onLeave} />}
  </>
}

function Electron({ radius, duration, startingAngle, paused, children }: {
  radius: number; duration: number; startingAngle: number; paused: boolean; children: React.ReactNode
}) {
  const angle = useMotionValue(startingAngle)
  const counterAngle = useTransform(angle, value => -value)
  const reduceMotion = useReducedMotion()
  useAnimationFrame((_, delta) => {
    angle.set(advanceOrbit(angle.get(), delta, duration, paused || !!reduceMotion))
  })
  return <motion.div className="absolute left-1/2 top-1/2 z-30" style={{ rotate: angle }}>
    <div className="absolute" style={{ left: radius, transform: "translate(-50%, -50%)" }}>
      <motion.div style={{ rotate: counterAngle }}>{children}</motion.div>
    </div>
  </motion.div>
}

export function AtomStructure() {
  const { t } = useLanguage()
  const team = useMemo(() => getTeamMembers(t), [t])
  const core = team.filter(member => member.isCore)
  const supporters = team.filter(member => !member.isCore)
  const scene = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(320)
  const [hovered, setHovered] = useState<string | null>(null)
  const [focused, setFocused] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const [mobile, setMobile] = useState<string | null>(null)
  const [userPaused, setUserPaused] = useState(false)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTouch = useSyncExternalStore(subscribeTouch, touchSnapshot, serverSnapshot)
  const reduceMotion = useReducedMotion()
  const active = isTouch ? mobile : pinned ?? focused ?? hovered
  const layout = getAtomLayout(size, core.length)
  const clearTimer = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
  }, [])
  const close = useCallback(() => {
    clearTimer(); setHovered(null); setFocused(null); setPinned(null); setMobile(null)
  }, [clearTimer])
  useLayoutEffect(() => {
    if (!scene.current) return
    const observer = new ResizeObserver(([entry]) => {
      setSize(Math.min(entry.contentRect.width, entry.contentRect.height))
    })
    observer.observe(scene.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => { if (event.key === "Escape") close() }
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest('[data-atom-member-button], [data-atom-profile], dialog')) close()
    }
    window.addEventListener("keydown", keyboard)
    window.addEventListener("pointerdown", outside)
    return () => {
      clearTimer()
      window.removeEventListener("keydown", keyboard)
      window.removeEventListener("pointerdown", outside)
    }
  }, [close, clearTimer])
  const button = (member: TeamMember) => <MemberButton member={member} active={active === member.id} isTouch={isTouch}
    size={member.isCore ? layout.coreSize : layout.electronSize}
    onHover={() => { clearTimer(); setHovered(member.id) }}
    onLeave={() => { clearTimer(); leaveTimer.current = setTimeout(() => setHovered(null), 160) }}
    onFocus={() => { if (!isTouch) setFocused(member.id) }} onBlur={() => setFocused(null)}
    onSelect={() => {
      clearTimer(); setHovered(null); setFocused(null)
      if (isTouch) setMobile(prev => prev === member.id ? null : member.id)
      else setPinned(prev => prev === member.id ? null : member.id)
    }} />
  const mobileMember = team.find(member => member.id === mobile)
  return <div className="w-full pb-8">
    <div ref={scene} className="relative mx-auto flex h-[clamp(20rem,65vw,28rem)] max-w-full items-center justify-center touch-pan-y">
      <div className="relative z-20 rounded-full bg-gradient-to-br from-armath-blue to-armath-blue/80 border-4 border-white shadow-xl"
        style={{ width: layout.nucleusDiameter, height: layout.nucleusDiameter }}>
        {core.map((member, index) => {
          const angle = (360 / core.length * index - 90) * Math.PI / 180
          return <div key={member.id} className="absolute" style={{ left: "50%", top: "50%",
            transform: `translate(calc(-50% + ${Math.cos(angle) * layout.coreRadius}px), calc(-50% + ${Math.sin(angle) * layout.coreRadius}px))` }}>{button(member)}</div>
        })}
      </div>
      {[layout.innerOrbit, layout.outerOrbit].map((radius, index) => <div key={index} aria-hidden="true"
        className={`absolute rounded-full border border-armath-blue/20 pointer-events-none ${index ? "border-dashed" : ""}`}
        style={{ width: radius * 2, height: radius * 2 }} />)}
      {supporters.map((member, index) => <Electron key={member.id} radius={index % 2 ? layout.outerOrbit : layout.innerOrbit}
        duration={index % 2 ? 25 : 20} startingAngle={index * 137.5}
        paused={userPaused || active !== null}>{button(member)}</Electron>)}
    </div>
    <p className="mt-4 text-center text-sm font-medium text-gray-600">
      <span className="text-armath-teal">●</span> {t("coreTeam")} ({t("nucleus")}) · {" "}
      <span className="text-armath-red">●</span> {t("supporters")} ({t("orbitingElectrons")})
    </p>
    {!reduceMotion && <div className="mt-3 text-center"><button type="button" aria-pressed={userPaused}
      onClick={() => setUserPaused(value => !value)} className="min-h-11 rounded-lg px-4 text-sm text-armath-teal underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-armath-teal">
      {t(userPaused ? "resumeAtomMotion" : "pauseAtomMotion")}
    </button></div>}
    {isTouch && mobileMember && <MobileProfileSheet key={mobileMember.id} member={mobileMember} onClose={close} />}
  </div>
}
