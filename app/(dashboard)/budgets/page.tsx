import { getBudgets } from "@/lib/actions/budgets"
import BudgetForm from "@/components/sections/BudgetForm"
import BudgetList from "@/components/sections/BudgetList"

export default async function BudgetsPage() {
    const budgets = await getBudgets()

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-2xl font-bold font-heading text-primary-900">
                    Presupuesto mensual
                </h2>
                <p className="text-sm text-primary-400 mt-1">
                    Fija un límite por categoría y controla si te estás pasando
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <BudgetForm />
                </div>
                <div className="md:col-span-2">
                    <BudgetList budgets={budgets} />
                </div>
            </div>
        </div>
    )
}
