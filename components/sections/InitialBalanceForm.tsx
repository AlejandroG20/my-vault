"use client"

import { updateInitialBalance } from "@/lib/actions/user"
import { Pencil } from "lucide-react"
import { useState } from "react"

interface InitialBalanceFormProps {
  initialBalance: number
}

export default function InitialBalanceForm({ initialBalance }: InitialBalanceFormProps) {
  const [editing, setEditing] = useState(false)

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-600 transition-colors mt-1"
      >
        <Pencil size={11} />
        Saldo inicial: {initialBalance.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
      </button>
    )
  }

  return (
    <form
      action={async (formData) => {
        await updateInitialBalance(formData)
        setEditing(false)
      }}
      className="flex items-center gap-2 mt-1"
    >
      <input
        type="number"
        name="initialBalance"
        defaultValue={initialBalance}
        step="0.01"
        autoFocus
        className="w-32 text-xs border border-primary-200 rounded-lg px-2 py-1 focus:outline-none focus:border-accent-400"
      />
      <button
        type="submit"
        className="text-xs bg-accent-600 text-white px-2 py-1 rounded-lg hover:bg-accent-700 transition-colors"
      >
        Guardar
      </button>
      <button
        type="button"
        onClick={() => setEditing(false)}
        className="text-xs text-primary-400 hover:text-primary-600 transition-colors"
      >
        Cancelar
      </button>
    </form>
  )
}
