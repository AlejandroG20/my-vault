"use client"

import { useState } from "react"
import { Send } from "lucide-react"

export default function TelegramReportButton() {
    const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle")

    async function handleClick() {
        setStatus("loading")
        try {
            const res = await fetch("/api/telegram/report", { method: "POST" })
            const data = await res.json()
            setStatus(data.ok ? "sent" : "error")
        } catch {
            setStatus("error")
        } finally {
            // Vuelve a idle después de 3 segundos
            setTimeout(() => setStatus("idle"), 3000)
        }
    }

    const label = {
        idle: "Enviar informe",
        loading: "Enviando...",
        sent: "¡Enviado!",
        error: "Error al enviar",
    }[status]

    const baseClass =
        "flex cursor-pointer items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors"

    const variantClass = {
        idle: "border-primary-200 text-primary-600 hover:bg-primary-50",
        loading: "border-primary-200 text-primary-400 cursor-not-allowed",
        sent: "border-green-200 text-green-600 bg-green-50",
        error: "border-red-200 text-red-600 bg-red-50",
    }[status]

    return (
        <button
            onClick={handleClick}
            disabled={status === "loading"}
            className={`${baseClass} ${variantClass}`}
        >
            <Send size={14} />
            {label}
        </button>
    )
}
