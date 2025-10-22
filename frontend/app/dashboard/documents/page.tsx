"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { DocumentType } from "../_components/documentType";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [numberOfPages, setNumberOfPages] = useState(1);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [showDocumentTypeSelector, setShowDocumentTypeSelector] = useState(false);

  const username = typeof window !== "undefined" ? localStorage.getItem("username") : null;

  // 🔹 Fetch documents from backend
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!username) return;

      try {
        setLoading(true);
        const accessKey = localStorage.getItem(username);
        if (!accessKey) throw new Error("Access key not found");

        let url = process.env.NEXT_PUBLIC_BACKEND_URI;
        if (process.env.NODE_ENV === "production") {
          url = process.env.NEXT_PUBLIC_EXPRESS_URI;
        }
        const res = await fetch(
          `${url}/api/v1/document/all?page=${currentPage}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessKey}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch documents");

        const data = await res.json();
        setDocuments(data.myDocuments || []);
        setNumberOfPages(data.numberOfPages || 1);
      } catch (err: any) {
        toast.error(err.message || "Error fetching documents");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [currentPage, username]);

  // 🔹 Filter documents based on search term (client-side)
  const filteredDocuments = documents.filter((doc) =>
    doc.documentNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.documentType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Handle delete
  const handleDeleteClick = (doc: any) => {
    setDocumentToDelete(doc._id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const accessKey = username ? localStorage.getItem(username) : null;
      if (!accessKey) throw new Error("Access key not found");

      let url;
      if(process.env.NODE_ENV === 'development') {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URI}/api/v1/document/${documentToDelete}`;
      } else {
        url = `/api/v1/document/${documentToDelete}`;
      }

      const res = await fetch(
        url,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${accessKey}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete document");

      toast.success("Document deleted successfully");
      setDocuments((prev) => prev.filter((d) => d._id !== documentToDelete));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  // 🔹 Status badge styling
  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid": return "default";
      case "not fully paid": return "secondary";
      case "not paid": return "destructive";
      default: return "outline";
    }
  };

  // 🔹 Document type badge styling
  const getDocumentTypeVariant = (type: string) => {
    switch (type?.toLowerCase()) {
      case "invoice": return "default";
      case "quotation": return "secondary";
      case "receipt": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <Button
            onClick={() => setShowDocumentTypeSelector(!showDocumentTypeSelector)}
            variant={showDocumentTypeSelector ? "outline" : "default"}
          >
            {showDocumentTypeSelector ? (
              <X className="mr-2 h-4 w-4" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            {showDocumentTypeSelector ? "Cancel" : "New Document"}
          </Button>
        </div>

        {showDocumentTypeSelector && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Document</CardTitle>
              <CardDescription>Select a document type to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentType
                onSelect={(type) => {
                  router.push(`/dashboard/documents/new?type=${type}`);
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Document List</CardTitle>
              <CardDescription>View and manage all your documents</CardDescription>
            </div>
            <div className="relative mt-4 md:mt-0">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents..."
                className="w-full pl-8 md:w-[200px] lg:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document #</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.length > 0 ? (
                      filteredDocuments.map((doc) => (
                        <TableRow key={doc._id}>
                          <TableCell className="font-medium">{doc.documentNumber}</TableCell>
                          <TableCell>
                            <Badge variant={getDocumentTypeVariant(doc.documentType)}>
                              {doc.documentType}
                            </Badge>
                          </TableCell>
                          <TableCell>{doc.customer?.name || "-"}</TableCell>
                          <TableCell>
                            {doc.currency || "$"} {Number(doc.total || 0).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            {doc.dueDate ? format(new Date(doc.dueDate), "MMM d, yyyy") : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(doc.status)}>
                              {doc.status || "-"}
                            </Badge>
                          </TableCell>
                          <TableCell className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/dashboard/documents/${doc._id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive/80"
                              onClick={() => handleDeleteClick(doc)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No documents found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {numberOfPages > 1 && (
                <div className="mt-4 flex items-center justify-end space-x-2">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      </PaginationItem>

                      {Array.from({ length: numberOfPages }, (_, i) => (
                        <PaginationItem key={i + 1}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === i + 1}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(i + 1);
                            }}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.min(p + 1, numberOfPages))}
                          disabled={currentPage === numberOfPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
