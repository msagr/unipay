'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store'; // adjust this path to your store
import { Button } from '@/components/ui/button';
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
import { useRouter } from 'next/navigation';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  accountNo: string;
}

interface ApiResponse {
  success: boolean;
  totalCustomers: number;
  numberOfPages: number;
  myCustomers: Customer[];
}

export default function CustomersPageUI() {
  const router = useRouter();
  const username = localStorage.getItem("username") || null;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [page, setPage] = useState(1); // backend pages are 1-indexed
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteCandidate, setDeleteCandidate] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = (cust: Customer) => setDeleteCandidate(cust);
  const closeModal = () => setDeleteCandidate(null);

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!username) return;

      try {
        setLoading(true);
        const accessKey = localStorage.getItem(username);
        if (!accessKey) throw new Error('Access key not found');

        const res = await fetch(
          `http://localhost:3000/api/v1/customer/all?page=${page}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessKey}`,
            },
          }
        );

        if (!res.ok) throw new Error('Failed to fetch customers');

        const data: ApiResponse = await res.json();
        setCustomers(data.myCustomers || []);
        setTotalCustomers(data.totalCustomers || 0);
        setNumberOfPages(data.numberOfPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [username, page]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Total:</span>
          <Badge variant="secondary">{totalCustomers}</Badge>
          <Button
            onClick={() => router.push("/dashboard/customers/create")}
            variant="default"
          >
            Create New Customer
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : customers.length === 0 ? (
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
              {customers.map((row, idx) => (
                <TableRow key={row._id} className="hover:bg-muted transition">
                  <TableCell>{(page - 1) * rowsPerPage + idx + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.phoneNumber}</TableCell>
                  <TableCell>{row.accountNo}</TableCell>
                  <TableCell>
                    <Button variant="link" onClick={() => {}}>View</Button>
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
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Rows per page:</span>
                      <Select
                        value={String(rowsPerPage)}
                        onValueChange={(val: any) => {
                          setRowsPerPage(Number(val));
                          setPage(1); // reset to first page
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
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        disabled={page >= numberOfPages}
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
            <Button variant="ghost" onClick={closeModal}>Cancel</Button>
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
