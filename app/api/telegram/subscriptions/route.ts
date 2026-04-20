import { prisma } from "@/lib/prisma"
import { sendTelegramMessage } from "@/lib/telegram"
import { NextRequest, NextResponse } from "next/server"

/**
 * GET /api/telegram/subscriptions
 * Llamado por Vercel Cron cada día a las 9:00.
 * Envía una alerta por Telegram si hay suscripciones que vencen en los próximos 3 días.
 */
export async function GET(req: NextRequest) {
    const cronSecret = process.env.CRON_SECRET
    const authHeader = req.headers.get("authorization")

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const user = await prisma.user.findFirst({ select: { id: true } })
    if (!user) {
        return NextResponse.json({ error: "No hay usuarios registrados" }, { status: 404 })
    }

    const now = new Date()
    const todayDay = now.getDate()
    const todayMonth = now.getMonth()
    const todayYear = now.getFullYear()
    const todayStart = new Date(todayYear, todayMonth, todayDay)

    const subscriptions = await prisma.subscription.findMany({
        where: { userId: user.id, active: true },
    })

    const DAYS_AHEAD = 3

    const upcoming = subscriptions
        .map((sub) => {
            const chargedThisMonth =
                sub.lastCharged !== null &&
                new Date(sub.lastCharged).getMonth() === todayMonth &&
                new Date(sub.lastCharged).getFullYear() === todayYear

            const chargeDate =
                chargedThisMonth || sub.dayOfMonth <= todayDay
                    ? new Date(todayYear, todayMonth + 1, sub.dayOfMonth)
                    : new Date(todayYear, todayMonth, sub.dayOfMonth)

            const daysUntil = Math.round(
                (chargeDate.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24)
            )

            return { ...sub, daysUntil, chargeDate }
        })
        .filter((sub) => sub.daysUntil >= 0 && sub.daysUntil <= DAYS_AHEAD)
        .sort((a, b) => a.daysUntil - b.daysUntil)

    if (upcoming.length === 0) {
        return NextResponse.json({ ok: true, message: "Sin suscripciones próximas, omitido" })
    }

    const eur = (n: number) =>
        n.toLocaleString("es-ES", { style: "currency", currency: "EUR" })

    function h(text: string | null | undefined): string {
        if (!text) return ""
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    }

    const lines: string[] = []
    lines.push(`⏰ <b>Alerta de suscripciones próximas</b>`)
    lines.push(``)

    for (const sub of upcoming) {
        const urgency = sub.daysUntil === 0 ? "🔴 Hoy" : sub.daysUntil === 1 ? "🟠 Mañana" : `🔵 En ${sub.daysUntil} días`
        const fecha = sub.chargeDate.toLocaleDateString("es-ES", { day: "2-digit", month: "long" })
        lines.push(`${urgency} — <b>${h(sub.name)}</b>`)
        lines.push(`  ${h(eur(sub.amount))} · ${h(sub.category)} · ${fecha}`)
        lines.push(``)
    }

    const totalAmount = upcoming.reduce((s, sub) => s + sub.amount, 0)
    lines.push(`💳 Total próximo: <b>${h(eur(totalAmount))}</b>`)

    try {
        await sendTelegramMessage(lines.join("\n"))
        return NextResponse.json({ ok: true, message: `Alerta enviada: ${upcoming.length} suscripción(es)` })
    } catch (err) {
        console.error("[telegram/subscriptions]", err)
        const error = err instanceof Error ? err.message : "Error desconocido"
        return NextResponse.json({ ok: false, error }, { status: 500 })
    }
}
