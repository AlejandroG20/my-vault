"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  RefreshCcw,
  BarChart2,
  Target,
  Wallet,
  LogOut,
} from "lucide-react";

// Lista de rutas de la navegación principal con su icono asociado
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transacciones", href: "/transactions", icon: ArrowLeftRight },
  { name: "Suscripciones", href: "/subscriptions", icon: RefreshCcw },
  { name: "Estadísticas", href: "/stats", icon: BarChart2 },
  { name: "Objetivo", href: "/goal", icon: Target },
  { name: "Presupuesto", href: "/budgets", icon: Wallet },
];

export default function Sidebar({ userName }: { userName?: string }) {
  const pathname = usePathname();
  const vaultName = userName ? `${userName}'s Vault` : "My Vault";

  return (
    <>
      {/* ── Sidebar desktop (md+) ── */}
      <aside className="hidden md:flex w-56 h-screen sticky top-0 bg-white border-r border-primary-100 flex-col shrink-0 overflow-hidden">
        {/* Logo / nombre de la app */}
        <div className="px-6 py-5 border-b border-primary-100">
          <h1 className="text-lg font-semibold font-heading text-primary-900">
            {vaultName}
          </h1>
        </div>

        {/* Ítems de navegación — se resalta el que coincide con la ruta actual */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  isActive
                    ? "bg-accent-600 text-white"
                    : "text-primary-500 hover:bg-primary-50 hover:text-primary-900"
                }`}
              >
                <Icon size={16} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Botón de cierre de sesión */}
        <div className="px-3 py-4 border-t border-primary-100">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-primary-500 hover:bg-primary-50 hover:text-primary-900 transition-colors w-full cursor-pointer"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Bottom nav móvil (< md) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-primary-100 flex items-center justify-around z-50 px-1 py-1.5">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.name}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors cursor-pointer ${
                isActive
                  ? "text-accent-600 bg-accent-50"
                  : "text-primary-400 hover:text-primary-600 hover:bg-primary-50"
              }`}
            >
              <Icon size={22} />
            </Link>
          );
        })}

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Cerrar sesión"
          className="flex items-center justify-center w-10 h-10 rounded-xl text-primary-400 hover:text-danger-500 hover:bg-danger-50 transition-colors cursor-pointer"
        >
          <LogOut size={22} />
        </button>
      </nav>
    </>
  );
}
