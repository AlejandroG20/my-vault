import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  variant?: "default" | "income" | "expense";
}

export default function StatCard({
  title,
  amount,
  icon: Icon,
  variant = "default",
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
      <p className={`text-2xl font-semibold ${colors[variant]}`}>
        {amount.toLocaleString("es-ES", {
          style: "currency",
          currency: "EUR",
        })}
      </p>
    </div>
  );
}
