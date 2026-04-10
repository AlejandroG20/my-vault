"use client";

import { useRef, useState } from "react";
import { updateSubscription } from "@/lib/actions/subscriptions";
import { CATEGORIES } from "@/lib/categories";
import { Pencil, X, Save } from "lucide-react";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  dayOfMonth: number;
  category: string;
  active: boolean;
  lastCharged: Date | null;
}

export default function SubscriptionEditModal({ subscription }: { subscription: Subscription }) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await updateSubscription(subscription.id, formData);
    setOpen(false);
  }

  const inputClass =
    "rounded-lg border border-primary-200 bg-primary-50 px-3 py-2.5 text-sm text-primary-900 placeholder:text-primary-300 outline-none focus:bg-white focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all";

  const selectClass =
    "rounded-lg border border-primary-200 bg-primary-50 px-3 py-2.5 text-sm text-primary-900 outline-none focus:bg-white focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all cursor-pointer";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-primary-200 hover:text-accent-600 hover:bg-accent-50 transition-all cursor-pointer"
      >
        <Pencil size={13} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="bg-white rounded-xl border border-primary-100 shadow-xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-primary-50 bg-primary-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-accent-100 flex items-center justify-center">
                  <Pencil size={13} className="text-accent-600" />
                </div>
                <h3 className="text-sm font-semibold font-heading text-primary-800">
                  Editar suscripción
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-primary-300 hover:text-primary-600 hover:bg-primary-100 transition-all cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Form */}
            <form ref={formRef} action={handleSubmit} className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-primary-500 uppercase tracking-wide">
                    Nombre
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    defaultValue={subscription.name}
                    placeholder="Ej: Netflix"
                    className={inputClass}
                  />
                </div>

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
                    defaultValue={subscription.amount}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-primary-500 uppercase tracking-wide">
                    Día del mes
                  </label>
                  <input
                    name="dayOfMonth"
                    type="number"
                    min="1"
                    max="28"
                    required
                    defaultValue={subscription.dayOfMonth}
                    className={inputClass}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-primary-500 uppercase tracking-wide">
                    Categoría
                  </label>
                  <select name="category" required defaultValue={subscription.category} className={selectClass}>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg border border-primary-200 text-primary-600 hover:bg-primary-50 py-2.5 text-sm font-semibold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-accent-600 hover:bg-accent-700 active:scale-[0.98] text-white py-2.5 text-sm font-semibold transition-all cursor-pointer shadow-sm"
                >
                  <Save size={14} />
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
