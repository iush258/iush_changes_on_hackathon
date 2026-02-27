"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface Particle {
    gridX: number
    gridY: number
    opacity: number
    targetOpacity: number
    size: number
    targetSize: number
    flickerSpeed: number
    scale: number
    targetScale: number
    distancesFromCenters: number[]
    baseSize: number
}

interface Wave {
    startTime: number
    centerIndex: number
    isPowerPulse?: boolean
}

export function IntenseBg() {
    const { resolvedTheme } = useTheme()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const particlesRef = useRef<Particle[]>([])
    const animationFrameRef = useRef<number | undefined>(undefined)
    const gridInfoRef = useRef({ cols: 0, rows: 0, spacing: 20 })
    const wavesRef = useRef<Wave[]>([])
    const lastWaveCreationsRef = useRef<number[]>([0, 0, 0, 0])
    const lastPowerPulseRef = useRef<number>(0)
    const centersRef = useRef<{ x: number; y: number }[]>([])
    const activeCentersRef = useRef<Set<number>>(new Set())
    const isLightRef = useRef(false)
    isLightRef.current = resolvedTheme === "light"

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const initializeParticles = () => {
            const spacing = 8
            const cols = Math.ceil(canvas.width / spacing)
            const rows = Math.ceil(canvas.height / spacing)

            gridInfoRef.current = { cols, rows, spacing }

            centersRef.current = [
                { x: 0, y: rows / 2 },
                { x: cols, y: rows / 2 },
                { x: cols / 2, y: 0 },
                { x: cols / 2, y: rows },
            ]

            const indices = [0, 1, 2, 3]
            const shuffled = indices.sort(() => Math.random() - 0.5)
            activeCentersRef.current = new Set(shuffled.slice(0, 2))

            particlesRef.current = []
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const opacity = Math.random()
                    const baseSize = Math.random() * 1.5 + 1
                    const size = baseSize

                    const distancesFromCenters = centersRef.current.map((center) =>
                        Math.sqrt(Math.pow(col - center.x, 2) + Math.pow(row - center.y, 2)),
                    )

                    particlesRef.current.push({
                        gridX: col * spacing + spacing / 2,
                        gridY: row * spacing + spacing / 2,
                        opacity,
                        targetOpacity: opacity,
                        size,
                        targetSize: size,
                        flickerSpeed: Math.random() * 0.08 + 0.05,
                        scale: 1,
                        targetScale: 1,
                        distancesFromCenters,
                        baseSize,
                    })
                }
            }
        }

        const setCanvasSize = () => {
            canvas.width = canvas.offsetWidth
            canvas.height = canvas.offsetHeight
            initializeParticles()
        }
        setCanvasSize()
        window.addEventListener("resize", setCanvasSize)

        const animate = () => {
            const canvas = canvasRef.current
            if (!canvas) return

            const ctx = canvas.getContext("2d")
            if (!ctx) return

            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const maxDistance = Math.max(gridInfoRef.current.cols, gridInfoRef.current.rows) * 0.8
            const currentTime = Date.now()

            if (currentTime - lastPowerPulseRef.current >= Math.random() * 3000 + 3000) {
                const activeArray = Array.from(activeCentersRef.current)
                const randomCenterIndex = activeArray[Math.floor(Math.random() * activeArray.length)]
                wavesRef.current.push({
                    startTime: currentTime,
                    centerIndex: randomCenterIndex,
                    isPowerPulse: true,
                })
                lastPowerPulseRef.current = currentTime
            }

            activeCentersRef.current.forEach((centerIndex) => {
                if (currentTime - lastWaveCreationsRef.current[centerIndex] >= 1500) {
                    wavesRef.current.push({ startTime: currentTime, centerIndex })
                    lastWaveCreationsRef.current[centerIndex] = currentTime
                }
            })

            if (currentTime % 5000 < 16) {
                if (Math.random() < 0.3) {
                    const allIndices = [0, 1, 2, 3]
                    const shuffled = allIndices.sort(() => Math.random() - 0.5)
                    activeCentersRef.current = new Set(shuffled.slice(0, 2))
                }
            }

            wavesRef.current = wavesRef.current.filter((wave) => {
                const waveAge = (currentTime - wave.startTime) / 1000
                const speed = wave.isPowerPulse ? 120 : 30
                const waveRadius = waveAge * speed
                return waveRadius < maxDistance + 20
            })

            particlesRef.current.forEach((particle) => {
                let maxOpacity = 0
                let maxScale = 0

                wavesRef.current.forEach((wave) => {
                    const waveAge = (currentTime - wave.startTime) / 1000
                    const speed = wave.isPowerPulse ? 120 : 30
                    const waveRadius = waveAge * speed
                    const distanceFromWaveCenter = particle.distancesFromCenters[wave.centerIndex]
                    const distanceDiff = Math.abs(distanceFromWaveCenter - waveRadius)

                    const waveWidth = wave.isPowerPulse ? 30 : 15
                    const risePhase = waveWidth * 0.3
                    const holdPhase = waveWidth * 0.4
                    const fallPhase = waveWidth * 0.3

                    if (distanceDiff < waveWidth) {
                        let waveIntensity = 0

                        if (distanceDiff < risePhase) {
                            waveIntensity = distanceDiff / risePhase
                        } else if (distanceDiff < risePhase + holdPhase) {
                            waveIntensity = 1
                        } else {
                            const fallProgress = (distanceDiff - risePhase - holdPhase) / fallPhase
                            waveIntensity = 1 - fallProgress
                        }

                        const distanceFade = Math.max(0, 1 - distanceFromWaveCenter / (maxDistance * 1.5))
                        const intensityMultiplier = wave.isPowerPulse ? 1.5 : 1
                        const effectiveIntensity = waveIntensity * distanceFade * intensityMultiplier

                        maxOpacity = Math.max(maxOpacity, effectiveIntensity)
                        const scaleMultiplier = wave.isPowerPulse ? 3 : 2
                        maxScale = Math.max(maxScale, effectiveIntensity * scaleMultiplier)
                    }
                })

                const minDistanceFromAnyCenter = Math.min(...particle.distancesFromCenters)
                const distanceFadeForSize = Math.max(0, 1 - minDistanceFromAnyCenter / (maxDistance * 1.2))
                const baseSize = particle.baseSize * (0.3 + distanceFadeForSize * 0.7)

                particle.targetOpacity = maxOpacity
                particle.targetScale = maxScale
                particle.targetSize = baseSize

                particle.opacity += (particle.targetOpacity - particle.opacity) * (particle.flickerSpeed * 0.6)
                particle.size += (particle.targetSize - particle.size) * (particle.flickerSpeed * 0.6)
                particle.scale += (particle.targetScale - particle.scale) * (particle.flickerSpeed * 0.6)

                const finalSize = particle.size * particle.scale
                const colorRGB = isLightRef.current ? "0, 0, 0" : "255, 255, 255"

                ctx.fillStyle = `rgba(${colorRGB}, ${particle.opacity})`
                ctx.beginPath()
                ctx.arc(particle.gridX, particle.gridY, finalSize, 0, Math.PI * 2)
                ctx.fill()
            })

            animationFrameRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener("resize", setCanvasSize)
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [])

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-red-200/50 via-orange-200/50 to-slate-300/50 dark:from-red-500/30 dark:via-orange-500/40 dark:to-slate-900/50 blur-3xl scale-125 transition-colors duration-500" />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/60 via-transparent to-red-200/50 dark:from-slate-950/60 dark:via-transparent dark:to-red-800/40 blur-2xl scale-125 transition-colors duration-500" />
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    )
}
