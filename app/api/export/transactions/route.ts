import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const session = await auth()
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = req.nextUrl
    const type = searchParams.get("type")
    const category = searchParams.get("category")
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    const transactions = await prisma.transaction.findMany({
        where: {
            userId: session.user.id,
            ...(type === "INCOME" || type === "EXPENSE" ? { type } : {}),
            ...(category ? { category } : {}),
            ...((dateFrom || dateTo) && {
                date: {
                    ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
                    ...(dateTo ? { lte: new Date(dateTo + "T23:59:59") } : {}),
                },
            }),
        },
        orderBy: { date: "desc" },
    })

    const rows = [
        ["Fecha", "Tipo", "Categoría", "Descripción", "Importe (€)"],
        ...transactions.map((t) => [
            new Date(t.date).toLocaleDateString("es-ES"),
            t.type === "INCOME" ? "Ingreso" : "Gasto",
            t.category,
            t.description ?? "",
            t.type === "INCOME"
                ? t.amount.toFixed(2)
                : (-t.amount).toFixed(2),
        ]),
    ]

    const csv = rows
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
        .join("\n")

    const filename = `transacciones-${new Date().toISOString().split("T")[0]}.csv`

    return new NextResponse("\uFEFF" + csv, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    })
}
