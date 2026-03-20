"use client";

import { useRef } from "react";
import { createTransaction } from "@/lib/actions/transactions";
import { CATEGORIES } from "@/lib/categories";
import { PlusCircle } from "lucide-react";

export default function TransactionForm() {
  // Ref al formulario para resetearlo tras el envío sin recargar la página
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    // Llamamos a la Server Action y luego limpiamos los campos del formulario
    await createTransaction(formData);
    formRef.current?.reset();
  }

  // Fecha de hoy en formato YYYY-MM-DD para prerellenar el campo de fecha
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-xl border border-primary-100 p-5">
      <h3 className="text-sm font-medium text-primary-900 mb-4">
        Nueva transacción
      </h3>

      <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-primary-500">Importe (€)</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              className="rounded-lg border border-primary-200 px-3 py-2 text-sm text-primary-900 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all"
            />
          </div>

          {/* Selector entre gasto e ingreso */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-primary-500">Tipo</label>
            <select
              name="type"
              required
              className="rounded-lg border border-primary-200 px-3 py-2 text-sm text-primary-900 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all bg-white"
            >
              <option value="EXPENSE">Gasto</option>
              <option value="INCOME">Ingreso</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Categorías cargadas desde la constante centralizada CATEGORIES */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-primary-500">Categoría</label>
            <select
              name="category"
              required
              className="rounded-lg border border-primary-200 px-3 py-2 text-sm text-primary-900 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha prerrellenada con el día de hoy */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-primary-500">Fecha</label>
            <input
              name="date"
              type="date"
              required
              defaultValue={today}
              className="rounded-lg border border-primary-200 px-3 py-2 text-sm text-primary-900 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-primary-500">
            Descripción (opcional)
          </label>
          <input
            name="description"
            type="text"
            placeholder="Ej: Compra semanal"
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm text-primary-900 placeholder:text-primary-300 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all"
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-accent-600 text-white py-2 text-sm font-medium hover:bg-accent-700 active:scale-[0.98] transition-all mt-1"
        >
          <PlusCircle size={15} />
          Añadir transacción
        </button>
      </form>
    </div>
  );
}
