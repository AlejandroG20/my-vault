import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendTelegramMessage } from "@/lib/telegram"
import { NextRequest, NextResponse } from "next/server"

/** Escapa caracteres especiales de HTML para usar en parse_mode: "HTML" de Telegram */
function h(text: string | null | undefined): string {
    if (!text) return ""
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
}

/**
 * POST /api/telegram/report
 *
 * Genera y envía un informe financiero mensual por Telegram.
 * Acepta dos modos de autenticación:
 *   1. Sesión de usuario (llamada desde el botón en el dashboard)
 *   2. Header "Authorization: Bearer <CRON_SECRET>" (llamada automática de cron)
 */
export async function POST(req: NextRequest) {
    let userId: string | null = null

    // Modo 1: autenticación por sesión
    const session = await auth()
    if (session?.user?.id) {
        userId = session.user.id
    }

    // Modo 2: autenticación por cron secret
    if (!userId) {
        const authHeader = req.headers.get("authorization")
        const cronSecret = process.env.CRON_SECRET
        if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
            // Busca el primer usuario registrado (app personal de un solo usuario)
            const user = await prisma.user.findFirst({ select: { id: true } })
            userId = user?.id ?? null
        }
    }

    if (!userId) {
        return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // ── Recopilación de datos ──────────────────────────────────────────────────
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

    const [
        user,
        monthlyTransactions,
        prevMonthTransactions,
        allTransactions,
        budgets,
        budgetExpenses,
        subscriptions,
        goal,
    ] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, initialBalance: true },
        }),
        prisma.transaction.findMany({
            where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
            orderBy: { date: "desc" },
        }),
        prisma.transaction.findMany({
            where: { userId, date: { gte: startOfPrevMonth, lte: endOfPrevMonth } },
        }),
        prisma.transaction.findMany({ where: { userId } }),
        prisma.budget.findMany({ where: { userId }, orderBy: { category: "asc" } }),
        prisma.transaction.groupBy({
            by: ["category"],
            where: {
                userId,
                type: "EXPENSE",
                date: { gte: startOfMonth, lte: endOfMonth },
            },
            _sum: { amount: true },
        }),
        prisma.subscription.findMany({
            where: { userId, active: true },
            orderBy: { amount: "desc" },
        }),
        prisma.goal.findUnique({ where: { userId } }),
    ])

    // ── Cálculos ───────────────────────────────────────────────────────────────
    const totalIncome = monthlyTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((s, t) => s + t.amount, 0)

    const totalExpense = monthlyTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((s, t) => s + t.amount, 0)

    const prevIncome = prevMonthTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((s, t) => s + t.amount, 0)

    const prevExpense = prevMonthTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((s, t) => s + t.amount, 0)

    const allTimeIncome = allTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((s, t) => s + t.amount, 0)

    const allTimeExpense = allTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((s, t) => s + t.amount, 0)

    const balance = (user?.initialBalance ?? 0) + allTimeIncome - allTimeExpense
    const netMonth = totalIncome - totalExpense

    // Gasto por categoría del mes
    const spendingByCategory = Object.fromEntries(
        budgetExpenses.map((e) => [e.category, e._sum.amount ?? 0])
    )

    // Top 5 categorías de gasto del mes
    const topCategories = Object.entries(spendingByCategory)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)

    const totalSubscriptions = subscriptions.reduce((s, sub) => s + sub.amount, 0)

    // ── Helpers de formato ─────────────────────────────────────────────────────
    const eur = (n: number) =>
        n.toLocaleString("es-ES", { style: "currency", currency: "EUR" })

    const trend = (current: number, previous: number) => {
        if (previous === 0) return ""
        const pct = ((current - previous) / previous) * 100
        const arrow = pct > 0 ? "▲" : "▼"
        return ` ${arrow} ${Math.abs(pct).toFixed(1)}% vs mes anterior`
    }

    const monthName = now.toLocaleString("es-ES", { month: "long", year: "numeric" })

    // ── Construcción del mensaje ───────────────────────────────────────────────
    const lines: string[] = []

    lines.push(`📊 <b>Informe Financiero — ${monthName}</b>`)
    lines.push(`Generado el ${now.toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}`)
    lines.push("")

    // Balance global
    lines.push(`💰 <b>Balance Total</b>`)
    lines.push(`${eur(balance)}`)
    lines.push("")

    // Resultado del mes
    const netEmoji = netMonth >= 0 ? "🟢" : "🔴"
    lines.push(`${netEmoji} <b>Resultado del mes</b>`)
    lines.push(`${eur(netMonth)}  (ingresos − gastos)`)
    lines.push("")

    // Ingresos
    lines.push(`📈 <b>Ingresos del mes</b>`)
    lines.push(`${eur(totalIncome)}${trend(totalIncome, prevIncome)}`)
    lines.push("")

    // Gastos
    lines.push(`📉 <b>Gastos del mes</b>`)
    lines.push(`${eur(totalExpense)}${trend(totalExpense, prevExpense)}`)
    lines.push("")

    // Top categorías
    if (topCategories.length > 0) {
        lines.push(`🏷️ <b>Top categorías de gasto</b>`)
        for (const [cat, amount] of topCategories) {
            const pct = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(0) : "0"
            lines.push(`  • ${h(cat)}: ${h(eur(amount))} (${pct}%)`)
        }
        lines.push("")
    }

    // Presupuestos
    if (budgets.length > 0) {
        lines.push(`🎯 <b>Presupuestos</b>`)
        for (const b of budgets) {
            const spent = spendingByCategory[b.category] ?? 0
            const pct = b.amount > 0 ? (spent / b.amount) * 100 : 0
            const bar = pct >= 100 ? "🔴" : pct >= 80 ? "🟠" : "🟢"
            lines.push(`  ${bar} ${h(b.category)}: ${h(eur(spent))} / ${h(eur(b.amount))} (${pct.toFixed(0)}%)`)
        }
        lines.push("")
    }

    // Suscripciones activas
    if (subscriptions.length > 0) {
        lines.push(`🔄 <b>Suscripciones activas</b>  — total: ${h(eur(totalSubscriptions))}/mes`)
        for (const sub of subscriptions) {
            lines.push(`  • ${h(sub.name)}: ${h(eur(sub.amount))} (día ${sub.dayOfMonth})`)
        }
        lines.push("")
    }

    // Objetivo de ahorro
    if (goal) {
        const progress = Math.min((balance / goal.amount) * 100, 100)
        const filled = Math.round(progress / 10)
        const progressBar = "█".repeat(filled) + "░".repeat(10 - filled)
        lines.push(`🏆 <b>Objetivo: ${h(goal.name)}</b>`)
        lines.push(`[${progressBar}] ${progress.toFixed(1)}%`)
        lines.push(`${h(eur(balance))} / ${h(eur(goal.amount))}`)
        lines.push("")
    }

    // Últimas 5 transacciones del mes
    const lastFive = monthlyTransactions.slice(0, 5)
    if (lastFive.length > 0) {
        lines.push(`🧾 <b>Últimas transacciones del mes</b>`)
        for (const t of lastFive) {
            const sign = t.type === "INCOME" ? "+" : "-"
            const fecha = new Date(t.date).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })
            const desc = t.description ? ` — ${h(t.description)}` : ""
            lines.push(`  ${sign}${h(eur(t.amount))}  ${h(t.category)}${desc}  <i>${h(fecha)}</i>`)
        }
    }

    const message = lines.join("\n")

    try {
        await sendTelegramMessage(message)
        return NextResponse.json({ ok: true, message: "Informe enviado por Telegram" })
    } catch (err) {
        console.error("[telegram/report]", err)
        const error = err instanceof Error ? err.message : "Error desconocido"
        return NextResponse.json({ ok: false, error }, { status: 500 })
    }
}
