"use client";

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
  account_number: string;
  balance: number;
  currency: string;
}

interface DeleteAccountDialogProps {
  open: boolean;
  onClose: () => void;
  account: Account | null;
}

const deleteAccount = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/accounts/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete account");
  }

  return response.json();
};

export default function DeleteAccountDialog({
  open,
  onClose,
  account,
}: DeleteAccountDialogProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onClose();
    },
  });

  const handleDelete = () => {
    if (!account) return;
    mutation.mutate(account.id);
  };

  const handleClose = () => {
    if (!mutation.isPending) {
      mutation.reset();
      onClose();
    }
  };

  if (!account) return null;

  const hasBalance = account.balance !== 0;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete account {account.account_number}?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
            <div className="text-sm">
              <span className="font-medium text-muted-foreground">Current Balance:</span>
              <span className="ml-2 font-semibold">
                ${account.balance.toFixed(2)} {account.currency}
              </span>
            </div>
          </div>

          {hasBalance && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md dark:bg-yellow-900/20 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Warning:</strong> This account has a non-zero balance.
                Accounts can only be deleted when the balance is $0.00.
              </p>
            </div>
          )}

          {mutation.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{mutation.error.message}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={mutation.isPending || hasBalance}
          >
            {mutation.isPending ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
