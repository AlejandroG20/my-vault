import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  variant?: "default" | "income" | "expense";
  trend?: number; // % de cambio respecto al mes anterior
}

export default function StatCard({
  title,
  amount,
  icon: Icon,
  variant = "default",
  trend,
}: StatCardProps) {
  // Color del importe según el tipo: balance neutro, ingreso (teal) o gasto (rose)
  const colors = {
    default: "text-primary-900",
    income: "text-success-600",
    expense: "text-danger-500",
  };

  // Color del icono según el tipo, más suave que el del importe
  const iconColors = {
    default: "text-primary-400",
    income: "text-success-500",
    expense: "text-danger-400",
  };

  // Fondo del contenedor del icono según el tipo
  const iconBg = {
    default: "bg-primary-50",
    income: "bg-success-50",
    expense: "bg-danger-50",
  };

  return (
    <div className="bg-white rounded-xl border border-primary-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-primary-500">{title}</span>
        {/* Icono con fondo y color tintado según la variante */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg[variant]}`}>
          <Icon size={15} className={iconColors[variant]} />
        </div>
      </div>
      {/* Importe formateado en euros con color según la variante */}
      <p className={`text-xl sm:text-2xl font-semibold font-heading ${colors[variant]}`}>
        {amount.toLocaleString("es-ES", {
          style: "currency",
          currency: "EUR",
        })}
      </p>
      {/* Comparativa con el mes anterior */}
      {trend !== undefined && !isNaN(trend) && (
        <div className={`flex items-center gap-1 mt-1.5 ${trend >= 0 ? "text-success-600" : "text-danger-500"}`}>
          {trend >= 0
            ? <TrendingUp size={11} />
            : <TrendingDown size={11} />
          }
          <span className="text-xs font-medium">
            {trend >= 0 ? "+" : ""}{trend.toFixed(1)}% vs mes ant.
          </span>
        </div>
      )}
    </div>
  );
}
