"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { CATEGORIES } from "@/lib/categories"

const TIPOS = [
  { label: "Todos", value: "" },
  { label: "Ingresos", value: "INCOME" },
  { label: "Gastos", value: "EXPENSE" },
]

export default function TransactionFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const type = searchParams.get("type") ?? ""
  const category = searchParams.get("category") ?? ""
  const dateFrom = searchParams.get("dateFrom") ?? ""
  const dateTo = searchParams.get("dateTo") ?? ""

  const activeCount = [type, category, dateFrom, dateTo].filter(Boolean).length

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const clearAll = useCallback(() => {
    router.push(pathname)
  }, [router, pathname])

  const controlClass =
    "text-sm border border-primary-200 bg-primary-50 rounded-lg px-3 py-2 text-primary-700 focus:outline-none focus:bg-white focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all cursor-pointer"

  return (
    <div className="bg-white rounded-xl border border-primary-100 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-primary-50 bg-primary-50/60">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={13} className="text-primary-400" />
          <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide">
            Filtros
          </p>
          {activeCount > 0 && (
            <span className="bg-accent-100 text-accent-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>

        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-primary-400 hover:text-danger-500 transition-colors cursor-pointer"
          >
            <X size={11} />
            Limpiar
          </button>
        )}
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Pills de tipo */}
        <div className="flex gap-2 flex-wrap">
          {TIPOS.map((t) => {
            const isActive = type === t.value
            const colorClass =
              t.value === "INCOME"
                ? isActive
                  ? "bg-success-500 text-white border-success-500"
                  : "bg-primary-50 text-primary-600 border-primary-200 hover:bg-success-50 hover:text-success-700 hover:border-success-200"
                : t.value === "EXPENSE"
                ? isActive
                  ? "bg-danger-500 text-white border-danger-500"
                  : "bg-primary-50 text-primary-600 border-primary-200 hover:bg-danger-50 hover:text-danger-600 hover:border-danger-200"
                : isActive
                ? "bg-accent-600 text-white border-accent-600"
                : "bg-primary-50 text-primary-600 border-primary-200 hover:bg-accent-50 hover:text-accent-700 hover:border-accent-200"

            return (
              <button
                key={t.value}
                onClick={() => setParam("type", t.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${colorClass}`}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Categoría + fechas */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
          <select
            value={category}
            onChange={(e) => setParam("category", e.target.value)}
            className={`w-full sm:w-auto ${controlClass}`}
          >
            <option value="">Todas las categorías</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <label className="text-xs font-medium text-primary-400 whitespace-nowrap">
                Desde
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setParam("dateFrom", e.target.value)}
                className={`flex-1 sm:flex-none ${controlClass}`}
              />
            </div>

            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <label className="text-xs font-medium text-primary-400 whitespace-nowrap">
                Hasta
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setParam("dateTo", e.target.value)}
                className={`flex-1 sm:flex-none ${controlClass}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
