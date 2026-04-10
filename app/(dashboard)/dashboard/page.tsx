import { getDashboardData } from "@/lib/actions/dashboard";
import { processSubscriptions } from "@/lib/actions/processSubscriptions";
import { getUpcomingSubscriptions } from "@/lib/actions/subscriptions";
import { getExceededBudgets } from "@/lib/actions/budgets";
import StatCard from "@/components/ui/StatCard";
import UpcomingSubscriptions from "@/components/sections/UpcomingSubscriptions";
import ExceededBudgets from "@/components/sections/ExceededBudgets";
import InitialBalanceForm from "@/components/sections/InitialBalanceForm";
import { Wallet, TrendingUp, TrendingDown, Target } from "lucide-react";

export default async function DashboardPage() {
  // Procesa las suscripciones
  await processSubscriptions();

  const [data, upcomingSubscriptions, exceededBudgets] = await Promise.all([
    getDashboardData(),
    getUpcomingSubscriptions(7),
    getExceededBudgets(),
  ]);

  // Si no hay sesión activa, no renderizamos nada
  if (!data) return null;

  const { totalIncome, totalExpense, prevIncome, prevExpense, balance, initialBalance, goal } = data;

  const incomeTrend = prevIncome > 0 ? ((totalIncome - prevIncome) / prevIncome) * 100 : undefined;
  const expenseTrend = prevExpense > 0 ? ((totalExpense - prevExpense) / prevExpense) * 100 : undefined;

  // Calculamos el porcentaje de progreso hacia el objetivo (máximo 100%)
  const goalProgress = goal
    ? Math.min((balance / goal.amount) * 100, 100)
    : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold font-heading text-primary-900">Dashboard</h2>
        {/* Mostramos el mes y año actual en español */}
        <p className="text-sm text-primary-400 mt-1">
          Resumen de{" "}
          {new Date().toLocaleString("es-ES", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Tarjetas de resumen: balance, ingresos y gastos del mes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <StatCard
            title="Balance Total"
            amount={balance}
            icon={Wallet}
            variant="default"
          />
          <InitialBalanceForm initialBalance={initialBalance} />
        </div>
        <StatCard
          title="Ingresos del Mes"
          amount={totalIncome}
          icon={TrendingUp}
          variant="income"
          trend={incomeTrend}
        />
        <StatCard
          title="Gastos del Mes"
          amount={totalExpense}
          icon={TrendingDown}
          variant="expense"
          trend={expenseTrend}
        />
      </div>

      {/* Aviso de presupuestos superados o casi al límite */}
      <ExceededBudgets budgets={exceededBudgets} />

      {/* Aviso de suscripciones próximas a cobrar */}
      <UpcomingSubscriptions subscriptions={upcomingSubscriptions} />

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
