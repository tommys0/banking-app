"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function Dashboard() {
  // Fetching user data (simulated)
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const users = await api.get("users");
      if (!users || users.length === 0) return { name: "Adam", balance: 5000 };
      return { ...users[users.length - 1], balance: 5000 };
    },
  });

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Welcome back, {userData?.name || "User"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Customers</CardTitle>
            <CardDescription>
              Manage customer accounts and information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/customers">View Customers</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Transactions
            </CardTitle>
            <CardDescription>
              View and manage financial transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/transactions">View Transactions</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Accounts</CardTitle>
            <CardDescription>Manage bank accounts and balances</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard/accounts">View Accounts</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
