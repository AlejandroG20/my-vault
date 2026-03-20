"use client";

// Gráfico de área que muestra la evolución del balance acumulado a lo largo del tiempo.
// Usa Recharts y se renderiza en el cliente.

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Estructura de cada punto en el tiempo con su balance acumulado
interface BalanceData {
  date: string; // Fecha formateada, ej: "20 mar"
  balance: number; // Saldo acumulado hasta ese momento
}

interface BalanceChartProps {
  data: BalanceData[];
}

export default function BalanceChart({ data }: BalanceChartProps) {
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
      <AreaChart data={data}>
        <defs>
          {/* Degradado vertical: morado semitransparente arriba, totalmente transparente abajo */}
          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Líneas de cuadrícula en gris claro */}
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

        {/* Eje X con las fechas, sin líneas de eje ni ticks */}
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
        />

        {/* Eje Y con valores en euros, sin líneas de eje ni ticks */}
        <YAxis
          tick={{ fontSize: 12, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}€`}
        />

        {/* Tooltip que muestra el balance formateado como moneda EUR al pasar el cursor */}
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

        {/* Área con línea morada suave (monotone) y relleno degradado; sin puntos en cada dato */}
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#7c3aed"
          strokeWidth={2}
          fill="url(#balanceGradient)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
