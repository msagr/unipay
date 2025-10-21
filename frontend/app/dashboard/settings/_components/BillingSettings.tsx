"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'discover';
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

interface BillingSettingsProps {
  paymentMethods?: PaymentMethod[];
  onAddPaymentMethod?: () => void;
  onEditPaymentMethod?: (id: string) => void;
  onSetDefaultPaymentMethod?: (id: string) => void;
  onRemovePaymentMethod?: (id: string) => void;
  isLoading?: boolean;
}

export function BillingSettings({
  paymentMethods = [
    {
      id: '1',
      type: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 25,
      isDefault: true,
    },
  ],
  onAddPaymentMethod,
  onEditPaymentMethod,
  onSetDefaultPaymentMethod,
  onRemovePaymentMethod,
  isLoading = false,
}: BillingSettingsProps) {
  const getCardIcon = (type: string) => {
    switch (type) {
      case 'visa':
      case 'mastercard':
      case 'amex':
      case 'discover':
        return <Icons.creditCard className="h-4 w-4" />;
      default:
        return <Icons.creditCard className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your saved payment methods.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center space-x-4">
                  <div className="h-8 w-12 rounded-md bg-muted flex items-center justify-center">
                    {getCardIcon(method.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {method.type.charAt(0).toUpperCase() + method.type.slice(1)} ending in {method.last4}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expires {String(method.expMonth).padStart(2, '0')}/{method.expYear}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {method.isDefault ? (
                    <span className="text-xs text-green-600">Default</span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSetDefaultPaymentMethod?.(method.id)}
                      disabled={isLoading}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditPaymentMethod?.(method.id)}
                    disabled={isLoading}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={onAddPaymentMethod}
            disabled={isLoading}
          >
            Add Payment Method
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View and download your past invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No billing history available</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
