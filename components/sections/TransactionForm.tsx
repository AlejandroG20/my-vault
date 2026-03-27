"use client";

import { useRef } from "react";
import { createTransaction } from "@/lib/actions/transactions";
import { CATEGORIES } from "@/lib/categories";
import { PlusCircle, Sparkles } from "lucide-react";

export default function TransactionForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await createTransaction(formData);
    formRef.current?.reset();
  }

  const today = new Date().toISOString().split("T")[0];

  const inputClass =
    "rounded-lg border border-primary-200 bg-primary-50 px-3 py-2.5 text-sm text-primary-900 placeholder:text-primary-300 outline-none focus:bg-white focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all";

  const selectClass =
    "rounded-lg border border-primary-200 bg-primary-50 px-3 py-2.5 text-sm text-primary-900 outline-none focus:bg-white focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all cursor-pointer";

  return (
    <div className="bg-white rounded-xl border border-primary-100 overflow-hidden shadow-sm">
      {/* Card header */}
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-primary-50 bg-primary-50/60">
        <div className="w-7 h-7 rounded-lg bg-accent-100 flex items-center justify-center">
          <Sparkles size={13} className="text-accent-600" />
        </div>
        <h3 className="text-sm font-semibold font-heading text-primary-800">
          Nueva transacción
        </h3>
      </div>

      <form ref={formRef} action={handleSubmit} className="p-5 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Importe */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-primary-500 uppercase tracking-wide">
              Importe (€)
            </label>
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              className={inputClass}
            />
          </div>

          {/* Tipo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-primary-500 uppercase tracking-wide">
              Tipo
            </label>
            <select name="type" required className={selectClass}>
              <option value="EXPENSE">Gasto</option>
              <option value="INCOME">Ingreso</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Categoría */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-primary-500 uppercase tracking-wide">
              Categoría
            </label>
            <select name="category" required className={selectClass}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-primary-500 uppercase tracking-wide">
              Fecha
            </label>
            <input
              name="date"
              type="date"
              required
              defaultValue={today}
              className={inputClass}
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-primary-500 uppercase tracking-wide">
            Descripción <span className="normal-case font-normal text-primary-300">(opcional)</span>
          </label>
          <input
            name="description"
            type="text"
            placeholder="Ej: Compra semanal"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-accent-600 hover:bg-accent-700 active:scale-[0.98] text-white py-2.5 text-sm font-semibold transition-all mt-1 cursor-pointer shadow-sm"
        >
          <PlusCircle size={15} />
          Añadir transacción
        </button>
      </form>
    </div>
  );
}
