"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, Pause, Play, RotateCcw, SkipForward } from "lucide-react"
import {
  PRESETS,
  fire,
  fireableActors,
  initialTokens,
  isFireable,
  repetitionVector,
  staticSchedule,
  type Graph,
  type TokenState,
} from "./engine"

/* ------------------------------------------------------------------ */
/* Geometry — everything is computed analytically from the bezier so   */
/* token pulses need no DOM measurement.                                */
/* ------------------------------------------------------------------ */

const R = 34 // actor radius
const PULSE_MS = 640
const VIEW_W = 740
const VIEW_H = 350

type Pt = { x: number; y: number }

interface EdgeGeo {
  p0: Pt
  c: Pt
  p2: Pt
  mid: Pt
  midNorm: Pt // unit normal at midpoint
  endAngle: number // degrees, tangent at p2
}

const sub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y })
const len = (p: Pt) => Math.hypot(p.x, p.y) || 1
const norm = (p: Pt): Pt => ({ x: p.x / len(p), y: p.y / len(p) })

function bezier(g: EdgeGeo, t: number): Pt {
  const it = 1 - t
  return {
    x: it * it * g.p0.x + 2 * it * t * g.c.x + t * t * g.p2.x,
    y: it * it * g.p0.y + 2 * it * t * g.c.y + t * t * g.p2.y,
  }
}

function edgeGeometry(from: Pt, to: Pt, bend: number): EdgeGeo {
  const u = norm(sub(to, from))
  const perp = { x: -u.y, y: u.x }
  const mid0 = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 }
  const c = { x: mid0.x + perp.x * bend, y: mid0.y + perp.y * bend }
  const dirStart = norm(sub(c, from))
  const dirEnd = norm(sub(c, to))
  const p0 = { x: from.x + dirStart.x * R, y: from.y + dirStart.y * R }
  const p2 = { x: to.x + dirEnd.x * R, y: to.y + dirEnd.y * R }
  const geo: EdgeGeo = { p0, c, p2, mid: { x: 0, y: 0 }, midNorm: { x: 0, y: 0 }, endAngle: 0 }
  geo.mid = bezier(geo, 0.5)
  const tan = { x: 2 * (geo.p2.x - geo.c.x), y: 2 * (geo.p2.y - geo.c.y) }
  geo.endAngle = (Math.atan2(tan.y, tan.x) * 180) / Math.PI
  const mtan = norm({ x: geo.c.x - geo.p0.x, y: geo.c.y - geo.p0.y })
  geo.midNorm = { x: -mtan.y, y: mtan.x }
  return geo
}

/* ------------------------------------------------------------------ */
/* The Signal Bench                                                     */
/* ------------------------------------------------------------------ */

interface Pulse {
  id: number
  ch: string
  born: number
}

