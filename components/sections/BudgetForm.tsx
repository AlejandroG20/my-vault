"use client"

import { upsertBudget } from "@/lib/actions/budgets"
import { CATEGORIES } from "@/lib/categories"
import { PlusCircle } from "lucide-react"

export default function BudgetForm() {
    return (
        <div className="bg-white rounded-xl border border-primary-100 p-5">
            <h3 className="text-sm font-semibold font-heading text-primary-800 mb-4">
                Añadir presupuesto
            </h3>

            <form action={upsertBudget} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-primary-500">Categoría</label>
                    <select
                        name="category"
                        required
                        className="rounded-lg border border-primary-200 px-3 py-2 text-sm text-primary-900 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all bg-white"
                    >
                        <option value="">Selecciona una categoría</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs text-primary-500">Límite mensual (€)</label>
                    <input
                        name="amount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        placeholder="Ej: 150"
                        className="rounded-lg border border-primary-200 px-3 py-2 text-sm text-primary-900 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all"
                    />
                </div>

                <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-lg bg-accent-600 text-white py-2 text-sm font-medium hover:bg-accent-700 transition-colors cursor-pointer mt-1"
                >
                    <PlusCircle size={15} />
                    Guardar presupuesto
                </button>
            </form>
        </div>
    )
}
