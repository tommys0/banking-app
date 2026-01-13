import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Transaction {
  id: string;
  account_id: string;
  transaction_type: string;
  amount: number;
  description: string;
  reference_number: string;
  recipient_account_id: string | null;
  status: string;
  created_at: string;
}

interface TransactionCardProps {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const isDebit = transaction.transaction_type === "withdrawal" || transaction.transaction_type === "transfer" || transaction.transaction_type === "payment";
  const amountColor = isDebit ? "text-red-600" : "text-green-600";
  const amountPrefix = isDebit ? "-" : "+";

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      deposit: "Deposit",
      withdrawal: "Withdrawal",
      transfer: "Transfer",
      payment: "Payment",
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <Link href={`/dashboard/transactions/${transaction.id}`}>
      <Card className="w-full cursor-pointer transition-shadow hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700">
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>{getTypeLabel(transaction.transaction_type)}</span>
            <span className={`text-lg font-bold ${amountColor}`}>
              {amountPrefix}${transaction.amount.toFixed(2)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">Reference:</span>
              <span className="ml-2 font-mono text-xs">{transaction.reference_number}</span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Account ID:</span>
              <span className="ml-2 font-mono text-xs">{transaction.account_id}</span>
            </div>
            {transaction.recipient_account_id && (
              <div>
                <span className="font-medium text-muted-foreground">Recipient:</span>
                <span className="ml-2 font-mono text-xs">{transaction.recipient_account_id}</span>
              </div>
            )}
            {transaction.description && (
              <div>
                <span className="font-medium text-muted-foreground">Description:</span>
                <span className="ml-2">{transaction.description}</span>
              </div>
            )}
            <div>
              <span className="font-medium text-muted-foreground">Status:</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusBadge(transaction.status)}`}>
                {transaction.status}
              </span>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Date:</span>
              <span className="ml-2">{new Date(transaction.created_at).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
