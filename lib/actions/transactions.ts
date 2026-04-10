"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { TransactionItem } from "@/types/prisma"
import { PAGE_SIZE } from "@/lib/constants"

export interface TransactionFilters {
    type?: "INCOME" | "EXPENSE"
    category?: string
    dateFrom?: string
    dateTo?: string
    page?: number
}

// Devuelve transacciones del usuario, opcionalmente filtradas por tipo, categoría y rango de fechas
export async function getTransactions(filters?: TransactionFilters): Promise<TransactionItem[]> {
    const session = await auth()
    if (!session?.user?.id) return []

    const where = {
        userId: session.user.id,
        ...(filters?.type && { type: filters.type }),
        ...(filters?.category && { category: filters.category }),
        ...((filters?.dateFrom || filters?.dateTo) && {
            date: {
                ...(filters.dateFrom && { gte: new Date(filters.dateFrom) }),
                ...(filters.dateTo && { lte: new Date(filters.dateTo + "T23:59:59") }),
            },
        }),
    }

    if (filters?.page !== undefined) {
        return await prisma.transaction.findMany({
            where,
            orderBy: { date: "desc" },
            take: PAGE_SIZE,
            skip: (filters.page - 1) * PAGE_SIZE,
        })
    }

    return await prisma.transaction.findMany({
        where,
        orderBy: { date: "desc" },
    })
}

export async function countTransactions(filters?: Omit<TransactionFilters, "page">): Promise<number> {
    const session = await auth()
    if (!session?.user?.id) return 0

    return await prisma.transaction.count({
        where: {
            userId: session.user.id,
            ...(filters?.type && { type: filters.type }),
            ...(filters?.category && { category: filters.category }),
            ...((filters?.dateFrom || filters?.dateTo) && {
                date: {
                    ...(filters.dateFrom && { gte: new Date(filters.dateFrom) }),
                    ...(filters.dateTo && { lte: new Date(filters.dateTo + "T23:59:59") }),
                },
            }),
        },
    })
}

// Crea una nueva transacción con los datos del formulario
export async function createTransaction(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return

    // Extraemos y tipamos cada campo del formulario
    const amount = parseFloat(formData.get("amount") as string)
    const type = formData.get("type") as "INCOME" | "EXPENSE"
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    const date = formData.get("date") as string

    // Validación mínima: campos obligatorios presentes
    if (!amount || !type || !category || !date) return

    await prisma.transaction.create({
        data: {
            amount,
            type,
            category,
            description: description || null, // La descripción es opcional
            date: new Date(date),
            userId: session.user.id,
        },
    })

    // Invalidamos la caché de estas rutas para que muestren los datos actualizados
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
}

// Actualiza los campos de una transacción existente
export async function updateTransaction(id: string, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return

    const amount = parseFloat(formData.get("amount") as string)
    const type = formData.get("type") as "INCOME" | "EXPENSE"
    const category = formData.get("category") as string
    const description = formData.get("description") as string
    const date = formData.get("date") as string

    if (!amount || !type || !category || !date) return

    await prisma.transaction.update({
        where: { id, userId: session.user.id },
        data: {
            amount,
            type,
            category,
            description: description || null,
            date: new Date(date),
        },
    })

    revalidatePath("/transactions")
    revalidatePath("/dashboard")
}

// Elimina una transacción por id, asegurándonos de que pertenece al usuario en sesión
export async function deleteTransaction(id: string) {
    const session = await auth()
    if (!session?.user?.id) return

    await prisma.transaction.delete({
        where: {
            id,
            userId: session.user.id, // Evita que un usuario borre transacciones de otro
        },
    })

    // Invalidamos la caché para reflejar el borrado en las vistas
    revalidatePath("/transactions")
    revalidatePath("/dashboard")
}