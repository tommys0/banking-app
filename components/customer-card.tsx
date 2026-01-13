import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface CustomerCardProps {
  customer: Customer;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}

export default function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {customer.first_name} {customer.last_name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium text-muted-foreground">Email:</span>
            <span className="ml-2">{customer.email}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Phone:</span>
            <span className="ml-2">{customer.phone}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Address:</span>
            <span className="ml-2">{customer.address}</span>
          </div>
          <div>
            <span className="font-medium text-muted-foreground">Date of Birth:</span>
            <span className="ml-2">{new Date(customer.date_of_birth).toLocaleDateString()}</span>
          </div>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex gap-2 mt-4">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(customer)}
                className="flex-1"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(customer)}
                className="flex-1"
              >
                Delete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}