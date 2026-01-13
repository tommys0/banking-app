"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import AccountCard from "@/components/account-card";
import AddAccountModal from "@/components/add-account-modal";
import EditAccountModal from "@/components/edit-account-modal";
import DeleteAccountDialog from "@/components/delete-account-dialog";
import { Button } from "@/components/ui/button";

interface Account {
  id: string;
  customer_id: string;
  account_number: string;
  account_type: string;
  balance: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  data: {
    accounts: Account[];
    total: number;
  };
}

const fetchAccounts = async (): Promise<ApiResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/accounts`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch accounts");
  }

  return response.json();
};

export default function AccountsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);
  const [typeFilter, setTypeFilter] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });

  const accounts = data?.data.accounts ?? [];
  const total = data?.data.total ?? 0;

  // Client-side filtering
  const filteredAccounts = useMemo(() => {
    return accounts.filter((a) => {
      return !typeFilter || a.account_type === typeFilter;
    });
  }, [accounts, typeFilter]);

  const totalBalance = filteredAccounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
  };

  const handleDelete = (account: Account) => {
    setDeletingAccount(account);
  };

  if (isLoading) {
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
        <h1 className="text-3xl font-bold">Accounts</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          Add Account
        </Button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-xl font-semibold">Total Accounts</h3>
          <p className="text-2xl font-bold">{filteredAccounts.length}</p>
          {filteredAccounts.length !== total && (
            <p className="text-sm text-muted-foreground">of {total} total</p>
          )}
        </div>
        <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-xl font-semibold">Total Balance</h3>
          <p className="text-2xl font-bold">${totalBalance.toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px] max-w-[300px]">
            <label htmlFor="typeFilter" className="block text-sm font-medium mb-1">
              Account Type
            </label>
            <select
              id="typeFilter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">All Types</option>
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="business">Business</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAccounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredAccounts.length === 0 && (
        <p className="text-muted-foreground">No accounts found.</p>
      )}

      <AddAccountModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditAccountModal
        open={!!editingAccount}
        onClose={() => setEditingAccount(null)}
        account={editingAccount}
      />

      <DeleteAccountDialog
        open={!!deletingAccount}
        onClose={() => setDeletingAccount(null)}
        account={deletingAccount}
      />
    </div>
  );
}
