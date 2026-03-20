import { deleteTransaction } from "@/lib/actions/transactions";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";

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

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  // Estado vacío: mostramos un mensaje en lugar de una lista en blanco
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-primary-100 p-8 text-center">
        <p className="text-sm text-primary-300">No hay transacciones todavía</p>
      </div>
    );
  }

  return (
    // Cada fila se separa con un divider usando divide-y
    <div className="bg-white rounded-xl border border-primary-100 divide-y divide-primary-50">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between px-5 py-4"
        >
          <div className="flex items-center gap-3">
            {/* Icono con fondo tintado según si es ingreso (teal) o gasto (rose) */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                transaction.type === "INCOME" ? "bg-success-50" : "bg-danger-50"
              }`}
            >
              {transaction.type === "INCOME" ? (
                <TrendingUp size={14} className="text-success-600" />
              ) : (
                <TrendingDown size={14} className="text-danger-500" />
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-primary-900">
                {transaction.category}
              </p>
              {/* La descripción es opcional, solo se muestra si existe */}
              {transaction.description && (
                <p className="text-xs text-primary-400">
                  {transaction.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              {/* Importe con signo + / - y color según el tipo */}
              <p
                className={`text-sm font-semibold ${
                  transaction.type === "INCOME"
                    ? "text-success-600"
                    : "text-danger-500"
                }`}
              >
                {transaction.type === "INCOME" ? "+" : "-"}
                {transaction.amount.toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
              <p className="text-xs text-primary-400">
                {new Date(transaction.date).toLocaleDateString("es-ES")}
              </p>
            </div>

            {/* Formulario de borrado: bind vincula el id antes de enviar la Server Action */}
            <form action={deleteTransaction.bind(null, transaction.id)}>
              <button
                type="submit"
                className="w-7 h-7 rounded-lg flex items-center justify-center text-primary-300 hover:text-danger-500 hover:bg-danger-50 transition-colors"
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
