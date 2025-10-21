'use client';

import { useState } from 'react';
import {
  Button,
} from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  accountNo: string;
}

interface Props {
  customers?: Customer[]; // made optional for safety
  totalCustomers?: number;
}

export default function CustomersPageUI({ customers = [], totalCustomers = 0 }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteCandidate, setDeleteCandidate] = useState<Customer | null>(null);

  const handleDeleteClick = (cust: Customer) => setDeleteCandidate(cust);
  const closeModal = () => setDeleteCandidate(null);

  // ✅ Prevents runtime error if customers is undefined
  const paginated = (customers ?? []).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Total:</span>
          <Badge variant="secondary">{totalCustomers}</Badge>
          <Button onClick={() => {/* navigate to create */}} variant="default">
            Create New Customer
          </Button>
        </div>
      </div>

      {/* Table */}
      {customers.length === 0 ? (
        <div className="text-center py-10">
          <p>No customers found.</p>
        </div>
      ) : (
        <ScrollArea className="max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Account No</TableHead>
                <TableHead>View</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.map((row, idx) => (
                <TableRow key={row._id} className="hover:bg-muted transition">
                  <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phoneNumber}</TableCell>
                  <TableCell>{row.accountNo}</TableCell>
                  <TableCell>
                    <Button variant="link" onClick={() => {/* view details logic */}}>
                      View
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteClick(row)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={7}>
                  <div className="flex justify-end items-center space-x-4 py-2">
                    {/* Rows per page */}
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Rows per page:</span>
                      <Select
                        value={String(rowsPerPage)}
                        onValueChange={(val) => {
                          setRowsPerPage(Number(val));
                          setPage(0);
                        }}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder={rowsPerPage.toString()} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Pagination buttons */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        disabled={page === 0}
                        onClick={() => setPage((p) => p - 1)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        disabled={(page + 1) * rowsPerPage >= customers.length}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </ScrollArea>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteCandidate} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete customer{' '}
              <span className="font-medium">{deleteCandidate?.name}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // TODO: implement delete logic
                closeModal();
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
