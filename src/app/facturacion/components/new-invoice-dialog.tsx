"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Invoice, InvoiceConcept } from "@/lib/types";
import { billingApi } from "@/lib/api/billing";
import { ReservationBillingDetails } from "@/lib/api/reservations";
import { ReservationSelector } from "./reservation-selector";
import { BillingDetailsDisplay } from "./billing-details-display";

// Zod Schema for form validation
const createInvoiceSchema = z.object({
  reservationId: z
    .string({ message: "Debe seleccionar una reservación" })
    .min(1, "La reservación es obligatoria"),
  
  issueDate: z
    .string({ message: "La fecha de emisión es obligatoria" })
    .min(1, "La fecha de emisión es obligatoria")
    .refine((date) => {
      // Validate that it's a valid date
      const dateObj = new Date(date);
      return !isNaN(dateObj.getTime());
    }, "Fecha inválida"),

  paymentMethod: z
    .enum(["CASH", "CREDIT_CARD", "DEBIT_CARD", "BANK_TRANSFER", "CHECK", "GIFT_CARD"])
    .describe("El método de pago es obligatorio"),
});

type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>;

interface NewInvoiceDialogProps {
  reservationsBillingData: ReservationBillingDetails[];
  loadingReservations: boolean;
  onInvoiceAdd: (invoice: Invoice) => void;
}

export function NewInvoiceDialog({
  reservationsBillingData,
  loadingReservations,
  onInvoiceAdd,
}: NewInvoiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedBillingData, setSelectedBillingData] =
    useState<ReservationBillingDetails | null>(null);

  // React Hook Form with Zod validation
  const form = useForm<CreateInvoiceFormData>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      reservationId: "",
      issueDate: "",
      paymentMethod: "CASH",
    },
  });

  const handleReservationSelect = (reservationId: string) => {
    const billingData = reservationsBillingData.find(
      (bd) => bd.reservation.id.toString() === reservationId
    );
    
    if (billingData) {
      setSelectedBillingData(billingData);
      form.setValue("reservationId", reservationId);
    }
  };

  const onSubmit = async (data: CreateInvoiceFormData) => {
    if (!selectedBillingData) {
      toast("Error", {
        description: "Debe seleccionar una reservación válida",
      });
      return;
    }

    // Auto-populate concepts with all charges
    const concepts: InvoiceConcept[] = [];

    // Add room charges
    if (selectedBillingData.roomCharges > 0) {
      concepts.push({
        description: `Habitación ${selectedBillingData.reservation.room?.number} - ${selectedBillingData.reservation.nights || 0} noches`,
        quantity: 1,
        price: Number(selectedBillingData.roomCharges),
      });
    }

    // Add room service charges
    selectedBillingData.roomServiceCharges.forEach((rs) => {
      concepts.push({
        description: `Servicio a la habitación - ${rs.orderNumber}`,
        quantity: 1,
        price: Number(rs.total),
      });
    });

    // Add event charges
    selectedBillingData.eventCharges.forEach((evt) => {
      concepts.push({
        description: `Evento: ${evt.title} - ${evt.attendees} personas`,
        quantity: 1,
        price: Number(evt.total),
      });
    });

    // Calculate total
    const subtotal = concepts.reduce(
      (sum, concept) =>
        sum + (Number(concept.quantity) || 0) * (Number(concept.price) || 0),
      0
    );

    try {
      // Calculate tax rate (e.g., 19% IVA)
      const taxRate = 0.19;
      const dueDate = new Date(data.issueDate);
      dueDate.setDate(dueDate.getDate() + 30); // Due in 30 days

      // Create invoice items from concepts
      const items = concepts.map(concept => ({
        description: concept.description,
        quantity: concept.quantity,
        price: concept.price,
        total: concept.quantity * concept.price
      }));

      // Create invoice with proper backend structure
      const invoiceData = {
        guestName: selectedBillingData.reservation.guestName || "",
        roomNumber: selectedBillingData.reservation.room?.number || "",
        issueDate: new Date(data.issueDate),
        dueDate: dueDate,
        subtotal: subtotal,
        taxes: subtotal * taxRate,
        total: subtotal * (1 + taxRate),
        reservationId: parseInt(data.reservationId),
        paymentMethod: data.paymentMethod,
        invoiceItems: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price
        }))
      };

      // Send to backend
      const createdInvoice = await billingApi.createInvoice(invoiceData);
      onInvoiceAdd(createdInvoice);
      
      // Show success toast
      toast("Factura creada", {
        description: `Factura ${createdInvoice.number} para ${selectedBillingData.reservation.guestName} creada exitosamente`,
      });

      // Reset form and close dialog
      handleClose();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error("Error", {
        description: "No se pudo crear la factura. Por favor intente nuevamente."
      });
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedBillingData(null);
    setOpen(false);
  };

  const handleCancel = () => {
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Factura
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Factura</DialogTitle>
          <DialogDescription>
            Crear una nueva factura para un huésped
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Reservation Selection */}
            <FormField
              control={form.control}
              name="reservationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reservación con Huésped</FormLabel>
                  <FormControl>
                    <ReservationSelector
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        handleReservationSelect(value);
                      }}
                      reservations={reservationsBillingData}
                      loading={loadingReservations}
                      roomNumber={selectedBillingData?.reservation.room?.number || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Issue Date */}
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Emisión</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Method */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Pago</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione método de pago" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CASH">Efectivo</SelectItem>
                      <SelectItem value="CREDIT_CARD">Tarjeta de Crédito</SelectItem>
                      <SelectItem value="DEBIT_CARD">Tarjeta de Débito</SelectItem>
                      <SelectItem value="BANK_TRANSFER">Transferencia Bancaria</SelectItem>
                      <SelectItem value="CHECK">Cheque</SelectItem>
                      <SelectItem value="GIFT_CARD">Tarjeta de Regalo</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Billing Details Display */}
            {selectedBillingData && (
              <BillingDetailsDisplay billingData={selectedBillingData} />
            )}

            {/* Action Buttons */}
            <DialogFooter className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                Crear Factura
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
