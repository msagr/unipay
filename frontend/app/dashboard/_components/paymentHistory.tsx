'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface Payment {
  _id: string;
  paidBy: string;
  datePaid: Date | string;
  amountPaid: number;
  paymentMethod: string;
  additionalInfo?: string;
  status?: 'completed' | 'pending' | 'failed';
}

interface PaymentHistoryProps {
  payments: Payment[];
  isLoading?: boolean;
  onRefresh?: () => void;
  itemsPerPage?: number;
}

const PaymentHistory = ({ 
  payments = [], 
  isLoading = false, 
  onRefresh,
  itemsPerPage = 10 
}: PaymentHistoryProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(payments.length / itemsPerPage);

  const currentItems = payments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string | Date) => {
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return format(date, 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <Badge variant="default">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <Card className="border rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border rounded-lg overflow-hidden">
      <CardHeader className="bg-muted/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-semibold">Payment History</CardTitle>
            <p className="text-sm text-muted-foreground">
              View and manage your payment transactions
            </p>
          </div>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[100px]">#</TableHead>
                <TableHead>Paid By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((payment, index) => (
                  <TableRow key={payment._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {payment.paidBy}
                    </TableCell>
                    <TableCell>{formatDate(payment.datePaid)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(payment.amountPaid)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {payment.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payment.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.additionalInfo || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                      <p>No payment history found</p>
                      <p className="text-sm">
                        Your payment transactions will appear here
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-end p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={currentPage === pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;