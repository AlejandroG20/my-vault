import { AlertTriangle } from "lucide-react";
import { CATEGORY_CONFIG } from "@/lib/categories";
import { TrendingUp } from "lucide-react";

interface ExceededBudget {
  id: string;
  category: string;
  amount: number;
  spent: number;
}

function getUrgencyStyles(spent: number, amount: number) {
  if (spent >= amount)
    return {
      badge: "bg-danger-100 text-danger-700",
      label: "Superado",
      border: "border-danger-100",
      bar: "bg-danger-500",
    };
  return {
    badge: "bg-warning-100 text-warning-700",
    label: `${Math.round((spent / amount) * 100)}%`,
    border: "border-warning-100",
    bar: "bg-warning-500",
  };
}

export default function ExceededBudgets({ budgets }: { budgets: ExceededBudget[] }) {
  if (budgets.length === 0) return null;

  const fmt = (n: number) =>
    n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

  return (
    <div className="bg-white rounded-xl border border-primary-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={15} className="text-danger-500" />
        <span className="text-sm font-semibold font-heading text-primary-800">
          Presupuestos en alerta
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {budgets.map((b) => {
          const { badge, label, border, bar } = getUrgencyStyles(b.spent, b.amount);
          const config = CATEGORY_CONFIG[b.category];
          const Icon = config?.icon ?? TrendingUp;
          const pct = Math.min((b.spent / b.amount) * 100, 100);

          return (
            <div
              key={b.id}
              className={`rounded-lg border ${border} px-3 py-2.5`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${config?.bg ?? "bg-primary-50"}`}>
                    <Icon size={13} className={config?.color ?? "text-primary-400"} />
                  </div>
                  <p className="text-sm font-medium text-primary-900">
                    {b.category}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-primary-400">
                    {fmt(b.spent)} / {fmt(b.amount)}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge}`}>
                    {label}
                  </span>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="w-full bg-primary-100 rounded-full h-1.5">
                <div
                  className={`${bar} h-1.5 rounded-full transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
