import { deleteTransaction } from "@/lib/actions/transactions";
import { Trash2, TrendingUp, ReceiptText } from "lucide-react";
import { CATEGORY_CONFIG } from "@/lib/categories";

interface Transaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  description: string | null;
  date: Date;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-primary-100 p-12 flex flex-col items-center gap-3 text-center shadow-sm">
        <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
          <ReceiptText size={22} className="text-primary-300" />
        </div>
        <div>
          <p className="text-sm font-medium text-primary-500">Sin transacciones</p>
          <p className="text-xs text-primary-300 mt-0.5">
            Añade tu primera transacción usando el formulario de arriba
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-primary-100 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-3 border-b border-primary-50 bg-primary-50/60 flex items-center justify-between">
        <p className="text-xs font-semibold text-primary-500 uppercase tracking-wide">
          Movimientos
        </p>
        <p className="text-xs text-primary-400">
          {transactions.length} {transactions.length === 1 ? "registro" : "registros"}
        </p>
      </div>

      <div className="divide-y divide-primary-50">
        {transactions.map((transaction) => {
          const config = CATEGORY_CONFIG[transaction.category];
          const Icon = config?.icon ?? TrendingUp;

          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between px-4 sm:px-5 py-3.5 gap-3 hover:bg-primary-50/50 transition-colors group"
            >
              {/* Left: icon + info */}
              <div className="flex items-center gap-3 min-w-0">
                {transaction.type === "INCOME" ? (
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-success-50 border border-success-100 shrink-0">
                    <TrendingUp size={15} className="text-success-600" />
                  </div>
                ) : (
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
                      config?.bg ?? "bg-primary-50"
                    } border-primary-100`}
                  >
                    <Icon
                      size={15}
                      className={config?.color ?? "text-primary-400"}
                    />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-primary-800 truncate">
                    {transaction.category}
                  </p>
                  {transaction.description ? (
                    <p className="text-xs text-primary-400 truncate">
                      {transaction.description}
                    </p>
                  ) : (
                    <p className="text-xs text-primary-300">
                      {new Date(transaction.date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: amount + date + delete */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <div className="text-right">
                  <p
                    className={`text-sm font-bold ${
                      transaction.type === "INCOME"
                        ? "text-success-600"
                        : "text-danger-500"
                    }`}
                  >
                    {transaction.type === "INCOME" ? "+" : "−"}
                    {transaction.amount.toLocaleString("es-ES", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </p>
                  {transaction.description && (
                    <p className="text-xs text-primary-400">
                      {new Date(transaction.date).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  )}
                </div>

                <form action={deleteTransaction.bind(null, transaction.id)}>
                  <button
                    type="submit"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-primary-200 hover:text-danger-500 hover:bg-danger-50 transition-all cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
