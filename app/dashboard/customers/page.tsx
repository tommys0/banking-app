"use client";

import { useEffect, useState } from "react";
import CustomerCard from "@/components/customer-card";
import AddCustomerModal from "@/components/add-customer-modal";
import EditCustomerModal from "@/components/edit-customer-modal";
import DeleteCustomerDialog from "@/components/delete-customer-dialog";
import { Button } from "@/components/ui/button";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  date_of_birth: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  data: {
    customers: Customer[];
    total: number;
  };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/customers`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data: ApiResponse = await response.json();
      setCustomers(data.data.customers);
      setTotal(data.data.total);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Customers</h1>
        <p>Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Customers</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  const handleCustomerAdded = () => {
    fetchCustomers();
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
  };

  const handleDelete = (customer: Customer) => {
    setDeletingCustomer(customer);
  };

  const handleEditSuccess = () => {
    fetchCustomers();
  };

  const handleDeleteSuccess = () => {
    fetchCustomers();
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Add Customer
        </Button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          Total Customers: {total}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {customers.length === 0 && (
        <p className="text-muted-foreground">No customers found.</p>
      )}

      <AddCustomerModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCustomerAdded}
      />

      <EditCustomerModal
        open={!!editingCustomer}
        onClose={() => setEditingCustomer(null)}
        onSuccess={handleEditSuccess}
        customer={editingCustomer}
      />

      <DeleteCustomerDialog
        open={!!deletingCustomer}
        onClose={() => setDeletingCustomer(null)}
        onSuccess={handleDeleteSuccess}
        customer={deletingCustomer}
      />
    </div>
  );
}