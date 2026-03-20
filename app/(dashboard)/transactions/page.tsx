import { getTransactions } from "@/lib/actions/transactions";
import TransactionForm from "@/components/sections/TransactionForm";
import TransactionList from "@/components/sections/TransactionList";

export default async function TransactionsPage() {
  // Cargamos todas las transacciones del usuario desde el servidor
  const transactions = await getTransactions();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold font-heading text-primary-900">
          Transacciones
        </h2>
        <p className="text-sm text-primary-500 mt-1">
          Registra tus gastos e ingresos
        </p>
      </div>

      {/* Formulario para añadir una nueva transacción */}
      <TransactionForm />
      {/* Lista de transacciones existentes ordenadas por fecha descendente */}
      <TransactionList transactions={transactions} />
    </div>
  );
}
