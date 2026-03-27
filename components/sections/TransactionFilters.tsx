"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import { X } from "lucide-react"
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

  // Construye una nueva URL con el parámetro actualizado, preservando el resto
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

  return (
    <div className="bg-white rounded-xl border border-primary-100 p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-primary-700">Filtros</p>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-primary-400 hover:text-danger-500 transition-colors cursor-pointer"
          >
            <X size={12} />
            Limpiar ({activeCount})
          </button>
        )}
      </div>

      {/* Tipo: pills */}
      <div className="flex gap-2 flex-wrap">
        {TIPOS.map((t) => (
          <button
            key={t.value}
            onClick={() => setParam("type", t.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              type === t.value
                ? "bg-primary-900 text-white"
                : "bg-primary-50 text-primary-600 hover:bg-primary-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Categoría + fechas en fila */}
      <div className="flex flex-wrap gap-3">
        {/* Selector de categoría */}
        <select
          value={category}
          onChange={(e) => setParam("category", e.target.value)}
          className="text-sm border border-primary-100 rounded-lg px-3 py-1.5 text-primary-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 cursor-pointer"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Fecha desde */}
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-primary-400 whitespace-nowrap">Desde</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setParam("dateFrom", e.target.value)}
            className="text-sm border border-primary-100 rounded-lg px-3 py-1.5 text-primary-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 cursor-pointer"
          />
        </div>

        {/* Fecha hasta */}
        <div className="flex items-center gap-1.5">
          <label className="text-xs text-primary-400 whitespace-nowrap">Hasta</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setParam("dateTo", e.target.value)}
            className="text-sm border border-primary-100 rounded-lg px-3 py-1.5 text-primary-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
