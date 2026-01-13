"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import TransactionCard from "@/components/transaction-card";
import AddTransactionModal from "@/components/add-transaction-modal";
import { Button } from "@/components/ui/button";

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
  data: {
    transactions: Transaction[];
    total: number;
  };
}

const fetchTransactions = async (): Promise<ApiResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/transactions`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return response.json();
};

export default function TransactionsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  const transactions = data?.data.transactions ?? [];
  const total = data?.data.total ?? 0;

  // Client-side filtering
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      return !typeFilter || t.transaction_type === typeFilter;
    });
  }, [transactions, typeFilter]);

  // Calculate totals from filtered transactions
  const depositTotal = filteredTransactions
    .filter((t) => t.transaction_type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0);

  const withdrawalTotal = filteredTransactions
    .filter((t) => t.transaction_type === "withdrawal" || t.transaction_type === "transfer" || t.transaction_type === "payment")
    .reduce((sum, t) => sum + t.amount, 0);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Transactions</h1>
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Transactions</h1>
        <p className="text-red-500">Error: {error.message}</p>
        <Button onClick={() => refetch()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          New Transaction
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-xl font-semibold">Total Transactions</h3>
          <p className="text-2xl font-bold">{filteredTransactions.length}</p>
          {filteredTransactions.length !== total && (
            <p className="text-sm text-muted-foreground">of {total} total</p>
          )}
        </div>
        <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-xl font-semibold">Total Deposits</h3>
          <p className="text-2xl font-bold text-green-600">+${depositTotal.toFixed(2)}</p>
        </div>
        <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-xl font-semibold">Total Outgoing</h3>
          <p className="text-2xl font-bold text-red-600">-${withdrawalTotal.toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px] max-w-[300px]">
            <label htmlFor="typeFilter" className="block text-sm font-medium mb-1">
              Transaction Type
            </label>
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="transfer">Transfer</option>
              <option value="payment">Payment</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTransactions.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            transaction={transaction}
          />
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <p className="text-muted-foreground">No transactions found.</p>
      )}

      <AddTransactionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
