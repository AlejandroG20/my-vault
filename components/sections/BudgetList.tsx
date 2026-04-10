"use client"

import { deleteBudget } from "@/lib/actions/budgets"
import { CATEGORY_CONFIG } from "@/lib/categories"
import { Trash2, PiggyBank } from "lucide-react"

interface BudgetWithSpent {
    id: string
    category: string
    amount: number
    spent: number
}

interface BudgetListProps {
    budgets: BudgetWithSpent[]
}

function getBarColor(pct: number) {
    if (pct >= 100) return "bg-danger-500"
    if (pct >= 80) return "bg-warning-500"
    return "bg-success-500"
}

function getStatusLabel(pct: number) {
    if (pct >= 100) return { text: "Superado", cls: "text-danger-500 bg-danger-50" }
    if (pct >= 80) return { text: "Casi al límite", cls: "text-warning-600 bg-warning-50" }
    return { text: "En control", cls: "text-success-600 bg-success-50" }
}

export default function BudgetList({ budgets }: BudgetListProps) {
    if (budgets.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-primary-100 p-12 flex flex-col items-center gap-3 text-center shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                    <PiggyBank size={22} className="text-primary-300" />
                </div>
                <div>
                    <p className="text-sm font-medium text-primary-500">Sin presupuestos</p>
                    <p className="text-xs text-primary-300 mt-0.5">
                        Fija un límite por categoría usando el formulario de la izquierda
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            {budgets.map((b) => {
                const pct = Math.min((b.spent / b.amount) * 100, 100)
                const config = CATEGORY_CONFIG[b.category]
                const Icon = config?.icon
                const status = getStatusLabel(pct)
                const remaining = b.amount - b.spent

                return (
                    <div
                        key={b.id}
                        className="bg-white rounded-xl border border-primary-100 p-5"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                {Icon && (
                                    <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                                        <Icon size={16} className={config.color} />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-medium text-primary-900">{b.category}</p>
                                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${status.cls}`}>
                                        {status.text}
                                    </span>
                                </div>
                            </div>

                            <form action={deleteBudget.bind(null, b.id)}>
                                <button
                                    type="submit"
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-primary-300 hover:text-danger-500 hover:bg-danger-50 transition-colors cursor-pointer"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </form>
                        </div>

                        {/* Barra de progreso */}
                        <div className="w-full bg-primary-100 rounded-full h-2.5 mb-3">
                            <div
                                className={`h-2.5 rounded-full transition-all ${getBarColor(pct)}`}
                                style={{ width: `${pct}%` }}
                            />
                        </div>

                        {/* Métricas */}
                        <div className="flex justify-between text-xs text-primary-500">
                            <span>
                                Gastado:{" "}
                                <span className="font-semibold text-primary-900">
                                    {b.spent.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                                </span>
                            </span>
                            <span>
                                {remaining >= 0 ? "Disponible:" : "Excedido:"}{" "}
                                <span className={`font-semibold ${remaining >= 0 ? "text-success-600" : "text-danger-500"}`}>
                                    {Math.abs(remaining).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                                </span>
                            </span>
                            <span>
                                Límite:{" "}
                                <span className="font-semibold text-primary-900">
                                    {b.amount.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
                                </span>
                            </span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
