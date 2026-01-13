"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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

interface ApiResponse {
  data: Transaction;
}

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/transactions/${params.id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Transaction not found");
          }
          throw new Error("Failed to fetch transaction");
        }

        const data: ApiResponse = await response.json();
        setTransaction(data.data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTransaction();
    }
  }, [params.id]);

  const isDebit =
    transaction?.transaction_type === "withdrawal" ||
    transaction?.transaction_type === "transfer" ||
    transaction?.transaction_type === "payment";

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

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          Back
        </Button>
        <h1 className="text-3xl font-bold mb-6">Transaction Details</h1>
        <p>Loading transaction...</p>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="container mx-auto p-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          Back
        </Button>
        <h1 className="text-3xl font-bold mb-6">Transaction Details</h1>
        <p className="text-red-500">Error: {error || "Transaction not found"}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        Back to Transactions
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Transaction Details</h1>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          {transaction.reference_number}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{getTypeLabel(transaction.transaction_type)}</span>
              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(
                  transaction.status
                )}`}
              >
                {transaction.status}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-4xl font-bold mb-6 ${
                isDebit ? "text-red-600" : "text-green-600"
              }`}
            >
              {isDebit ? "-" : "+"}${transaction.amount.toFixed(2)}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Transaction ID
                </h4>
                <p className="font-mono text-sm break-all">{transaction.id}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Reference Number
                </h4>
                <p className="font-mono">{transaction.reference_number}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Date & Time
                </h4>
                <p>{new Date(transaction.created_at).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Source Account ID
                </h4>
                <p className="font-mono text-sm break-all">
                  {transaction.account_id}
                </p>
              </div>

              {transaction.recipient_account_id && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Recipient Account ID
                  </h4>
                  <p className="font-mono text-sm break-all">
                    {transaction.recipient_account_id}
                  </p>
                </div>
              )}

              {transaction.description && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Description
                  </h4>
                  <p>{transaction.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