function SignalBench({
  presetId,
  onPresetChange,
  benchRef,
}: {
  presetId: string
  onPresetChange: (id: string) => void
  benchRef: React.RefObject<HTMLDivElement | null>
}) {
  const reduce = useReducedMotion()
  const base = useMemo(() => PRESETS.find((p) => p.id === presetId) ?? PRESETS[0], [presetId])
  const [delay, setDelay] = useState(1) // initial tokens on the feedback edge

  // Effective graph: the feedback preset's cycle delay is user-controlled.
  const graph: Graph = useMemo(() => {
    if (base.id !== "feedback") return base
    return {
      ...base,
      channels: base.channels.map((c) => (c.id === "QP" ? { ...c, initial: delay } : c)),
    }
  }, [base, delay])

  const [tokens, setTokens] = useState<TokenState>(() => initialTokens(graph))
  const [pulses, setPulses] = useState<Pulse[]>([])
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(620)
  const [totalFired, setTotalFired] = useState(0)
  const [periodFired, setPeriodFired] = useState<Record<string, number>>({})
  const [flash, setFlash] = useState<{ id: string; kind: "fire" | "block" } | null>(null)
  const [blockedCh, setBlockedCh] = useState<string[]>([])
  const [status, setStatus] = useState<"idle" | "running" | "deadlock">("idle")
  const pulseSeq = useRef(0)
  const [now, setNow] = useState(0)

  // Mirrors of state for synchronous reads inside the run loop, so we never
  // nest setState updaters.
  const tokensRef = useRef(tokens)
  const periodRef = useRef(periodFired)
  useEffect(() => {
    tokensRef.current = tokens
  }, [tokens])
  useEffect(() => {
    periodRef.current = periodFired
  }, [periodFired])

  const q = useMemo(() => repetitionVector(graph), [graph])
  const schedule = useMemo(() => staticSchedule(graph), [graph])

  const geos = useMemo(() => {
    const map: Record<string, EdgeGeo> = {}
    for (const c of graph.channels) {
      const f = graph.actors.find((a) => a.id === c.from) as (typeof graph.actors)[number]
      const t = graph.actors.find((a) => a.id === c.to) as (typeof graph.actors)[number]
      map[c.id] = edgeGeometry({ x: f.x, y: f.y }, { x: t.x, y: t.y }, c.bend)
    }
    return map
  }, [graph])

  const reset = useCallback(() => {
    const fresh = initialTokens(graph)
    tokensRef.current = fresh
    periodRef.current = {}
    setTokens(fresh)
    setPulses([])
    setRunning(false)
    setTotalFired(0)
    setPeriodFired({})
    setFlash(null)
    setBlockedCh([])
    setStatus("idle")
  }, [graph])

  // Re-arm whenever the graph (preset / delay) changes.
  useEffect(() => {
    reset()
  }, [reset])

  const doFire = useCallback(
    (actorId: string): boolean => {
      const cur = tokensRef.current
      if (!isFireable(graph, actorId, cur)) return false
      const res = fire(graph, actorId, cur)
      tokensRef.current = res.tokens
      setTokens(res.tokens)
      if (!reduce && res.filled.length) {
        const spawned: Pulse[] = []
        for (const ch of res.filled) {
          const c = graph.channels.find((x) => x.id === ch)
          const count = Math.min(c ? c.prod : 1, 6)
          for (let i = 0; i < count; i++) {
            spawned.push({ id: pulseSeq.current++, ch, born: performance.now() + i * 90 })
          }
        }
        setPulses((p) => [...p, ...spawned])
      }
      const np = { ...periodRef.current, [actorId]: (periodRef.current[actorId] ?? 0) + 1 }
      periodRef.current = np
      setPeriodFired(np)
      setTotalFired((n) => n + 1)
      setFlash({ id: actorId, kind: "fire" })
      window.setTimeout(() => setFlash((f) => (f?.id === actorId ? null : f)), 280)
      return true
    },
    [graph, reduce],
  )

  const rejectFire = useCallback(
    (actorId: string) => {
      const deficient = graph.channels
        .filter((c) => c.to === actorId && tokens[c.id] < c.cons)
        .map((c) => c.id)
      setFlash({ id: actorId, kind: "block" })
      setBlockedCh(deficient)
      window.setTimeout(() => {
        setFlash((f) => (f?.id === actorId ? null : f))
        setBlockedCh([])
      }, 820)
    },
    [graph, tokens],
  )

  // One schedule-aware firing: keeps a bounded, balanced period going.
  const step = useCallback((): boolean => {
    if (!q) return false
    const cur = tokensRef.current
    const period = periodRef.current
    const done = graph.actors.every((a) => (period[a.id] ?? 0) >= q[a.id])
    if (done) {
      periodRef.current = {}
      setPeriodFired({})
    }
    const pick = graph.actors.find(
      (a) => (done ? 0 : period[a.id] ?? 0) < q[a.id] && isFireable(graph, a.id, cur),
    )
    if (!pick) {
      setStatus("deadlock")
      setRunning(false)
      return false
    }
    return doFire(pick.id)
  }, [graph, q, doFire])

  // Auto-run loop.
  useEffect(() => {
    if (!running) return
    setStatus("running")
    const iv = window.setInterval(() => {
      if (!step()) window.clearInterval(iv)
    }, speed)
    return () => window.clearInterval(iv)
  }, [running, speed, step])

  // Pulse animation clock — runs only while pulses are in flight.
  useEffect(() => {
    if (pulses.length === 0 || reduce) return
    let raf = 0
    const tick = () => {
      const t = performance.now()
      setNow(t)
      setPulses((p) => p.filter((pl) => t - pl.born < PULSE_MS))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [pulses.length, reduce])

  const enabled = fireableActors(graph, tokens)
  const isDeadlock = status === "deadlock" || (enabled.length === 0 && totalFired > 0)

  return (
    <div ref={benchRef} className="instrument grain relative scroll-mt-24 rounded-[2px]">
      {/* instrument header strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--ink)] px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="bench-mono text-[0.7rem] tracking-[0.3em] text-[var(--graphite)]">
            SIGNAL&nbsp;BENCH
          </span>
          <span
            className={`bench-mono text-[0.7rem] tracking-[0.2em] ${
              isDeadlock ? "text-[var(--delay)] bench-blink" : "text-[var(--signal)]"
            }`}
          >
            ● {isDeadlock ? "DEADLOCK" : status === "running" ? "LIVE" : "READY"}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="btn-bench rounded-[2px] px-3 py-1.5"
              data-active={p.id === presetId}
              onClick={() => onPresetChange(p.id)}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <p className="bench-mono border-b border-dashed border-[var(--rule)] px-5 py-2 text-[0.78rem] text-[var(--graphite)]">
        {graph.blurb}
      </p>

      {/* the scope */}
      <div className="instrument-screen relative overflow-hidden">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="block w-full"
          role="img"
          aria-label={`Dataflow graph: ${graph.name}`}
        >
          <defs>
            <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3.4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* channels */}
          {graph.channels.map((c) => {
            const g = geos[c.id]
            const blocked = blockedCh.includes(c.id)
            const hasTokens = tokens[c.id] > 0
            const labelP = bezier(g, c.bend === 0 ? 0.5 : 0.5)
            const off = c.bend === 0 ? -22 : c.bend < 0 ? -20 : 20
            return (
              <g key={c.id}>
                <path
                  d={`M ${g.p0.x} ${g.p0.y} Q ${g.c.x} ${g.c.y} ${g.p2.x} ${g.p2.y}`}
                  fill="none"
                  stroke={blocked ? "var(--delay)" : hasTokens ? "var(--signal)" : "var(--rule)"}
                  strokeWidth={blocked ? 3 : 2}
                  strokeDasharray={hasTokens ? "0" : "5 5"}
                  className="transition-[stroke] duration-300"
                />
                {/* arrowhead */}
                <polygon
                  points="0,-6 12,0 0,6"
                  fill={blocked ? "var(--delay)" : hasTokens ? "var(--signal)" : "var(--graphite)"}
                  transform={`translate(${g.p2.x} ${g.p2.y}) rotate(${g.endAngle})`}
                  className="transition-[fill] duration-300"
                />
                {/* production / consumption rates */}
                <RateTag pt={bezier(g, 0.16)} value={c.prod} kind="prod" />
                <RateTag pt={bezier(g, 0.84)} value={c.cons} kind="cons" />
                {/* delay marker */}
                {c.initial > 0 && (
                  <g transform={`translate(${g.c.x} ${g.c.y})`}>
                    <rect
                      x={-26}
                      y={-13}
                      width={52}
                      height={26}
                      rx={3}
                      fill="var(--delay-soft)"
                      stroke="var(--delay)"
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      className="bench-mono"
                      fontSize="12"
                      fill="var(--delay)"
                    >
                      z⁻¹·{c.initial}
                    </text>
                  </g>
                )}
                {/* token buffer count */}
                <g
                  transform={`translate(${labelP.x + g.midNorm.x * off} ${
                    labelP.y + g.midNorm.y * off
                  })`}
                >
                  <motion.g
                    key={`${c.id}-${tokens[c.id]}`}
                    initial={{ scale: reduce ? 1 : 0.55 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 420, damping: 18 }}
                  >
                    <circle
                      r={15}
                      fill="#fffefb"
                      stroke={tokens[c.id] > 0 ? "var(--signal)" : "var(--rule)"}
                      strokeWidth={2}
                    />
                    <text
                      textAnchor="middle"
                      dy="4.5"
                      className="bench-mono"
                      fontSize="14"
                      fontWeight="600"
                      fill={tokens[c.id] > 0 ? "#0a6970" : "var(--graphite)"}
                    >
                      {tokens[c.id]}
                    </text>
                  </motion.g>
                </g>
              </g>
            )
          })}

          {/* token pulses */}
          {!reduce &&
            pulses.map((pl) => {
              const g = geos[pl.ch]
              if (!g) return null
              const t = Math.min(Math.max((now - pl.born) / PULSE_MS, 0), 1)
              if (t <= 0) return null
              const pos = bezier(g, t)
              return (
                <circle
                  key={pl.id}
                  cx={pos.x}
                  cy={pos.y}
                  r={6}
                  fill="var(--signal)"
                  filter="url(#glow)"
                  opacity={t > 0.9 ? (1 - t) * 10 : 1}
                />
              )
            })}

          {/* actors */}
          {graph.actors.map((a) => {
            const fireOk = enabled.includes(a.id)
            const isFlash = flash?.id === a.id
            return (
              <g
                key={a.id}
                transform={`translate(${a.x} ${a.y})`}
                className={`cursor-pointer ${
                  isFlash && flash?.kind === "block" ? "bench-shake" : ""
                }`}
                onClick={() => (fireOk ? doFire(a.id) : rejectFire(a.id))}
              >
                {fireOk && (
                  <motion.circle
                    r={R + 7}
                    fill="none"
                    stroke="var(--signal)"
                    strokeWidth={1.5}
                    initial={{ opacity: 0.55, scale: 0.94 }}
                    animate={reduce ? { opacity: 0.5 } : { opacity: [0.55, 0, 0.55], scale: [0.94, 1.12, 0.94] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <circle
                  r={R}
                  fill={
                    isFlash && flash?.kind === "fire"
                      ? "var(--signal)"
                      : isFlash && flash?.kind === "block"
                        ? "var(--delay-soft)"
                        : "#fffefb"
                  }
                  stroke={
                    isFlash && flash?.kind === "block"
                      ? "var(--delay)"
                      : fireOk
                        ? "var(--signal)"
                        : "var(--ink)"
                  }
                  strokeWidth={2}
                  className="transition-[fill,stroke] duration-200"
                />
                <text
                  textAnchor="middle"
                  dy="-2"
                  className="bench-display select-none"
                  fontSize="16"
                  fontWeight="600"
                  fill={isFlash && flash?.kind === "fire" ? "#04343a" : "var(--ink)"}
                >
                  {a.label}
                </text>
                <text
                  textAnchor="middle"
                  dy="14"
                  className="bench-mono select-none"
                  fontSize="9.5"
                  fill={isFlash && flash?.kind === "fire" ? "#04343a" : "var(--graphite)"}
                >
                  ×{periodFired[a.id] ?? 0}
                </text>
              </g>
            )
          })}
        </svg>

        <p className="bench-mono pointer-events-none absolute bottom-2 left-3 text-[0.66rem] text-[var(--graphite)]/70">
          click an actor to fire it
        </p>
      </div>

      {/* controls */}
      <div className="flex flex-wrap items-center gap-2 border-t border-[var(--ink)] px-5 py-3">
        <button
          type="button"
          className="btn-bench inline-flex items-center gap-1.5 rounded-[2px] px-3 py-2"
          data-tone="signal"
          data-active={running}
          onClick={() => setRunning((r) => !r)}
          disabled={!q}
        >
          {running ? <Pause size={14} /> : <Play size={14} />}
          {running ? "Pause" : "Run"}
        </button>
        <button
          type="button"
          className="btn-bench inline-flex items-center gap-1.5 rounded-[2px] px-3 py-2"
          onClick={() => step()}
          disabled={running || !q}
        >
          <SkipForward size={14} /> Step
        </button>
        <button
          type="button"
          className="btn-bench inline-flex items-center gap-1.5 rounded-[2px] px-3 py-2"
          onClick={reset}
        >
          <RotateCcw size={14} /> Reset
        </button>

        <label className="bench-mono ml-1 flex items-center gap-2 text-[0.72rem] text-[var(--graphite)]">
          RATE
          <input
            type="range"
            min={140}
            max={1100}
            step={20}
            value={1240 - speed}
            onChange={(e) => setSpeed(1240 - Number(e.target.value))}
            className="h-1 w-24 cursor-pointer accent-[var(--signal)]"
          />
        </label>

        {base.id === "feedback" && (
          <label className="bench-mono ml-auto flex items-center gap-2 text-[0.72rem] text-[var(--delay)]">
            DELAY z⁻¹
            <button
              type="button"
              className="btn-bench rounded-[2px] px-2.5 py-1"
              data-active={delay > 0}
              onClick={() => setDelay((d) => (d > 0 ? 0 : 1))}
            >
              {delay > 0 ? "1 token" : "0 — off"}
            </button>
          </label>
        )}
      </div>

      {/* readouts */}
      <div className="grid gap-px border-t border-[var(--ink)] bg-[var(--ink)] sm:grid-cols-3">
        <Readout label="Repetition vector q">
          {q ? (
            <span className="bench-mono">
              {graph.actors.map((a, i) => (
                <span key={a.id}>
                  {i > 0 && <span className="text-[var(--rule)]"> · </span>}
                  <span className="text-[var(--ink)]">{a.label}</span>
                  <sup className="text-[var(--signal)]">{q[a.id]}</sup>
                </span>
              ))}
            </span>
          ) : (
            <span className="bench-mono text-[var(--delay)]">inconsistent — unbounded</span>
          )}
        </Readout>
        <Readout label="One static period (PASS)">
          {schedule.ok ? (
            <span className="bench-mono text-[0.82rem] text-[var(--ink)]">
              {schedule.sequence.join(" → ")}
            </span>
          ) : (
            <span className="bench-mono text-[0.78rem] text-[var(--delay)]">
              {schedule.reason}
            </span>
          )}
        </Readout>
        <Readout label="Firings / enabled now">
          <span className="bench-mono text-[var(--ink)]">
            {totalFired}
            <span className="text-[var(--rule)]"> · </span>
            {enabled.length ? (
              <span className="text-[var(--signal)]">{enabled.join(" ")}</span>
            ) : (
              <span className="text-[var(--delay)]">none — starved</span>
            )}
          </span>
        </Readout>
      </div>
    </div>
  )
}

function RateTag({ pt, value, kind }: { pt: Pt; value: number; kind: "prod" | "cons" }) {
  if (value === 1) return null
  return (
    <g transform={`translate(${pt.x} ${pt.y})`}>
      <rect x={-12} y={-10} width={24} height={20} rx={3} fill="#fffefb" stroke="var(--graphite)" />
      <text
        textAnchor="middle"
        dy="4"
        className="bench-mono"
        fontSize="11"
        fontWeight="600"
        fill={kind === "prod" ? "#0a6970" : "var(--ink)"}
      >
        {value}
      </text>
    </g>
  )
}

function Readout({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#fffefb] px-4 py-3">
      <p className="bench-mono mb-1 text-[0.62rem] uppercase tracking-[0.18em] text-[var(--graphite)]">
        {label}
      </p>
      <div className="text-sm">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                 */
/* ------------------------------------------------------------------ */

function SectionNo({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-5 flex items-baseline gap-4">
      <span className="bench-tag shrink-0">§{n}</span>
      <h2 className="bench-display text-2xl font-semibold sm:text-3xl">{title}</h2>
    </div>
  )
}

const reveal = {
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.55, ease: "easeOut" as const },
}

export default function MarkedGraphsPage() {
  const [presetId, setPresetId] = useState("pipeline")
  const benchRef = useRef<HTMLDivElement>(null)

  const load = useCallback((id: string) => {
    setPresetId(id)
    requestAnimationFrame(() =>
      benchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    )
  }, [])

  return (
    <main className="relative min-h-screen">
      {/* top bar */}
      <div className="sticky top-0 z-50 border-b border-[var(--ink)] bg-[var(--paper)]/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <Link
            href="/"
            className="bench-mono inline-flex items-center gap-2 text-[0.78rem] text-[var(--graphite)] transition-colors hover:text-[var(--ink)]"
          >
            <ArrowLeft size={14} /> Armath Arapi
          </Link>
          <span className="bench-tag">Field Note · Dataflow</span>
        </div>
      </div>

      {/* masthead */}
      <header className="mx-auto max-w-5xl px-5 pb-10 pt-16 sm:pt-24">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bench-tag mb-6"
        >
          Marked&nbsp;Graph&nbsp;Theory — Interactive
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bench-display max-w-3xl text-[2.6rem] font-semibold leading-[1.04] sm:text-6xl"
        >
          Programs that run when the&nbsp;
          <span className="relative whitespace-nowrap text-[var(--signal)]">
            data arrives
            <svg
              className="absolute -bottom-2 left-0 w-full"
              height="9"
              viewBox="0 0 200 9"
              preserveAspectRatio="none"
            >
              <path
                d="M2 6 Q 50 1 100 5 T 198 4"
                stroke="var(--delay)"
                strokeWidth="2.5"
                fill="none"
              />
            </svg>
          </span>
          .
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
          className="mt-7 max-w-2xl text-lg leading-relaxed text-[var(--graphite)]"
        >
          A <strong className="text-[var(--ink)]">marked graph</strong> is a dataflow program: boxes
          of computation wired by queues, with tokens of data flowing between them. No clock, no
          scheduler shouting orders — an actor simply fires the moment its inputs are full. Below is
          a working bench. Fire actors by hand, let it run, and watch the theory plot itself.
        </motion.p>
      </header>

      {/* the instrument */}
      <section className="mx-auto max-w-5xl px-5 pb-20">
        <motion.div {...reveal}>
          <SignalBench presetId={presetId} onPresetChange={setPresetId} benchRef={benchRef} />
        </motion.div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <Legend swatch="var(--signal)" text="live channel · tokens present" />
          <Legend swatch="var(--rule)" text="empty channel · starved" dashed />
          <Legend swatch="var(--delay)" text="initial token (delay, z⁻¹)" />
        </div>
      </section>

      {/* lab manual */}
      <article className="mx-auto max-w-3xl px-5 pb-28">
        <motion.section {...reveal} className="spec-rule mb-20">
          <SectionNo n="01" title="Anatomy of the graph" />
          <div className="space-y-4 text-[1.02rem] leading-relaxed text-[var(--graphite)]">
            <p>
              Four things, nothing more. An <Term>actor</Term> is a unit of computation — the
              circles. A <Term>channel</Term> is an unbounded FIFO queue connecting two actors — the
              wires. A <Term>token</Term> is one indivisible packet of data sitting in a channel —
              the glowing pulses, counted in the badges. The set of all token counts is the{" "}
              <Term>marking</Term>; it <em>is</em> the entire state of the program.
            </p>
            <p>
              That is the whole vocabulary. Everything that follows — throughput, deadlock,
              compile-time scheduling — falls out of these four nouns and one rule.
            </p>
          </div>
        </motion.section>

        <motion.section {...reveal} className="spec-rule mb-20">
          <SectionNo n="02" title="The firing rule" />
          <div className="space-y-4 text-[1.02rem] leading-relaxed text-[var(--graphite)]">
            <p>
              An actor is <Term>enabled</Term> when <em>every</em> incoming channel holds at least
              as many tokens as that actor consumes. An enabled actor may <Term>fire</Term>: in one
              atomic step it removes its consumption count from each input and appends its
              production count to each output.
            </p>
            <p>
              The order you fire enabled actors in does not change the result — this is{" "}
              <Term>determinacy</Term>. Click a glowing actor on the{" "}
              <Jump onClick={() => load("pipeline")}>Pipeline ↑</Jump> and then a different one; the
              final marking is the same. A grey actor is starved — clicking it shakes and lights the
              channel that is short.
            </p>
          </div>
        </motion.section>

        <motion.section {...reveal} className="spec-rule mb-20">
          <SectionNo n="03" title="The balance equation" />
          <div className="space-y-4 text-[1.02rem] leading-relaxed text-[var(--graphite)]">
            <p>
              When an actor produces a different number of tokens than the next one consumes, the
              graph is <Term>multirate</Term>. For the schedule to repeat without buffers growing
              forever, firings must balance across every channel:
            </p>
            <p className="bench-mono rounded-[2px] border border-dashed border-[var(--rule)] bg-[#fffefb] px-4 py-3 text-[0.92rem] text-[var(--ink)]">
              q[from] · production = q[to] · consumption&nbsp;&nbsp;(for every channel)
            </p>
            <p>
              The smallest positive integer solution is the <Term>repetition vector</Term>{" "}
              <span className="bench-mono text-[var(--ink)]">q</span>. Load the{" "}
              <Jump onClick={() => load("multirate")}>Multirate graph ↑</Jump>: producing 2 and 3
              against consuming 1 and 2 forces the solution{" "}
              <span className="bench-mono text-[var(--ink)]">
                A<sup className="text-[var(--signal)]">1</sup> B
                <sup className="text-[var(--signal)]">2</sup> C
                <sup className="text-[var(--signal)]">3</sup>
              </span>{" "}
              — read it live in the bench&apos;s readout. If no integer solution exists, the graph is
              inconsistent and no bounded schedule can exist.
            </p>
          </div>
        </motion.section>

        <motion.section {...reveal} className="spec-rule mb-20">
          <SectionNo n="04" title="Cycles, delays & deadlock" />
          <div className="space-y-4 text-[1.02rem] leading-relaxed text-[var(--graphite)]">
            <p>
              Feedback makes a cycle, and a cycle is a chicken-and-egg trap: the plant waits for the
              controller, the controller waits for the plant, nobody moves. The fix is an{" "}
              <Term>initial token</Term> placed on the channel before anything runs — a{" "}
              <Term>delay</Term>, written <span className="bench-mono text-[var(--delay)]">z⁻¹</span>{" "}
              in signal processing. It is the seed that lets the loop turn.
            </p>
            <p>
              Open the <Jump onClick={() => load("feedback")}>Feedback graph ↑</Jump> and press{" "}
              <strong className="text-[var(--ink)]">Run</strong>. With the magenta delay on, tokens
              circulate forever. Toggle the delay to{" "}
              <span className="bench-mono text-[var(--delay)]">0</span> and reset: the status panel
              flips to <span className="bench-mono text-[var(--delay)]">DEADLOCK</span> on the first
              step. A live marked graph needs at least one initial token on every cycle.
            </p>
          </div>
        </motion.section>

        <motion.section {...reveal} className="spec-rule mb-4">
          <SectionNo n="05" title="Why engineers love them" />
          <div className="space-y-4 text-[1.02rem] leading-relaxed text-[var(--graphite)]">
            <p>
              Because all rates are known before the program runs, a finite firing order that
              returns the graph to its starting marking can be computed at{" "}
              <Term>compile time</Term> — a <Term>periodic admissible sequential schedule</Term>.
              That is the &ldquo;One static period&rdquo; readout in the bench, generated by the same
              engine the simulator runs.
            </p>
            <p>
              No runtime scheduler, no locks, provably bounded memory, and a deadlock that is caught
              before deployment instead of at 3 a.m. That is why marked graphs sit underneath modems,
              audio codecs, radar, and the block diagrams in tools like Simulink and LabVIEW — and
              why they are worth an afternoon at the bench.
            </p>
          </div>
        </motion.section>
      </article>

      <footer className="border-t border-[var(--ink)]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-8">
          <p className="bench-mono text-[0.74rem] text-[var(--graphite)]">
            Armath Engineering Makerspace · Arapi — built at the bench, not on the slide.
          </p>
          <Link
            href="/materials"
            className="bench-link inline-flex items-center gap-2 pb-0.5"
          >
            More learning materials →
          </Link>
        </div>
      </footer>
    </main>
  )
}

function Term({ children }: { children: React.ReactNode }) {
  return (
    <strong className="font-semibold text-[var(--ink)] underline decoration-[var(--signal)] decoration-2 underline-offset-4">
      {children}
    </strong>
  )
}

function Jump({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="bench-link">
      {children}
    </button>
  )
}

function Legend({ swatch, text, dashed }: { swatch: string; text: string; dashed?: boolean }) {
  return (
    <span className="bench-mono flex items-center gap-2 text-[0.72rem] text-[var(--graphite)]">
      <svg width="26" height="10" aria-hidden>
        <line
          x1="0"
          y1="5"
          x2="26"
          y2="5"
          stroke={swatch}
          strokeWidth="3"
          strokeDasharray={dashed ? "5 4" : "0"}
        />
      </svg>
      {text}
    </span>
  )
}
