"use client";

import { useEffect, useState } from "react";
import AccountCard from "@/components/account-card";

interface Account {
  id: string;
  customer_id: string;
  account_number: string;
  account_type: string;
  balance: number;
  currency: string;
  status: string;
  created_at: string;
}

interface ApiResponse {
  data: {
    accounts: Account[];
    total: number;
  };
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);
  const [customerIdFilter, setCustomerIdFilter] = useState("");

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: offset.toString(),
        });

        if (customerIdFilter.trim()) {
          params.append("customer_id", customerIdFilter.trim());
        }

        const response = await fetch(
          `https://v0-banking-system-backend-phi.vercel.app/api/accounts?${params}`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch accounts");
        }

        const data: ApiResponse = await response.json();
        setAccounts(data.data.accounts);
        setTotal(data.data.total);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [limit, offset, customerIdFilter]);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Accounts</h1>
        <p>Loading accounts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Accounts</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0,
  );
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
    setOffset(0); // Reset to first page when changing limit
  };

  const handleCustomerIdFilterChange = (value: string) => {
    setCustomerIdFilter(value);
    setOffset(0); // Reset to first page when filtering
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Accounts</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Total Accounts</h3>
          <p className="text-3xl font-bold text-white">{total}</p>
        </div>
        <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold">Page Balance</h3>
          <p className="text-3xl font-bold text-white">
            ${totalBalance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
          <div className="flex items-center gap-2">
            <label
              htmlFor="customer-filter"
              className="text-sm font-medium whitespace-nowrap"
            >
              Customer ID:
            </label>
            <input
              id="customer-filter"
              type="text"
              value={customerIdFilter}
              onChange={(e) => handleCustomerIdFilterChange(e.target.value)}
              placeholder="Filter by customer ID..."
              className="px-3 py-2 border border-gray-300 rounded text-sm min-w-0 flex-1 sm:w-64"
            />
          </div>

          <p className="text-sm text-muted-foreground whitespace-nowrap">
            Showing {accounts.length} of {total} accounts
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
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>

      {accounts.length === 0 && (
        <p className="text-muted-foreground">No accounts found.</p>
      )}

      {total > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} ({total} total accounts)
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
