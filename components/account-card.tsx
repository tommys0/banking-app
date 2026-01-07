import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Account {
  id: string;
  account_number: string;
  account_type: string;
  balance: number;
  customer_id: string;
  created_at: string;
  updated_at: string;
}

interface AccountCardProps {
  account: Account;
}

export default function AccountCard({ account }: AccountCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="capitalize">{account.account_type} Account</span>
          <span className="text-lg font-bold text-green-600">
            ${account.balance.toFixed(2)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Account Number:</span>
            <span className="ml-2 font-mono">{account.account_number}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Customer ID:</span>
            <span className="ml-2 font-mono text-xs">{account.customer_id}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Created:</span>
            <span className="ml-2">{new Date(account.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}