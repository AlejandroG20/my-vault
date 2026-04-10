import { getTransactions, countTransactions } from "@/lib/actions/transactions"
import { PAGE_SIZE } from "@/lib/constants"
import { getInitialBalance } from "@/lib/actions/user"
import TransactionForm from "@/components/sections/TransactionForm"
import TransactionList from "@/components/sections/TransactionList"
import TransactionFilters from "@/components/sections/TransactionFilters"
import InitialBalanceForm from "@/components/sections/InitialBalanceForm"
import { Suspense } from "react"
import { ArrowDownCircle, ArrowUpCircle, Wallet, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import ExportButton from "@/components/sections/ExportButton"

interface SearchParams {
  type?: string
  category?: string
  dateFrom?: string
  dateTo?: string
  page?: string
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  const page = Math.max(1, parseInt(params.page ?? "1") || 1)

  const filters = {
    type: (params.type === "INCOME" || params.type === "EXPENSE" ? params.type : undefined) as "INCOME" | "EXPENSE" | undefined,
    category: params.category || undefined,
    dateFrom: params.dateFrom || undefined,
    dateTo: params.dateTo || undefined,
  }

  const [transactions, allTransactions, initialBalance, total] = await Promise.all([
    getTransactions({ ...filters, page }),
    getTransactions(),
    getInitialBalance(),
    countTransactions(filters),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const totalIncome = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0)

  const allTimeIncome = allTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0)

  const allTimeExpense = allTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = initialBalance + allTimeIncome - allTimeExpense

  // Construye una URL preservando todos los filtros actuales salvo `page`
  function pageUrl(p: number) {
    const sp = new URLSearchParams()
    if (filters.type) sp.set("type", filters.type)
    if (filters.category) sp.set("category", filters.category)
    if (filters.dateFrom) sp.set("dateFrom", filters.dateFrom)
    if (filters.dateTo) sp.set("dateTo", filters.dateTo)
    sp.set("page", String(p))
    return `?${sp.toString()}`
  }

  const fmt = (n: number) =>
    n.toLocaleString("es-ES", { style: "currency", currency: "EUR" })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold font-heading text-primary-900">
            Transacciones
          </h2>
          <p className="text-sm text-primary-400">
            Registra y consulta todos tus movimientos financieros
          </p>
        </div>
        <Suspense>
          <ExportButton />
        </Suspense>
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
            <InitialBalanceForm initialBalance={initialBalance} />
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

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-primary-400">
            Página {page} de {totalPages} · {total} registros
          </span>
          <div className="flex items-center gap-1">
            {page > 1 ? (
              <Link
                href={pageUrl(page - 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-primary-200 text-primary-500 hover:bg-primary-50 transition-colors"
              >
                <ChevronLeft size={15} />
              </Link>
            ) : (
              <span className="w-8 h-8 rounded-lg flex items-center justify-center border border-primary-100 text-primary-200 cursor-not-allowed">
                <ChevronLeft size={15} />
              </span>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("…")
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-primary-300">…</span>
                ) : (
                  <Link
                    key={p}
                    href={pageUrl(p as number)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                      p === page
                        ? "bg-accent-600 text-white"
                        : "border border-primary-200 text-primary-500 hover:bg-primary-50"
                    }`}
                  >
                    {p}
                  </Link>
                )
              )}
            {page < totalPages ? (
              <Link
                href={pageUrl(page + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-primary-200 text-primary-500 hover:bg-primary-50 transition-colors"
              >
                <ChevronRight size={15} />
              </Link>
            ) : (
              <span className="w-8 h-8 rounded-lg flex items-center justify-center border border-primary-100 text-primary-200 cursor-not-allowed">
                <ChevronRight size={15} />
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
