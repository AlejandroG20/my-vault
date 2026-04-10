"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import type { SubscriptionItem } from "@/types/prisma"

// Devuelve todas las suscripciones del usuario ordenadas por fecha de creación descendente
export async function getSubscriptions(): Promise<SubscriptionItem[]> {
    const session = await auth()
    if (!session?.user?.id) return []

    return await prisma.subscription.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    })
}

// Crea una nueva suscripción con los datos del formulario
export async function createSubscription(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return

    // Extraemos y convertimos cada campo al tipo correcto
    const name = formData.get("name") as string
    const amount = parseFloat(formData.get("amount") as string)
    const dayOfMonth = parseInt(formData.get("dayOfMonth") as string)
    const category = formData.get("category") as string

    // Validación mínima: todos los campos son obligatorios
    if (!name || !amount || !dayOfMonth || !category) return

    await prisma.subscription.create({
        data: {
            name,
            amount,
            dayOfMonth,
            category,
            userId: session.user.id,
        },
    })

    // Invalidamos la caché para reflejar la nueva suscripción en la vista
    revalidatePath("/subscriptions")
}

// Elimina una suscripción por id, verificando que pertenece al usuario en sesión
export async function deleteSubscription(id: string) {
    const session = await auth()
    if (!session?.user?.id) return

    await prisma.subscription.delete({
        where: {
            id,
            userId: session.user.id, // Evita que un usuario borre suscripciones de otro
        },
    })

    revalidatePath("/subscriptions")
}

// Devuelve las suscripciones activas cuyo próximo cobro cae en los próximos `daysAhead` días
export async function getUpcomingSubscriptions(daysAhead: number = 7) {
    const session = await auth()
    if (!session?.user?.id) return []

    const subscriptions = await prisma.subscription.findMany({
        where: { userId: session.user.id, active: true },
    })

    const today = new Date()
    const todayDay = today.getDate()
    const todayMonth = today.getMonth()
    const todayYear = today.getFullYear()
    const todayStart = new Date(todayYear, todayMonth, todayDay)

    return subscriptions
        .map((sub) => {
            // Si ya cobró este mes o el día ya pasó, el próximo cobro es el mes siguiente
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
        .filter((sub) => sub.daysUntil >= 0 && sub.daysUntil <= daysAhead)
        .sort((a, b) => a.daysUntil - b.daysUntil)
}

// Actualiza los campos editables de una suscripción existente
export async function updateSubscription(id: string, formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return

    const name = formData.get("name") as string
    const amount = parseFloat(formData.get("amount") as string)
    const dayOfMonth = parseInt(formData.get("dayOfMonth") as string)
    const category = formData.get("category") as string

    if (!name || !amount || !dayOfMonth || !category) return

    await prisma.subscription.update({
        where: { id, userId: session.user.id },
        data: { name, amount, dayOfMonth, category },
    })

    revalidatePath("/subscriptions")
    revalidatePath("/dashboard")
}

// Activa o desactiva una suscripción según el valor de `active`
export async function toggleSubscription(id: string, active: boolean) {
    const session = await auth()
    if (!session?.user?.id) return

    await prisma.subscription.update({
        where: {
            id,
            userId: session.user.id,
        },
        data: { active },
    })

    revalidatePath("/subscriptions")
}