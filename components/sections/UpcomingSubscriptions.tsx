import { Bell, RefreshCcw } from "lucide-react";

interface UpcomingSubscription {
  id: string;
  name: string;
  amount: number;
  dayOfMonth: number;
  category: string;
  daysUntil: number;
}

interface UpcomingSubscriptionsProps {
  subscriptions: UpcomingSubscription[];
}

function getUrgencyStyles(daysUntil: number) {
  if (daysUntil === 0)
    return {
      badge: "bg-danger-100 text-danger-700",
      label: "Hoy",
      icon: "text-danger-500",
      border: "border-danger-100",
    };
  if (daysUntil <= 2)
    return {
      badge: "bg-warning-100 text-warning-700",
      label: daysUntil === 1 ? "Mañana" : `En ${daysUntil} días`,
      icon: "text-warning-500",
      border: "border-warning-100",
    };
  return {
    badge: "bg-accent-50 text-accent-700",
    label: `En ${daysUntil} días`,
    icon: "text-accent-500",
    border: "border-primary-100",
  };
}

export default function UpcomingSubscriptions({
  subscriptions,
}: UpcomingSubscriptionsProps) {
  if (subscriptions.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-primary-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Bell size={15} className="text-warning-500" />
        <span className="text-sm font-medium text-primary-900">
          Próximos cobros
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {subscriptions.map((sub) => {
          const { badge, label, icon, border } = getUrgencyStyles(sub.daysUntil);
          return (
            <div
              key={sub.id}
              className={`flex items-center justify-between rounded-lg border ${border} px-3 py-2`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-primary-50 flex items-center justify-center shrink-0">
                  <RefreshCcw size={13} className={icon} />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary-900">
                    {sub.name}
                  </p>
                  <p className="text-xs text-primary-400">{sub.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-semibold text-primary-900">
                  {sub.amount.toLocaleString("es-ES", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge}`}>
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
