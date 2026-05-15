// Synchronous-dataflow / marked-graph engine.
// Pure, framework-free: firing semantics, the balance equation (repetition
// vector) and a static admissible schedule (PASS). Imported by the bench UI.

export interface Actor {
  id: string
  label: string
  x: number
  y: number
}

export interface Channel {
  id: string
  from: string
  to: string
  prod: number // tokens produced on each firing of `from`
  cons: number // tokens consumed on each firing of `to`
  initial: number // initial tokens on the channel (a "delay")
  bend: number // render-only: bezier curvature, px perpendicular to the chord
}

export interface Graph {
  id: string
  name: string
  blurb: string
  actors: Actor[]
  channels: Channel[]
}

export type TokenState = Record<string, number>

export function initialTokens(g: Graph): TokenState {
  const t: TokenState = {}
  for (const c of g.channels) t[c.id] = c.initial
  return t
}

/** An actor may fire when every inbound channel holds at least `cons` tokens. */
export function isFireable(g: Graph, actorId: string, tokens: TokenState): boolean {
  return g.channels
    .filter((c) => c.to === actorId)
    .every((c) => tokens[c.id] >= c.cons)
}

export function fireableActors(g: Graph, tokens: TokenState): string[] {
  return g.actors.filter((a) => isFireable(g, a.id, tokens)).map((a) => a.id)
}

export interface FireResult {
  tokens: TokenState
  drained: string[] // inbound channel ids that lost tokens
  filled: string[] // outbound channel ids that gained tokens
}

/** Fire one actor atomically: consume from every input, produce to every output. */
export function fire(g: Graph, actorId: string, tokens: TokenState): FireResult {
  const next: TokenState = { ...tokens }
  const drained: string[] = []
  const filled: string[] = []
  for (const c of g.channels) {
    if (c.to === actorId) {
      next[c.id] -= c.cons
      drained.push(c.id)
    }
    if (c.from === actorId) {
      next[c.id] += c.prod
      filled.push(c.id)
    }
  }
  return { tokens: next, drained, filled }
}

/* ------------------------------------------------------------------ */
/* Exact rational arithmetic for the balance equation                  */
/* ------------------------------------------------------------------ */

function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) [a, b] = [b, a % b]
  return a || 1
}

type Frac = { n: number; d: number }

function frac(n: number, d: number): Frac {
  if (d < 0) {
    n = -n
    d = -d
  }
  const g = gcd(n, d)
  return { n: n / g, d: d / g }
}

const mul = (a: Frac, b: Frac): Frac => frac(a.n * b.n, a.d * b.d)

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b)
}

/**
 * Solve the balance equations  q[from]·prod = q[to]·cons  over a connected
 * graph and return the smallest positive integer repetition vector, or
 * `null` when the rates are inconsistent (no bounded periodic schedule).
 */
export function repetitionVector(g: Graph): Record<string, number> | null {
  if (g.actors.length === 0) return null
  const rate: Record<string, Frac> = {}
  const start = g.actors[0].id
  rate[start] = { n: 1, d: 1 }
  const queue = [start]

  while (queue.length) {
    const u = queue.shift() as string
    for (const c of g.channels) {
      let known: string | null = null
      let unknown: string | null = null
      if (c.from === u) {
        known = c.from
        unknown = c.to
      } else if (c.to === u) {
        known = c.to
        unknown = c.from
      } else {
        continue
      }
      // q[from]·prod = q[to]·cons
      if (rate[c.from] && rate[c.to]) {
        const lhs = rate[c.from].n * c.prod * rate[c.to].d
        const rhs = rate[c.to].n * c.cons * rate[c.from].d
        if (lhs !== rhs) return null // inconsistent rates
        continue
      }
      if (unknown && !rate[unknown]) {
        rate[unknown] =
          unknown === c.to
            ? mul(rate[known as string], frac(c.prod, c.cons)) // q[to] = q[from]·prod/cons
            : mul(rate[known as string], frac(c.cons, c.prod)) // q[from] = q[to]·cons/prod
        queue.push(unknown)
      }
    }
  }

  if (g.actors.some((a) => !rate[a.id])) return null // disconnected

  let denom = 1
  for (const a of g.actors) denom = lcm(denom, rate[a.id].d)
  const scaled = g.actors.map((a) => (rate[a.id].n * denom) / rate[a.id].d)
  let g0 = scaled[0]
  for (const s of scaled) g0 = gcd(g0, s)
  const out: Record<string, number> = {}
  g.actors.forEach((a, i) => (out[a.id] = scaled[i] / g0))
  return out
}

