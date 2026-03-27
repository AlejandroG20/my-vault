import { getTransactions } from "@/lib/actions/transactions"
import TransactionForm from "@/components/sections/TransactionForm"
import TransactionList from "@/components/sections/TransactionList"
import TransactionFilters from "@/components/sections/TransactionFilters"
import { Suspense } from "react"
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react"

interface SearchParams {
  type?: string
  category?: string
  dateFrom?: string
  dateTo?: string
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  const filters = {
    type: (params.type === "INCOME" || params.type === "EXPENSE" ? params.type : undefined) as "INCOME" | "EXPENSE" | undefined,
    category: params.category || undefined,
    dateFrom: params.dateFrom || undefined,
    dateTo: params.dateTo || undefined,
  }

  const transactions = await getTransactions(filters)

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  const fmt = (n: number) =>
    n.toLocaleString("es-ES", { style: "currency", currency: "EUR" })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold font-heading text-primary-900">
          Transacciones
        </h2>
        <p className="text-sm text-primary-400">
          Registra y consulta todos tus movimientos financieros
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Ingresos */}
        <div className="bg-success-50 border border-success-100 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-success-100 flex items-center justify-center shrink-0">
            <ArrowUpCircle size={18} className="text-success-600" />
          </div>
          <div>
            <p className="text-xs text-success-700 font-medium">Ingresos</p>
            <p className="text-base font-bold font-heading text-success-800">
              {fmt(totalIncome)}
            </p>
          </div>
        </div>

        {/* Gastos */}
        <div className="bg-danger-50 border border-danger-100 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-danger-100 flex items-center justify-center shrink-0">
            <ArrowDownCircle size={18} className="text-danger-500" />
          </div>
          <div>
            <p className="text-xs text-danger-700 font-medium">Gastos</p>
            <p className="text-base font-bold font-heading text-danger-700">
              {fmt(totalExpense)}
            </p>
          </div>
        </div>

        {/* Balance */}
        <div
          className={`border rounded-xl px-4 py-3 flex items-center gap-3 ${
            balance >= 0
              ? "bg-accent-50 border-accent-100"
              : "bg-danger-50 border-danger-100"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              balance >= 0 ? "bg-accent-100" : "bg-danger-100"
            }`}
          >
            <Wallet
              size={18}
              className={balance >= 0 ? "text-accent-600" : "text-danger-500"}
            />
          </div>
          <div>
            <p
              className={`text-xs font-medium ${
                balance >= 0 ? "text-accent-700" : "text-danger-700"
              }`}
            >
              Balance
            </p>
            <p
              className={`text-base font-bold font-heading ${
                balance >= 0 ? "text-accent-700" : "text-danger-700"
              }`}
            >
              {balance >= 0 ? "+" : ""}
              {fmt(balance)}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <TransactionForm />

      {/* Filtros */}
      <Suspense>
        <TransactionFilters />
      </Suspense>

      {/* Lista */}
      <TransactionList transactions={transactions} />
    </div>
  )
}
