"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Devuelve todas las suscripciones del usuario ordenadas por fecha de creación descendente
export async function getSubscriptions() {
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
    const dayOfMonth = parseInt(formData.get("dayOfMonth") as string) // Día del mes en que se cobra
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
