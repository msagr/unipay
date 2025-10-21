'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CreditCard, Wallet, Banknote, Smartphone, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

type PaymentMethod = {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const paymentMethods: PaymentMethod[] = [
  { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
  { value: 'mobile_money', label: 'Mobile Money', icon: Smartphone },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: Banknote },
  { value: 'cash', label: 'Cash', icon: Wallet },
];

type PaymentFormProps = {
  document: {
    _id: string;
    customer: {
      name: string;
    };
    total: number;
    paymentRecords?: Array<{
      amountPaid: number;
      paymentMethod: string;
      datePaid?: Date | string;
      reference?: string;
    }>;
  };
  onSuccess?: () => void;
};

export function PaymentForm({ document, onSuccess }: PaymentFormProps) {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [method, setMethod] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [reference, setReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const balance = document.total - totalPaid;

  // Calculate total amount paid
  useEffect(() => {
    if (document?.paymentRecords?.length) {
      const paid = document.paymentRecords.reduce(
        (sum, record) => sum + Number(record.amountPaid || 0),
        0
      );
      setTotalPaid(paid);
    }
  }, [document]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !method) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid payment amount',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // TODO: Replace with your actual API call
      // await createPayment({
      //   id: document._id,
      //   paidBy: document.customer.name,
      //   datePaid: date,
      //   paymentMethod: method,
      //   amountPaid: paymentAmount,
      //   reference,
      //   notes,
      // });

      toast({
        title: 'Success',
        description: 'Payment recorded successfully',
      });

      // Reset form
      setAmount('');
      setReference('');
      setNotes('');
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Error',
        description: 'Failed to record payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedMethod = paymentMethods.find(m => m.value === method);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Record Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-total">Invoice Total</Label>
                <div className="text-2xl font-bold">
                  ${document.total.toFixed(2)}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount-due">Amount Due</Label>
                <div className="text-2xl font-bold">
                  ${balance.toFixed(2)}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      max={balance}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Maximum: ${balance.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Payment Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => newDate && setDate(newDate)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">Payment Method *</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      {selectedMethod ? (
                        <>
                          <selectedMethod.icon className="mr-2 h-4 w-4" />
                          {selectedMethod.label}
                        </>
                      ) : (
                        'Select a payment method'
                      )}
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <SelectItem key={method.value} value={method.value}>
                          <div className="flex items-center">
                            <Icon className="mr-2 h-4 w-4" />
                            {method.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference/Transaction ID</Label>
                  <Input
                    id="reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g. TRX123456"
                  />
                </div>

                {method === 'credit_card' && (
                  <div className="space-y-2">
                    <Label htmlFor="lastFour">Last 4 Digits</Label>
                    <Input
                      id="lastFour"
                      maxLength={4}
                      placeholder="1234"
                      className="w-24"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Add any additional notes about this payment"
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isProcessing || !amount || !method}
                >
                  {isProcessing ? 'Processing...' : 'Record Payment'}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>

      {totalPaid > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {document.paymentRecords?.map((record, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">
                      ${Number(record.amountPaid).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(record.datePaid || new Date()), 'PPP')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {record.paymentMethod}
                    </p>
                    {record.reference && (
                      <p className="text-xs text-muted-foreground">
                        Ref: {record.reference}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
