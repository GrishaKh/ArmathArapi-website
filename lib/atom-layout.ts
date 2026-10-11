/** Geometry shared by the responsive atom and its viewport-bound profile cards. */
export function getAtomLayout(shortest: number, coreCount = 3) {
  const size = Math.max(0, shortest)
  const nucleusDiameter = Math.max(110, Math.min(160, size * 0.32))
  const coreRadius = coreCount > 1 ? 48 / (2 * Math.sin(Math.PI / coreCount)) : 0
  const outerOrbit = Math.max(0, Math.min(size <= 320 ? size / 2 - 28 : size * 0.36, size / 2 - 28))
  const innerOrbit = Math.max(0, Math.min(Math.max(nucleusDiameter / 2 + 28, size * 0.27), outerOrbit - 24))
  return { nucleusDiameter, coreRadius, coreSize: 28, electronSize: Math.round(Math.max(24, Math.min(44, size * 0.11))), innerOrbit, outerOrbit }
}

export function getTooltipPosition(
  anchor: { left: number; top: number; width: number; bottom: number },
  width: number, height: number, viewportWidth: number, viewportHeight: number,
) {
  const margin = 8
  const gap = 12
  const above = anchor.top - height - gap
  const below = anchor.bottom + gap
  const preferred = above >= margin ? above : below
  return {
    x: Math.max(margin, Math.min(viewportWidth - width - margin, anchor.left + anchor.width / 2 - width / 2)),
    y: Math.max(margin, Math.min(viewportHeight - height - margin, preferred)),
  }
}

/** Advance from the current angle, so pausing and resuming never resets an orbit. */
export function advanceOrbit(angle: number, deltaMs: number, durationSeconds: number, paused: boolean) {
  return paused ? angle : (angle + Math.min(deltaMs, 64) * 360 / (durationSeconds * 1000)) % 360
}
