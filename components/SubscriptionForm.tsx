"use client";

import { useRef } from "react";
import { createSubscription } from "@/lib/actions/subscriptions";
import { CATEGORIES } from "@/lib/categories";
import { PlusCircle } from "lucide-react";

export default function SubscriptionForm() {
  // Ref al formulario para resetearlo tras el envío sin recargar la página
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    // Llamamos a la Server Action y limpiamos el formulario al terminar
    await createSubscription(formData);
    formRef.current?.reset();
  }

  return (
    <div className="bg-white rounded-xl border border-primary-100 p-5">
      <h3 className="text-sm font-medium font-heading text-primary-900 mb-4">
        Nueva suscripción
      </h3>

      <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-primary-500">Nombre</label>
            <input
              name="name"
              type="text"
              required
              placeholder="Ej: Netflix"
              className="rounded-lg border border-primary-200 px-3 py-2 text-sm text-primary-900 placeholder:text-primary-300 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-primary-500">Importe (€)</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              className="rounded-lg border border-primary-200 px-3 py-2 text-sm text-primary-900 placeholder:text-primary-300 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Día del mes en que se cobra — limitado a 28 para evitar problemas con febrero */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-primary-500">Día del mes</label>
            <input
              name="dayOfMonth"
              type="number"
              min="1"
              max="28"
              required
              placeholder="Ej: 15"
              className="rounded-lg border border-primary-200 px-3 py-2 text-sm text-primary-900 placeholder:text-primary-300 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all"
            />
          </div>

          {/* Categorías cargadas desde la constante centralizada CATEGORIES */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-primary-500">Categoría</label>
            <select
              name="category"
              required
              className="rounded-lg border border-primary-200 px-3 py-2 text-sm text-primary-900 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all bg-white cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-accent-600 text-white py-2 text-sm font-medium hover:bg-accent-700 active:scale-[0.98] transition-all mt-1 cursor-pointer"
        >
          <PlusCircle size={15} />
          Añadir suscripción
        </button>
      </form>
    </div>
  );
}
