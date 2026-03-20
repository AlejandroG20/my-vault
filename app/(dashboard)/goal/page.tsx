import { getGoal } from "@/lib/actions/goal";
import { getDashboardData } from "@/lib/actions/dashboard";
import GoalForm from "@/components/sections/GoalForm";
import { Target } from "lucide-react";

export default async function GoalPage() {
  // Cargamos en paralelo el objetivo y los datos del dashboard para reducir latencia
  const [goal, data] = await Promise.all([getGoal(), getDashboardData()]);

  // Si no hay datos del dashboard usamos 0 como balance por defecto
  const balance = data?.balance ?? 0;

  // Porcentaje de progreso hacia el objetivo (máximo 100%)
  const goalProgress = goal
    ? Math.min((balance / goal.amount) * 100, 100)
    : null;

  // Cantidad que falta para alcanzar el objetivo (mínimo 0, nunca negativo)
  const remaining = goal ? Math.max(goal.amount - balance, 0) : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold font-heading text-primary-900">
          Objetivo de ahorro
        </h2>
        <p className="text-sm text-primary-400 mt-1">
          Define tu meta y sigue tu progreso
        </p>
      </div>

      {/* Si hay objetivo mostramos el resumen visual; si no, solo el formulario vacío */}
      {goal ? (
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-primary-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
                <Target size={18} className="text-accent-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold font-heading text-primary-900">
                  {goal.name}
                </h3>
                <p className="text-xs text-primary-400">Objetivo activo</p>
              </div>
            </div>

            {/* Barra de progreso: ancho calculado dinámicamente con estilo inline */}
            <div className="flex justify-between mb-2">
              <span className="text-sm text-primary-500">Progreso</span>
              <span className="text-sm font-semibold text-primary-900">
                {goalProgress?.toFixed(1)}%
              </span>
            </div>

            <div className="w-full bg-primary-100 rounded-full h-3 mb-4">
              <div
                className="bg-accent-600 h-3 rounded-full transition-all"
                style={{ width: `${goalProgress}%` }}
              />
            </div>

            {/* Tres métricas: balance ahorrado, meta total y cantidad restante */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-primary-50 rounded-lg p-3 text-center">
                <p className="text-xs text-primary-400 mb-1">Ahorrado</p>
                <p className="text-sm font-semibold text-success-600">
                  {balance.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
              </div>
              <div className="bg-primary-50 rounded-lg p-3 text-center">
                <p className="text-xs text-primary-400 mb-1">Objetivo</p>
                <p className="text-sm font-semibold text-primary-900">
                  {goal.amount.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
              </div>
              <div className="bg-primary-50 rounded-lg p-3 text-center">
                <p className="text-xs text-primary-400 mb-1">Restante</p>
                <p className="text-sm font-semibold text-danger-500">
                  {remaining?.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Formulario en modo edición cuando ya existe un objetivo */}
          <GoalForm goal={goal} />
        </div>
      ) : (
        /* Formulario en modo creación cuando no hay objetivo todavía */
        <GoalForm goal={null} />
      )}
    </div>
  );
}
