"use client";

import { useRef } from "react";
import { upsertGoal, deleteGoal } from "@/lib/actions/goal";
import { Target, Trash2 } from "lucide-react";

interface GoalFormProps {
  goal: { name: string; amount: number } | null;
}

export default function GoalForm({ goal }: GoalFormProps) {
  // Ref disponible por si se necesita resetear el formulario en el futuro
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="bg-white rounded-xl border border-primary-100 p-5">
      {/* El título cambia según si estamos creando o editando */}
      <h3 className="text-sm font-semibold font-heading text-primary-800 mb-4">
        {goal ? "Editar objetivo" : "Crear objetivo"}
      </h3>

      {/* upsertGoal crea el objetivo si no existe o lo actualiza si ya hay uno */}
      <form ref={formRef} action={upsertGoal} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-primary-500">
            Nombre del objetivo
          </label>
          {/* defaultValue prerellena el campo cuando estamos editando */}
          <input
            name="name"
            type="text"
            required
            defaultValue={goal?.name ?? ""}
            placeholder="Ej: Fondo de emergencia"
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm text-primary-900 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-primary-500">
            Importe objetivo (€)
          </label>
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={goal?.amount ?? ""}
            placeholder="Ej: 3000"
            className="rounded-lg border border-primary-200 px-3 py-2 text-sm text-primary-900 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all"
          />
        </div>

        <div className="flex gap-2 mt-1">
          {/* Botón principal: guarda cambios si hay objetivo, crea uno nuevo si no */}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 flex-1 rounded-lg bg-accent-600 text-white py-2 text-sm font-medium hover:bg-accent-700 transition-colors cursor-pointer"
          >
            <Target size={15} />
            {goal ? "Guardar cambios" : "Crear objetivo"}
          </button>

          {/* Botón de borrado: solo visible cuando ya existe un objetivo */}
          {goal && (
            <button
              type="submit"
              formAction={deleteGoal}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-primary-300 hover:text-danger-500 hover:bg-danger-50 transition-colors cursor-pointer border border-primary-200"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
