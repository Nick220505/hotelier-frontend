"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthenticatedUser } from "@/hooks/use-authenticated-user";
import { Invoice } from "@/lib/types";
import { reservationsApi, ReservationBillingDetails } from "@/lib/api/reservations";
import { InvoiceDetailsDialog } from "./invoice-details-dialog";
import { InvoiceFilters } from "./invoice-filters";
import { InvoiceTable } from "./invoice-table";
import { NewInvoiceDialog } from "./new-invoice-dialog";

interface InvoiceManagementProps {
  invoices: Invoice[];
  onProcessPayment: (
    invoiceId: string | number,
    paymentMethod: string,
    reference: string,
  ) => void;
  onDownloadInvoice: (invoiceId: string | number) => void;
  onInvoiceAdd: (invoice: Invoice) => void;
}

export default function InvoiceManagement({
  invoices,
  onProcessPayment,
  onDownloadInvoice,
  onInvoiceAdd,
}: InvoiceManagementProps) {
  const { hasRole } = useAuthenticatedUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [reservationsBillingData, setReservationsBillingData] = useState<
    ReservationBillingDetails[]
  >([]);
  const [loadingReservations, setLoadingReservations] = useState(false);

  // Fetch reservations with billing details
  useEffect(() => {
    const fetchReservationsBillingData = async () => {
      setLoadingReservations(true);
      try {
        const billingData =
          await reservationsApi.getReservationsWithBillingDetails();
        // Show ALL reservations without paid invoices (pending payment)
        setReservationsBillingData(
          billingData.filter((bd) => !bd.hasInvoice && bd.grandTotal > 0)
        );
      } catch (error) {
        console.error("Error fetching reservations billing data:", error);
      } finally {
        setLoadingReservations(false);
      }
    };

    fetchReservationsBillingData();
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDetailsDialogOpen(true);
  };

  const handleProcessPayment = (invoiceId: string | number) => {
    // Encontrar la factura actual
    const invoice = invoices.find(inv => inv.id === invoiceId);
    if (!invoice) return;

    // Usar el método de pago original de la factura o CASH como respaldo
    const paymentMethod = invoice.paymentMethod || "CASH";
    onProcessPayment(invoiceId, paymentMethod, `REF-${Date.now()}`);
  };

  return (
    <div className="space-y-4">
      {/* Header with New Invoice Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Facturas</h3>
          <p className="text-sm text-muted-foreground">
            Gestión de facturas e invoices
          </p>
          {reservationsBillingData.length > 0 && (
            <p className="text-sm font-medium text-orange-600 mt-1">
              {reservationsBillingData.length} reservación(es) con pago pendiente
            </p>
          )}
        </div>
        {!hasRole('cliente') && (
          <NewInvoiceDialog
            reservationsBillingData={reservationsBillingData}
            loadingReservations={loadingReservations}
            onInvoiceAdd={onInvoiceAdd}
          />
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Facturas</CardTitle>
          <CardDescription>
            {filteredInvoices.length} factura(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InvoiceTable
            invoices={filteredInvoices}
            onViewDetails={handleViewDetails}
            onProcessPayment={handleProcessPayment}
            onDownloadInvoice={onDownloadInvoice}
          />
        </CardContent>
      </Card>

      {/* Invoice Details Dialog */}
      {selectedInvoice && (
        <InvoiceDetailsDialog
          invoice={selectedInvoice}
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
        />
      )}
    </div>
  );
}
