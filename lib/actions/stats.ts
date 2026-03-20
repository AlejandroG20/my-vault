"use server"

// Este archivo contiene Server Actions para obtener estadísticas financieras del usuario autenticado.

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// Devuelve los ingresos y gastos agrupados por mes (ej: "mar. 25").
// Se usa para mostrar gráficos de barras comparando ingresos vs gastos mensuales.
export async function getMonthlyStats(): Promise<{ month: string; income: number; expense: number }[]> {
    const session = await auth()
    if (!session?.user?.id) return []

    // Obtiene todas las transacciones del usuario ordenadas cronológicamente
    const transactions = await prisma.transaction.findMany({
        where: { userId: session.user.id },
        orderBy: { date: "asc" },
    })

    // Mapa que acumula ingresos y gastos por clave "mes año" (ej: "mar. 25")
    const monthlyMap: Record<string, { income: number; expense: number }> = {}

    for (const t of transactions) {
        // Genera la clave del mes en formato corto en español
        const key = new Date(t.date).toLocaleString("es-ES", {
            month: "short",
            year: "2-digit",
        })

        if (!monthlyMap[key]) {
            monthlyMap[key] = { income: 0, expense: 0 }
        }

        // Suma al ingreso o gasto según el tipo de transacción
        if (t.type === "INCOME") {
            monthlyMap[key].income += t.amount
        } else {
            monthlyMap[key].expense += t.amount
        }
    }

    // Convierte el mapa a un array de objetos { month, income, expense }
    return Object.entries(monthlyMap).map(([month, values]) => ({
        month,
        ...values,
    }))
}

// Devuelve el total gastado por categoría, ordenado de mayor a menor.
// Se usa para mostrar gráficos de torta o barras de distribución de gastos.
export async function getCategoryStats(): Promise<{ name: string; value: number }[]> {
    const session = await auth()
    if (!session?.user?.id) return []

    // Solo obtiene transacciones de tipo GASTO
    const transactions = await prisma.transaction.findMany({
        where: {
            userId: session.user.id,
            type: "EXPENSE",
        },
    })

    // Mapa que acumula el total gastado por cada categoría
    const categoryMap: Record<string, number> = {}

    for (const t of transactions) {
        if (!categoryMap[t.category]) {
            categoryMap[t.category] = 0
        }
        categoryMap[t.category] += t.amount
    }

    // Convierte el mapa a array { name, value } y ordena de mayor a menor gasto
    return Object.entries(categoryMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
}

// Devuelve el balance acumulado a lo largo del tiempo, transacción por transacción.
// Se usa para mostrar un gráfico de línea con la evolución del saldo.
export async function getBalanceOverTime(): Promise<{ date: string; balance: number }[]> {
    const session = await auth()
    if (!session?.user?.id) return []

    // Obtiene todas las transacciones ordenadas por fecha ascendente
    const transactions = await prisma.transaction.findMany({
        where: { userId: session.user.id },
        orderBy: { date: "asc" },
    })

    let accumulated = 0
    const result: { date: string; balance: number }[] = []

    for (const t of transactions) {
        // Suma o resta al balance según si es ingreso o gasto
        accumulated += t.type === "INCOME" ? t.amount : -t.amount

        // Formatea la fecha como "20 mar" en español
        const date = new Date(t.date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
        })

        // Guarda el punto en el tiempo con el balance redondeado a 2 decimales
        result.push({
            date,
            balance: Math.round(accumulated * 100) / 100,
        })
    }

    return result
}