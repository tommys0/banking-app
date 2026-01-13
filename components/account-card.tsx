import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Account {
  id: string;
  account_number: string;
  account_type: string;
  balance: number;
  currency: string;
  status: string;
  customer_id: string;
  created_at: string;
  updated_at: string;
}

interface AccountCardProps {
  account: Account;
  onEdit?: (account: Account) => void;
  onDelete?: (account: Account) => void;
}

export default function AccountCard({ account, onEdit, onDelete }: AccountCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="capitalize">{account.account_type} Account</span>
          <span className="text-lg font-bold text-green-600">
            ${account.balance.toFixed(2)} {account.currency}
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
            <span className="font-medium text-muted-foreground">Status:</span>
            <span className="ml-2 capitalize">{account.status}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Created:</span>
            <span className="ml-2">{new Date(account.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex gap-2 mt-4">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(account)}
                className="flex-1"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(account)}
                className="flex-1"
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}