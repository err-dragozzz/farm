import { TransactionsClient } from "@/features/transactions/transactions-client";

export default function ExpensesPage() {
  return <TransactionsClient type="expense" />;
}
