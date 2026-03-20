"use client";

// Gráfico de barras que muestra ingresos y gastos comparados mes a mes.
// Usa la librería Recharts para renderizar el gráfico en el cliente.

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Estructura de cada punto de datos mensual
interface MonthlyData {
  month: string;    // Etiqueta del mes, ej: "mar. 25"
  income: number;   // Total de ingresos del mes
  expense: number;  // Total de gastos del mes
}

interface MonthlyChartProps {
  data: MonthlyData[];
}

export default function MonthlyChart({ data }: MonthlyChartProps) {
  // Si no hay datos, muestra un mensaje vacío en lugar del gráfico
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-sm text-primary-400">No hay datos todavía</p>
      </div>
    );
  }

  return (
    // ResponsiveContainer hace que el gráfico se adapte al ancho del contenedor padre
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barGap={4}>
        {/* Líneas de cuadrícula en gris claro */}
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

        {/* Eje X con los nombres de los meses, sin líneas de eje ni ticks */}
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />

        {/* Eje Y con valores en euros, sin líneas de eje ni ticks */}
        <YAxis
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}€`}  // Añade el símbolo € a cada valor
        />

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

        {/* Leyenda que traduce las claves "income"/"expense" a español */}
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
          formatter={(value) => (value === "income" ? "Ingresos" : "Gastos")}
        />

        {/* Barra de ingresos en verde azulado con esquinas superiores redondeadas */}
        <Bar dataKey="income" fill="#0d9488" radius={[4, 4, 0, 0]} />

        {/* Barra de gastos en rojo con esquinas superiores redondeadas */}
        <Bar dataKey="expense" fill="#e11d48" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
