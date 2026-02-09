"use client"

import { useEffect, useRef } from "react"

export function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const isAdminRoute = window.location.pathname.startsWith('/admin')
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const lowPowerDevice = (navigator.hardwareConcurrency || 4) <= 2
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches

    if (isAdminRoute || reduceMotion || lowPowerDevice || coarsePointer) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let snowflakes: Snowflake[] = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    class Snowflake {
      x: number
      y: number
      radius: number
      speed: number
      wind: number

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.radius = Math.random() * 2 + 1
        this.speed = Math.random() * 1 + 0.5
        this.wind = Math.random() * 0.5 - 0.25
      }

      update() {
        this.y += this.speed
        this.x += this.wind

        if (this.y > canvas!.height) {
          this.y = 0
          this.x = Math.random() * canvas!.width
        }
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.fill()
      }
    }

    const initSnowflakes = () => {
      snowflakes = []
      const numberOfSnowflakes = 100
      for (let i = 0; i < numberOfSnowflakes; i++) {
        snowflakes.push(new Snowflake())
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      snowflakes.forEach((snowflake) => {
        snowflake.update()
        snowflake.draw()
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initSnowflakes()
    animate()

    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    />
  )
}
