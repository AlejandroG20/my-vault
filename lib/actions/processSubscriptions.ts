"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Procesa las suscripciones activas del usuario y genera transacciones automáticas
// cuando llega el día de cobro del mes. Evita cobros duplicados en el mismo mes.
export async function processSubscriptions() {
    const session = await auth()
    if (!session?.user?.id) return

    const userId = session.user.id
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Solo traemos las suscripciones activas del usuario
    const subscriptions = await prisma.subscription.findMany({
        where: { userId, active: true },
    })

    for (const sub of subscriptions) {
        // Comprobamos si ya se cobró en el mes actual para evitar duplicados
        const alreadyCharged =
            sub.lastCharged &&
            sub.lastCharged.getMonth() === currentMonth &&
            sub.lastCharged.getFullYear() === currentYear

        if (alreadyCharged) continue

        // Calculamos la fecha exacta de cobro de este mes según el día configurado
        const chargeDay = new Date(currentYear, currentMonth, sub.dayOfMonth)
        // Normalizamos "hoy" sin hora para comparar solo por fecha
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

        // Si el día de cobro todavía no ha llegado, saltamos esta suscripción
        if (chargeDay > todayStart) continue

        // Creamos una transacción de gasto automática por el importe de la suscripción
        await prisma.transaction.create({
            data: {
                amount: sub.amount,
                type: "EXPENSE",
                category: "Suscripciones",
                description: `Suscripción: ${sub.name}`,
                date: chargeDay,
                userId,
            },
        })

        // Actualizamos lastCharged para que no se vuelva a cobrar en este mes
        await prisma.subscription.update({
            where: { id: sub.id },
            data: { lastCharged: now },
        })
    }

}
