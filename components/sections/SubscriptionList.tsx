import {
  deleteSubscription,
  toggleSubscription,
} from "@/lib/actions/subscriptions";
import { Trash2, RefreshCcw } from "lucide-react";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  dayOfMonth: number;
  category: string;
  active: boolean;
  lastCharged: Date | null;
}

interface SubscriptionListProps {
  subscriptions: Subscription[];
}

export default function SubscriptionList({
  subscriptions,
}: SubscriptionListProps) {
  // Estado vacío: mostramos un mensaje en lugar de una lista en blanco
  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-primary-100 p-8 text-center">
        <p className="text-sm text-primary-300">No hay suscripciones todavía</p>
      </div>
    );
  }

  return (
    // Cada fila se separa con un divider usando divide-y
    <div className="bg-white rounded-xl border border-primary-100 divide-y divide-primary-50">
      {subscriptions.map((sub) => (
        <div
          key={sub.id}
          className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 gap-2"
        >
          <div className="flex items-center gap-3">
            {/* Icono con fondo y color más apagado cuando la suscripción está pausada */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                sub.active ? "bg-warning-100" : "bg-primary-50"
              }`}
            >
              <RefreshCcw
                size={14}
                className={sub.active ? "text-warning-600" : "text-primary-300"}
              />
            </div>

            <div>
              {/* Nombre en gris apagado cuando está pausada */}
              <p
                className={`text-sm font-medium ${sub.active ? "text-primary-900" : "text-primary-400"}`}
              >
                {sub.name}
              </p>
              <p className="text-xs text-primary-400">
                Día {sub.dayOfMonth} · {sub.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Importe también apagado cuando la suscripción está pausada */}
            <p
              className={`text-sm font-semibold ${sub.active ? "text-primary-900" : "text-primary-400"}`}
            >
              {sub.amount.toLocaleString("es-ES", {
                style: "currency",
                currency: "EUR",
              })}
            </p>

            {/* bind invierte el estado actual para actuar como toggle */}
            <form action={toggleSubscription.bind(null, sub.id, !sub.active)}>
              <button
                type="submit"
                className={`text-xs px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                  sub.active
                    ? "border-primary-200 text-primary-500 hover:bg-primary-50"
                    : "border-primary-200 text-primary-400 hover:bg-primary-50"
                }`}
              >
                {sub.active ? "Pausar" : "Activar"}
              </button>
            </form>

            {/* Botón de borrado con confirmación visual al hacer hover */}
            <form action={deleteSubscription.bind(null, sub.id)}>
              <button
                type="submit"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-primary-300 hover:text-danger-500 hover:bg-danger-50 transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
