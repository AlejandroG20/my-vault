"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Transaction } from "@prisma/client"

export async function getDashboardData() {
    // Verificamos que haya sesión activa; si no, no devolvemos nada
    const session = await auth()
    if (!session?.user?.id) return null

    const userId = session.user.id

    // Calculamos el rango de fechas del mes actual (primer y último día)
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    // Obtenemos todas las transacciones del usuario en el mes actual
    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            date: {
                gte: startOfMonth,
                lte: endOfMonth,
            },
        },
    })

    // Obtenemos el objetivo de ahorro del usuario (si tiene uno definido)
    const goal = await prisma.goal.findUnique({
        where: { userId },
    })

    // Sumamos los ingresos y gastos por separado filtrando por tipo
    const totalIncome = transactions
        .filter((t: Transaction) => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
        .filter((t: Transaction) => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0)

    // El balance es la diferencia entre ingresos y gastos del mes
    const balance = totalIncome - totalExpense

    return {
        totalIncome,
        totalExpense,
        balance,
        goal,
    }
}