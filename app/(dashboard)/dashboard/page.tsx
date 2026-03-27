import { getDashboardData } from "@/lib/actions/dashboard";
import { processSubscriptions } from "@/lib/actions/processSubscriptions";
import StatCard from "@/components/ui/StatCard";
import { Wallet, TrendingUp, TrendingDown, Target } from "lucide-react";

export default async function DashboardPage() {
  // Procesa las suscripciones
  await processSubscriptions();

  // Obtenemos los datos del mes actual desde el servidor
  const data = await getDashboardData();

  console.log("Dashboard data:", data);

  // Si no hay sesión activa, no renderizamos nada
  if (!data) return null;

  const { totalIncome, totalExpense, balance, goal } = data;

  // Calculamos el porcentaje de progreso hacia el objetivo (máximo 100%)
  const goalProgress = goal
    ? Math.min((balance / goal.amount) * 100, 100)
    : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold font-heading text-primary-900">Dashboard</h2>
        {/* Mostramos el mes y año actual en español */}
        <p className="text-sm text-primary-500 mt-1">
          Resumen de{" "}
          {new Date().toLocaleString("es-ES", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Tarjetas de resumen: balance, ingresos y gastos del mes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <StatCard
            title="Balance"
            amount={balance}
            icon={Wallet}
            variant="default"
          />
        </div>
        <StatCard
          title="Ingresos"
          amount={totalIncome}
          icon={TrendingUp}
          variant="income"
        />
        <StatCard
          title="Gastos"
          amount={totalExpense}
          icon={TrendingDown}
          variant="expense"
        />
      </div>

      {/* Barra de progreso del objetivo — solo se muestra si el usuario tiene uno */}
      {goal && (
        <div className="bg-white rounded-xl border border-primary-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target size={15} className="text-primary-400" />
              <span className="text-sm text-primary-500">{goal.name}</span>
            </div>
            <span className="text-sm font-medium text-primary-900">
              {goalProgress?.toFixed(0)}%
            </span>
          </div>
          {/* Barra de progreso: el ancho se calcula dinámicamente con el estilo inline */}
          <div className="w-full bg-primary-100 rounded-full h-2">
            <div
              className="bg-accent-600 h-2 rounded-full transition-all"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-primary-400">
              {balance.toLocaleString("es-ES", {
                style: "currency",
                currency: "EUR",
              })}{" "}
              ahorrados
            </span>
            <span className="text-xs text-primary-400">
              {goal.amount.toLocaleString("es-ES", {
                style: "currency",
                currency: "EUR",
              })}{" "}
              objetivo
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
