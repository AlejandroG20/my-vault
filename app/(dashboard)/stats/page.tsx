import {
  getMonthlyStats,
  getCategoryStats,
  getBalanceOverTime,
} from "@/lib/actions/stats";
import MonthlyChart from "@/components/charts/MonthlyChart";
import CategoryChart from "@/components/charts/CategoryChart";
import BalanceChart from "@/components/charts/BalanceChart";
import Link from "next/link";

const PERIODS = [
  { key: "3m", label: "3 meses" },
  { key: "6m", label: "6 meses" },
  { key: "1y", label: "1 año" },
  { key: "all", label: "Todo" },
] as const;

function getSince(period: string): Date | undefined {
  const now = new Date();
  if (period === "3m") return new Date(now.getFullYear(), now.getMonth() - 3, 1);
  if (period === "6m") return new Date(now.getFullYear(), now.getMonth() - 6, 1);
  if (period === "1y") return new Date(now.getFullYear() - 1, now.getMonth(), 1);
  return undefined;
}

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period = "all" } = await searchParams;
  const since = getSince(period);

  const [monthly, categories, balance] = await Promise.all([
    getMonthlyStats(since),
    getCategoryStats(since),
    getBalanceOverTime(since),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold font-heading text-primary-900">Estadísticas</h2>
          <p className="text-sm text-primary-400 mt-1">
            Visualiza tus hábitos financieros
          </p>
        </div>

        {/* Selector de período */}
        <div className="flex items-center gap-1 bg-primary-50 rounded-lg p-1">
          {PERIODS.map(({ key, label }) => (
            <Link
              key={key}
              href={`?period=${key}`}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                period === key
                  ? "bg-white text-primary-900 shadow-sm"
                  : "text-primary-400 hover:text-primary-700"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Gráfico de barras: ingresos vs gastos por mes */}
      <div className="bg-white rounded-xl border border-primary-100 p-5">
        <h3 className="text-sm font-semibold font-heading text-primary-800 mb-4">
          Ingresos vs gastos por mes
        </h3>
        <MonthlyChart data={monthly} />
      </div>

      {/* Categorías y balance acumulado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-primary-100 p-5">
          <h3 className="text-sm font-semibold font-heading text-primary-800 mb-4">
            Gastos por categoría
          </h3>
          <CategoryChart data={categories} />
        </div>

        <div className="bg-white rounded-xl border border-primary-100 p-5">
          <h3 className="text-sm font-semibold font-heading text-primary-800 mb-4">
            Balance acumulado
          </h3>
          <BalanceChart data={balance} />
        </div>
      </div>
    </div>
  );
}
