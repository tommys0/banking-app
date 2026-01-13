"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Account {
  id: string;
  customer_id: string;
  account_number: string;
  account_type: string;
  balance: number;
  currency: string;
  status: string;
}

interface EditAccountModalProps {
  open: boolean;
  onClose: () => void;
  account: Account | null;
}

const updateAccount = async ({ id, status }: { id: string; status: string }) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update account");
  }

  return response.json();
};

export default function EditAccountModal({
  open,
  onClose,
  account,
}: EditAccountModalProps) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("active");

  const mutation = useMutation({
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onClose();
    },
  });

  useEffect(() => {
    if (account) {
      setStatus(account.status);
    }
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;
    mutation.mutate({ id: account.id, status });
  };

  const handleClose = () => {
    if (!mutation.isPending) {
      mutation.reset();
      onClose();
    }
  };

  if (!account) return null;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Account Status</DialogTitle>
          <DialogDescription>
            Update the status of account {account.account_number}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
            <div className="text-sm">
              <span className="font-medium text-muted-foreground">Account Number:</span>
              <span className="ml-2">{account.account_number}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-muted-foreground">Type:</span>
              <span className="ml-2 capitalize">{account.account_type}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-muted-foreground">Balance:</span>
              <span className="ml-2">${account.balance.toFixed(2)} {account.currency}</span>
            </div>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium mb-1"
            >
              Account Status *
            </label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="frozen">Frozen</option>
              <option value="closed">Closed</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              For security reasons, only the account status can be modified.
            </p>
          </div>

          {mutation.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{mutation.error.message}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
