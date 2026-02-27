"use client"

import { useEffect, useRef } from "react"
import { AdminLoginForm } from "@/components/auth/AdminLoginForm"
import { IntenseBg } from "@/components/gl/intense-bg"

export default function AdminLoginPage() {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.4
            audioRef.current.play().catch(() => {
                // Handle autoplay restrictions silently
            })
        }
    }, [])

    return (
        <>
            <audio
                ref={audioRef}
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/animation-menu-SBSEhsCLzhfXdw8sBI16r613N8tkGr.mp3"
                preload="auto"
            />
            <IntenseBg />
            <AdminLoginForm />
        </>
    )
}
