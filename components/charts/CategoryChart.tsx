"use client";

// Gráfico de dona que muestra la distribución de gastos por categoría.
// Usa Recharts y se renderiza en el cliente.

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Paleta de colores que se asigna rotativamente a cada categoría
const COLORS = [
  "#7c3aed",
  "#0d9488",
  "#e11d48",
  "#d97706",
  "#2563eb",
  "#db2777",
  "#059669",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

// Estructura de cada categoría con su nombre y total gastado
interface CategoryData {
  name: string;   // Nombre de la categoría, ej: "Alimentación"
  value: number;  // Total gastado en esa categoría
}

interface CategoryChartProps {
  data: CategoryData[];
}

export default function CategoryChart({ data }: CategoryChartProps) {
  // Si no hay datos, muestra un mensaje vacío en lugar del gráfico
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-sm text-primary-400">No hay datos todavía</p>
      </div>
    );
  }

  return (
    // ResponsiveContainer adapta el gráfico al ancho del contenedor padre
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        {/* Dona centrada: innerRadius crea el agujero interior, outerRadius define el grosor del anillo */}
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}  // Pequeño espacio entre cada segmento
          dataKey="value"
        >
          {/* Asigna un color de la paleta a cada segmento de forma cíclica */}
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        {/* Tooltip que muestra el valor formateado como moneda EUR al pasar el cursor */}
        <Tooltip
          formatter={(value) =>
            typeof value === "number"
              ? value.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                })
              : value
          }
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            fontSize: "12px",
          }}
        />

        {/* Leyenda con iconos circulares pequeños que identifica cada categoría */}
        <Legend
          wrapperStyle={{ fontSize: "12px" }}
          iconType="circle"
          iconSize={8}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
