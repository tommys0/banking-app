"use client";

import { useEffect, useState } from "react";
import TransactionCard from "@/components/transaction-card";

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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [accountIdFilter, setAccountIdFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: offset.toString(),
        });

        if (accountIdFilter.trim()) {
          params.append("account_id", accountIdFilter.trim());
        }

        if (typeFilter.trim()) {
          params.append("type", typeFilter.trim());
        }

        const response = await fetch(
          `https://v0-banking-system-backend-phi.vercel.app/api/transactions?${params}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data: ApiResponse = await response.json();
        setTransactions(data.data.transactions);
        setTotal(data.data.total);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [limit, offset, accountIdFilter, typeFilter]);

  if (loading) {
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
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  const handlePreviousPage = () => {
    if (offset > 0) {
      setOffset(Math.max(0, offset - limit));
    }
  };

  const handleNextPage = () => {
    if (offset + limit < total) {
      setOffset(offset + limit);
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setOffset(0);
  };

  const handleAccountIdFilterChange = (value: string) => {
    setAccountIdFilter(value);
    setOffset(0);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    setOffset(0);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>

      <div className="mb-6 flex flex-col xl:flex-row gap-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center flex-1">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <label
                htmlFor="account-filter"
                className="text-sm font-medium whitespace-nowrap"
              >
                Account ID:
              </label>
              <input
                id="account-filter"
                type="text"
                value={accountIdFilter}
                onChange={(e) => handleAccountIdFilterChange(e.target.value)}
                placeholder="Filter by account ID..."
                className="px-3 py-2 border border-gray-300 rounded text-sm min-w-0 flex-1"
              />
            </div>

            <div className="flex items-center gap-2 min-w-0 flex-1">
              <label
                htmlFor="type-filter"
                className="text-sm font-medium whitespace-nowrap"
              >
                Type:
              </label>
              <input
                id="type-filter"
                type="text"
                value={typeFilter}
                onChange={(e) => handleTypeFilterChange(e.target.value)}
                placeholder="Filter by type..."
                className="px-3 py-2 border border-gray-300 rounded text-sm min-w-0 flex-1"
              />
            </div>
          </div>

          <p className="text-sm text-muted-foreground whitespace-nowrap">
            Showing {transactions.length} of {total} transactions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="limit"
            className="text-sm font-medium whitespace-nowrap"
          >
            Per page:
          </label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </div>

      {transactions.length === 0 && (
        <p className="text-muted-foreground">No transactions found.</p>
      )}

      {total > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} ({total} total transactions)
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={offset === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={offset + limit >= total}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
