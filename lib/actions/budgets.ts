"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Devuelve todos los presupuestos del usuario junto con el gasto real del mes actual
export async function getBudgets() {
    const session = await auth()
    if (!session?.user?.id) return []

    const userId = session.user.id

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const [budgets, expenses] = await Promise.all([
        prisma.budget.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
        prisma.transaction.groupBy({
            by: ["category"],
            where: {
                userId,
                type: "EXPENSE",
                date: { gte: startOfMonth, lte: endOfMonth },
            },
            _sum: { amount: true },
        }),
    ])

    const spendingByCategory = Object.fromEntries(
        expenses.map((e) => [e.category, e._sum.amount ?? 0])
    )

    return budgets.map((b) => ({
        ...b,
        spent: spendingByCategory[b.category] ?? 0,
    }))
}

// Devuelve presupuestos del mes actual que están al 80% o más de su límite
export async function getExceededBudgets() {
    const session = await auth()
    if (!session?.user?.id) return []

    const userId = session.user.id

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const [budgets, expenses] = await Promise.all([
        prisma.budget.findMany({ where: { userId } }),
        prisma.transaction.groupBy({
            by: ["category"],
            where: {
                userId,
                type: "EXPENSE",
                date: { gte: startOfMonth, lte: endOfMonth },
            },
            _sum: { amount: true },
        }),
    ])

    const spendingByCategory = Object.fromEntries(
        expenses.map((e) => [e.category, e._sum.amount ?? 0])
    )

    return budgets
        .map((b) => ({ ...b, spent: spendingByCategory[b.category] ?? 0 }))
        .filter((b) => b.spent >= b.amount * 0.8)
        .sort((a, b) => b.spent / b.amount - a.spent / a.amount)
}

// Crea o actualiza el presupuesto de una categoría (upsert)
export async function upsertBudget(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return

    const category = formData.get("category") as string
    const amount = parseFloat(formData.get("amount") as string)

    if (!category || !amount || amount <= 0) return

    await prisma.budget.upsert({
        where: { userId_category: { userId: session.user.id, category } },
        update: { amount },
        create: { category, amount, userId: session.user.id },
    })

    revalidatePath("/budgets")
}

// Elimina el presupuesto con el id indicado
export async function deleteBudget(id: string) {
    const session = await auth()
    if (!session?.user?.id) return

    await prisma.budget.delete({
        where: { id, userId: session.user.id },
    })

    revalidatePath("/budgets")
}
