import assert from 'node:assert/strict'
import { test } from 'node:test'
import { advanceOrbit, getAtomLayout, getTooltipPosition } from '../../lib/atom-layout.ts'

test('mobile and desktop rings remain distinct and 44px targets fit the scene', () => {
  for (const size of [220, 256, 280, 320, 360, 448]) {
    const layout = getAtomLayout(size)
    assert.ok(layout.outerOrbit - layout.innerOrbit >= 24, `rings collapsed at ${size}`)
    assert.ok(layout.outerOrbit + 22 <= size / 2, `target clipped at ${size}`)
    assert.ok(2 * layout.coreRadius * Math.sin(Math.PI / 3) >= 44, 'core targets overlap')
    assert.ok(layout.coreRadius + 22 <= layout.nucleusDiameter / 2, 'core target outside nucleus')
    if (size >= 256) assert.ok(layout.innerOrbit - layout.coreRadius >= 44, 'supporter and core targets overlap')
  }
})

test('profile cards stay within viewport at both edges and near the top and bottom', () => {
  for (const anchor of [
    { left: 0, top: 10, width: 44, bottom: 54 },
    { left: 276, top: 450, width: 44, bottom: 494 },
    { left: 140, top: 200, width: 44, bottom: 244 },
  ]) {
    const point = getTooltipPosition(anchor, 280, 300, 320, 500)
    assert.ok(point.x >= 8 && point.x + 280 <= 312)
    assert.ok(point.y >= 8 && point.y + 300 <= 492)
  }
  assert.equal(getTooltipPosition({ left: 140, top: 400, width: 44, bottom: 444 }, 280, 200, 500, 800).y, 188)
  assert.equal(getTooltipPosition({ left: 140, top: 10, width: 44, bottom: 54 }, 280, 200, 500, 800).y, 66)
})

test('paused or reduced motion preserves angle; resuming continues without a jump', () => {
  const angle = advanceOrbit(137.5, 16, 20, false)
  assert.ok(angle > 137.5)
  assert.equal(advanceOrbit(angle, 5000, 20, true), angle)
  assert.equal(advanceOrbit(angle, 16, 20, false), angle + 0.288)
  assert.ok(advanceOrbit(10, 5000, 20, false) < 12, 'background tab creates a jump')
})
