"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getInitialBalance(): Promise<number> {
    const session = await auth()
    if (!session?.user?.id) return 0

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { initialBalance: true },
    })

    return user?.initialBalance ?? 0
}

export async function updateInitialBalance(formData: FormData) {
    const session = await auth()
    if (!session?.user?.id) return

    const value = parseFloat(formData.get("initialBalance") as string)
    if (isNaN(value)) return

    await prisma.user.update({
        where: { id: session.user.id },
        data: { initialBalance: value },
    })

    revalidatePath("/dashboard")
    revalidatePath("/transactions")
}
