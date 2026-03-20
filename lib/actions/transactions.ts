"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Devuelve todas las transacciones del usuario ordenadas de más reciente a más antigua
export async function getTransactions() {
    const session = await auth()
    if (!session?.user?.id) return []

    return await prisma.transaction.findMany({
        where: { userId: session.user.id },
        orderBy: { date: "desc" },
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
