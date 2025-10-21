"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, Eye } from "lucide-react";
import { Invoice } from "@/lib/types";
import { InvoiceStatusBadge, PaymentMethodBadge } from "./invoice-badges";
import { useAuthenticatedUser } from "@/hooks/use-authenticated-user";

interface InvoiceTableProps {
  invoices: Invoice[];
  onViewDetails: (invoice: Invoice) => void;
  onProcessPayment: (invoiceId: string | number) => void;
  onDownloadInvoice: (invoiceId: string | number) => void;
}

export function InvoiceTable({
  invoices,
  onViewDetails,
  onProcessPayment,
  onDownloadInvoice,
}: InvoiceTableProps) {
  const { hasRole } = useAuthenticatedUser();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Número</TableHead>
          <TableHead>Huésped</TableHead>
          <TableHead>Habitación</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Método de Pago</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.number}</TableCell>
            <TableCell>{invoice.guest}</TableCell>
            <TableCell>{invoice.room}</TableCell>
            <TableCell>
              {new Date(invoice.issueDate).toLocaleDateString()}
            </TableCell>
            <TableCell className="font-semibold">
              ${invoice.total.toLocaleString()}
            </TableCell>
            <TableCell>
              <InvoiceStatusBadge status={invoice.status} />
            </TableCell>
            <TableCell>
              <PaymentMethodBadge method={invoice.paymentMethod} />
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(invoice)}
                >
                  <Eye className="mr-1 h-4 w-4" />
                  Ver
                </Button>
                {!hasRole('cliente') && invoice.status === "pendiente" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onProcessPayment(invoice.id)}
                  >
                    <CreditCard className="mr-1 h-4 w-4" />
                    Cobrar
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDownloadInvoice(invoice.id)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
