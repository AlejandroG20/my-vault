import { getSubscriptions } from "@/lib/actions/subscriptions";
import SubscriptionForm from "@/components/SubscriptionForm";
import SubscriptionList from "@/components/SubscriptionList";

export default async function SubscriptionsPage() {
  // Cargamos todas las suscripciones del usuario desde el servidor
  const subscriptions = await getSubscriptions();

  // Sumamos solo las suscripciones activas para mostrar el coste mensual real
  const totalMonthly = subscriptions
    .filter((s) => s.active)
    .reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold font-heading text-primary-900">
            Suscripciones
          </h2>
          <p className="text-sm text-primary-500 mt-1">
            Gastos recurrentes mensuales
          </p>
        </div>
        {/* Total mensual: solo visible si hay al menos una suscripción */}
        {subscriptions.length > 0 && (
          <div className="text-right">
            <p className="text-xs text-primary-400">Total mensual</p>
            <p className="text-lg font-semibold font-heading text-primary-900">
              {totalMonthly.toLocaleString("es-ES", {
                style: "currency",
                currency: "EUR",
              })}
            </p>
          </div>
        )}
      </div>

      {/* Formulario para crear una nueva suscripción */}
      <SubscriptionForm />
      {/* Lista de suscripciones existentes con opciones de pausar y eliminar */}
      <SubscriptionList subscriptions={subscriptions} />
    </div>
  );
}
