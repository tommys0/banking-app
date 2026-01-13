"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
}

interface TransactionPayload {
  account_id: string;
  transaction_type: string;
  amount: number;
  description?: string;
  recipient_account_id?: string;
}

const createTransaction = async (payload: TransactionPayload) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/transactions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create transaction");
  }

  return response.json();
};

export default function AddTransactionModal({
  open,
  onClose,
}: AddTransactionModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    account_id: "",
    transaction_type: "deposit",
    amount: "",
    description: "",
    recipient_account_id: "",
  });

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      resetForm();
      onClose();
    },
  });

  const resetForm = () => {
    setFormData({
      account_id: "",
      transaction_type: "deposit",
      amount: "",
      description: "",
      recipient_account_id: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: TransactionPayload = {
      account_id: formData.account_id,
      transaction_type: formData.transaction_type,
      amount: parseFloat(formData.amount),
      description: formData.description || undefined,
    };

    if (formData.transaction_type === "transfer" && formData.recipient_account_id) {
      payload.recipient_account_id = formData.recipient_account_id;
    }

    mutation.mutate(payload);
  };

  const handleClose = () => {
    if (!mutation.isPending) {
      resetForm();
      mutation.reset();
      onClose();
    }
  };

  const isTransfer = formData.transaction_type === "transfer";

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Transaction</DialogTitle>
          <DialogDescription>
            Create a new deposit, withdrawal, transfer, or payment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="account_id"
              className="block text-sm font-medium mb-1"
            >
              Account ID *
            </label>
            <input
              type="text"
              id="account_id"
              name="account_id"
              value={formData.account_id}
              onChange={handleChange}
              required
              placeholder="Enter account UUID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
            />
          </div>

          <div>
            <label
              htmlFor="transaction_type"
              className="block text-sm font-medium mb-1"
            >
              Transaction Type *
            </label>
            <select
              id="transaction_type"
              name="transaction_type"
              value={formData.transaction_type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="transfer">Transfer</option>
              <option value="payment">Payment</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium mb-1"
            >
              Amount *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
            />
          </div>

          {isTransfer && (
            <div>
              <label
                htmlFor="recipient_account_id"
                className="block text-sm font-medium mb-1"
              >
                Recipient Account ID *
              </label>
              <input
                type="text"
                id="recipient_account_id"
                name="recipient_account_id"
                value={formData.recipient_account_id}
                onChange={handleChange}
                required={isTransfer}
                placeholder="Enter recipient account UUID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter transaction description"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
            />
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
              {mutation.isPending ? "Processing..." : "Create Transaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
