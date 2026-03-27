import { getTransactions } from "@/lib/actions/transactions"
import TransactionForm from "@/components/sections/TransactionForm"
import TransactionList from "@/components/sections/TransactionList"
import TransactionFilters from "@/components/sections/TransactionFilters"
import { Suspense } from "react"

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

  // Normalizamos y pasamos solo valores válidos para evitar consultas incorrectas
  const filters = {
    type: (params.type === "INCOME" || params.type === "EXPENSE" ? params.type : undefined) as "INCOME" | "EXPENSE" | undefined,
    category: params.category || undefined,
    dateFrom: params.dateFrom || undefined,
    dateTo: params.dateTo || undefined,
  }

  const transactions = await getTransactions(filters)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold font-heading text-primary-900">
          Transacciones
        </h2>
        <p className="text-sm text-primary-500 mt-1">
          Registra tus gastos e ingresos
        </p>
      </div>

      {/* Formulario para añadir una nueva transacción */}
      <TransactionForm />

      {/* Filtros: envueltos en Suspense porque usan useSearchParams */}
      <Suspense>
        <TransactionFilters />
      </Suspense>

      {/* Lista filtrada de transacciones */}
      <TransactionList transactions={transactions} />
    </div>
  )
}
