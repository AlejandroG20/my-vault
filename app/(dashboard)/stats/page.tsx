// Página de estadísticas del dashboard. Es un Server Component que obtiene
// todos los datos en paralelo antes de renderizar los gráficos.

import {
  getMonthlyStats,
  getCategoryStats,
  getBalanceOverTime,
} from "@/lib/actions/stats";
import MonthlyChart from "@/components/charts/MonthlyChart";
import CategoryChart from "@/components/charts/CategoryChart";
import BalanceChart from "@/components/charts/BalanceChart";

export default async function StatsPage() {
  // Lanza las tres consultas en paralelo para reducir el tiempo de carga
  const [monthly, categories, balance] = await Promise.all([
    getMonthlyStats(),       // Ingresos y gastos agrupados por mes
    getCategoryStats(),      // Gastos totales por categoría
    getBalanceOverTime(),    // Balance acumulado a lo largo del tiempo
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Cabecera de la página */}
      <div>
        <h2 className="text-xl font-semibold font-heading text-primary-900">Estadísticas</h2>
        <p className="text-sm text-primary-400 mt-1">
          Visualiza tus hábitos financieros
        </p>
      </div>

      {/* Gráfico de barras: ingresos vs gastos por mes (ocupa todo el ancho) */}
      <div className="bg-white rounded-xl border border-primary-100 p-5">
        <h3 className="text-sm font-medium font-heading text-primary-900 mb-4">
          Ingresos vs gastos por mes
        </h3>
        <MonthlyChart data={monthly} />
      </div>

      {/* Fila de dos gráficos: categorías y balance acumulado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Gráfico de dona: distribución de gastos por categoría */}
        <div className="bg-white rounded-xl border border-primary-100 p-5">
          <h3 className="text-sm font-medium font-heading text-primary-900 mb-4">
            Gastos por categoría
          </h3>
          <CategoryChart data={categories} />
        </div>

        {/* Gráfico de línea: evolución del saldo acumulado */}
        <div className="bg-white rounded-xl border border-primary-100 p-5">
          <h3 className="text-sm font-medium font-heading text-primary-900 mb-4">
            Balance acumulado
          </h3>
          <BalanceChart data={balance} />
        </div>
      </div>
    </div>
  );
}