export interface ScheduleResult {
  ok: boolean
  sequence: string[] // actor labels, one admissible period
  reason?: string // populated when ok === false
}

/**
 * Build one admissible periodic schedule by simulating greedy firings until
 * every actor `a` has fired `q[a]` times. Deadlock before that means the
 * current delays make the graph non-live.
 */
export function staticSchedule(g: Graph): ScheduleResult {
  const q = repetitionVector(g)
  if (!q) return { ok: false, sequence: [], reason: "Inconsistent rates — sample sizes never balance, the buffers grow without bound." }

  const tokens = initialTokens(g)
  const fired: Record<string, number> = {}
  for (const a of g.actors) fired[a.id] = 0
  const total = g.actors.reduce((s, a) => s + q[a.id], 0)
  const sequence: string[] = []

  for (let guard = 0; guard < total; guard++) {
    const next = g.actors.find((a) => fired[a.id] < q[a.id] && isFireable(g, a.id, tokens))
    if (!next) {
      return {
        ok: false,
        sequence,
        reason: "Deadlock — every remaining actor is starved. A cycle needs initial tokens (a delay) to break the wait.",
      }
    }
    const res = fire(g, next.id, tokens)
    Object.assign(tokens, res.tokens)
    fired[next.id]++
    sequence.push(next.label)
  }
  return { ok: true, sequence }
}

/* ------------------------------------------------------------------ */
/* The three teaching graphs                                           */
/* ------------------------------------------------------------------ */

export const PRESETS: Graph[] = [
  {
    id: "pipeline",
    name: "Pipeline",
    blurb: "Three actors, unit rates, no cycle — the simplest live graph.",
    actors: [
      { id: "S", label: "Sense", x: 130, y: 175 },
      { id: "F", label: "Filter", x: 370, y: 175 },
      { id: "K", label: "Log", x: 610, y: 175 },
    ],
    channels: [
      { id: "SF", from: "S", to: "F", prod: 1, cons: 1, initial: 0, bend: 0 },
      { id: "FK", from: "F", to: "K", prod: 1, cons: 1, initial: 0, bend: 0 },
    ],
  },
  {
    id: "multirate",
    name: "Multirate",
    blurb: "Mismatched sample sizes — the balance equation sets how often each actor runs.",
    actors: [
      { id: "A", label: "ADC", x: 130, y: 175 },
      { id: "B", label: "Frame", x: 370, y: 175 },
      { id: "C", label: "FFT", x: 610, y: 175 },
    ],
    channels: [
      { id: "AB", from: "A", to: "B", prod: 2, cons: 1, initial: 0, bend: 0 },
      { id: "BC", from: "B", to: "C", prod: 3, cons: 2, initial: 0, bend: 0 },
    ],
  },
  {
    id: "feedback",
    name: "Feedback",
    blurb: "A cycle. Without an initial token both actors wait forever — toggle the delay.",
    actors: [
      { id: "P", label: "Plant", x: 220, y: 178 },
      { id: "Q", label: "Ctrl", x: 520, y: 178 },
    ],
    channels: [
      { id: "PQ", from: "P", to: "Q", prod: 1, cons: 1, initial: 0, bend: -78 },
      { id: "QP", from: "Q", to: "P", prod: 1, cons: 1, initial: 1, bend: -78 },
    ],
  },
]
