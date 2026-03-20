"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Devuelve el objetivo de ahorro del usuario, o null si no tiene ninguno definido
export async function getGoal() {
    const session = await auth()
    if (!session?.user?.id) return null

    return await prisma.goal.findUnique({
        where: { userId: session.user.id },
    })
}

// Crea o actualiza el objetivo de ahorro del usuario (upsert: insert + update en uno)
export async function upsertGoal(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return

    const name = formData.get("name") as string
    const amount = parseFloat(formData.get("amount") as string)

    // Validación mínima: ambos campos son obligatorios
    if (!name || !amount) return

    // Si ya existe un objetivo lo actualiza; si no, lo crea
    await prisma.goal.upsert({
        where: { userId: session.user.id },
        update: { name, amount },
        create: { name, amount, userId: session.user.id },
    })

    // Invalidamos ambas rutas porque el objetivo aparece en el dashboard y en /goal
    revalidatePath("/goal")
    revalidatePath("/dashboard")
}

// Elimina el objetivo de ahorro del usuario
export async function deleteGoal() {
    const session = await auth()
    if (!session?.user?.id) return

    await prisma.goal.delete({
        where: { userId: session.user.id },
    })

    // Invalidamos ambas rutas para reflejar que ya no hay objetivo
    revalidatePath("/goal")
    revalidatePath("/dashboard")
}
