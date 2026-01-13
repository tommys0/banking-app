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

interface AddAccountModalProps {
  open: boolean;
  onClose: () => void;
}

interface AccountPayload {
  customer_id: string;
  account_type: string;
  currency: string;
}

const createAccount = async (payload: AccountPayload) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/accounts`,
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
    throw new Error(errorData.error || "Failed to create account");
  }

  return response.json();
};

export default function AddAccountModal({
  open,
  onClose,
}: AddAccountModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    customer_id: "",
    account_type: "checking",
    currency: "USD",
  });

  const mutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      resetForm();
      onClose();
    },
  });

  const resetForm = () => {
    setFormData({
      customer_id: "",
      account_type: "checking",
      currency: "USD",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleClose = () => {
    if (!mutation.isPending) {
      resetForm();
      mutation.reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Account</DialogTitle>
          <DialogDescription>
            Create a new bank account for a customer.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="customer_id"
              className="block text-sm font-medium mb-1"
            >
              Customer ID *
            </label>
            <input
              type="text"
              id="customer_id"
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              required
              placeholder="Enter customer UUID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
            />
          </div>

          <div>
            <label
              htmlFor="account_type"
              className="block text-sm font-medium mb-1"
            >
              Account Type *
            </label>
            <select
              id="account_type"
              name="account_type"
              value={formData.account_type}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="business">Business</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-medium mb-1"
            >
              Currency *
            </label>
            <input
              type="text"
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              required
              placeholder="USD"
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
              {mutation.isPending ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
