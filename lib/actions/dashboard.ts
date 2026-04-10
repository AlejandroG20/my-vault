"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import type { TransactionItem } from "@/types/prisma"

export async function getDashboardData() {
    // Verificamos que haya sesión activa; si no, no devolvemos nada
    const session = await auth()
    if (!session?.user?.id) return null

    const userId = session.user.id

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

    const [user, monthlyTransactions, prevMonthTransactions, allTransactions, goal] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: { initialBalance: true },
        }),
        prisma.transaction.findMany({
            where: { userId, date: { gte: startOfMonth, lte: endOfMonth } },
        }),
        prisma.transaction.findMany({
            where: { userId, date: { gte: startOfPrevMonth, lte: endOfPrevMonth } },
        }),
        prisma.transaction.findMany({
            where: { userId },
        }),
        prisma.goal.findUnique({
            where: { userId },
        }),
    ])

    const totalIncome = monthlyTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = monthlyTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0)

    const prevIncome = prevMonthTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0)

    const prevExpense = prevMonthTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0)

    // Balance real = saldo inicial + todos los ingresos históricos - todos los gastos históricos
    const allTimeIncome = allTransactions
        .filter((t) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0)

    const allTimeExpense = allTransactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0)

    const balance = (user?.initialBalance ?? 0) + allTimeIncome - allTimeExpense

    return {
        totalIncome,
        totalExpense,
        prevIncome,
        prevExpense,
        balance,
        initialBalance: user?.initialBalance ?? 0,
        goal,
    }
}