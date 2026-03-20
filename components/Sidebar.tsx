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
  LogOut,
} from "lucide-react";

// Lista de rutas de la navegación principal con su icono asociado
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transacciones", href: "/transactions", icon: ArrowLeftRight },
  { name: "Suscripciones", href: "/subscriptions", icon: RefreshCcw },
  { name: "Estadísticas", href: "/stats", icon: BarChart2 },
  { name: "Objetivo", href: "/goal", icon: Target },
];

export default function Sidebar() {
  // Obtenemos la ruta actual para marcar el ítem activo
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-primary-100 flex flex-col">
      {/* Logo / nombre de la app */}
      <div className="px-6 py-5 border-b border-primary-100">
        <h1 className="text-lg font-semibold text-primary-900">My Vault</h1>
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
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
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

      {/* Botón de cierre de sesión — redirige al login tras cerrar */}
      <div className="px-3 py-4 border-t border-primary-100">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-primary-500 hover:bg-primary-50 hover:text-primary-900 transition-colors w-full"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
