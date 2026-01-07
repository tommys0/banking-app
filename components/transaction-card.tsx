import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  account_id: string;
  created_at: string;
  updated_at: string;
}

interface TransactionCardProps {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const isCredit = transaction.type === "credit" || transaction.amount > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{transaction.description || "Transaction"}</span>
          <span className={`text-lg font-bold ${isCredit ? "text-green-600" : "text-red-600"}`}>
            {isCredit ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Type:</span>
            <span className="ml-2 capitalize">{transaction.type}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Account ID:</span>
            <span className="ml-2 font-mono text-xs">{transaction.account_id}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Date:</span>
            <span className="ml-2">{new Date(transaction.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}