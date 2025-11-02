"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { reservationsApi, type Reservation } from "@/lib/api/reservations";
import { type Room } from "@/lib/api/rooms";

import { NewReservationDialog } from "./new-reservation-dialog";
import { EditReservationDialog } from "./edit-reservation-dialog";
import { DeleteReservationDialog } from "./delete-reservation-dialog";
import { ViewReservationDialog } from "./view-reservation-dialog";
import { ReservationsTable } from "./reservations-table";

interface ReservationsProps {
  initialReservations: Reservation[];
  rooms: Room[];
  currencyCode?: string;
}

export function Reservations({
  initialReservations,
  rooms,
  currencyCode,
}: ReservationsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  // Las reservas vienen del backend ya ordenadas por fecha de creación (más reciente primero)
  const [reservations, setReservations] =
    useState<Reservation[]>(initialReservations);
  const [loading, setLoading] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  // Estados para los diálogos
  const [newReservationDialogOpen, setNewReservationDialogOpen] =
    useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  // La lógica de la nueva reserva se maneja dentro del componente NewReservationDialog



  // Quick status updates
  const handleUpdateStatus = async (
    id: number,
    status: Reservation["status"],
  ) => {
    try {
      setLoading(true);
      const updatedReservation = await reservationsApi.update(id, { status });
      setReservations((prev) => prev.map((r) => (r.id === id ? updatedReservation : r)));
      toast("Estado actualizado", { description: `Reserva #${id} → ${status}` });
    } catch (error) {
      console.error("Error updating status:", error);
      toast("Error", { description: "No se pudo actualizar el estado" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddReservation = async (formData: {
    guestName: string;
    guestEmail: string;
    guestPhone?: string;
    guests: number;
    checkInDate: string;
    checkOutDate: string;
    roomId: number;
    discountAmount?: number;
    discountPercent?: number;
    guestId?: number | null;
    channel: string;
  }) => {
    try {
      setLoading(true);
      const room = rooms.find((r) => r.id === formData.roomId);
      if (!room) {
        toast.error("Error", {
          description: "Habitación no encontrada",
        });
        return;
      }

      // Preparar los datos asegurando que los campos numéricos sean válidos
      const reservationData = {
        ...formData,
        channel: "DIRECT" as const,
        roomId: parseInt(formData.roomId.toString()),
        guests: parseInt(formData.guests.toString()),
        discountAmount: formData.discountAmount || null,
        discountPercent: formData.discountPercent || null,
        guestId: formData.guestId || null
      };

      await reservationsApi.createSelf(
        reservationData as unknown as Omit<
          Reservation,
          "id" | "createdAt" | "updatedAt" | "user" | "room" | "totalAmount" | "status"
        >,
      );

      // Refrescar la lista completa para garantizar el orden correcto desde el backend
      const updatedReservations = await reservationsApi.getAll();
      setReservations(updatedReservations);

      toast("Éxito", { description: "Reserva creada exitosamente" });

      // Cerrar el diálogo después de crear la reserva
      setNewReservationDialogOpen(false);
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast.error("Error", { description: "No se pudo crear la reserva" });
    } finally {
      setLoading(false);
    }
  };

  const handleViewReservation = (reservationId: number) => {
    const reservation = reservations.find((r) => r.id === reservationId);
    if (reservation) {
      setSelectedReservation(reservation);
      setViewDialogOpen(true);
    }
  };

  const handleEditReservation = (reservationId: number) => {
    const reservation = reservations.find((r) => r.id === reservationId);
    if (reservation) {
      setSelectedReservation(reservation);
      setEditDialogOpen(true);
    }
  };

  const handleUpdateReservation = async (
    id: number,
    data: Partial<Reservation>,
  ) => {
    try {
      setLoading(true);
      const updatedReservation = await reservationsApi.update(id, data);
      setReservations(
        reservations.map((r) => (r.id === id ? updatedReservation : r)),
      );
      setEditDialogOpen(false);
      setSelectedReservation(null);
      toast("Éxito", { description: "Reserva actualizada exitosamente" });
    } catch (error) {
      console.error("Error updating reservation:", error);
      toast.error("Error", { description: "No se pudo actualizar la reserva" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReservation = (reservationId: number) => {
    const reservation = reservations.find((r) => r.id === reservationId);
    if (reservation) {
      setSelectedReservation(reservation);
      setDeleteDialogOpen(true);
    }
  };

  const handleCheckout = async (id: number) => {
    try {
      setProcessingCheckout(true);
      const dto = await reservationsApi.checkout(id);
      const updated = dto.reservation;
      setReservations(reservations.map((r) => (r.id === id ? updated : r)));
      setViewDialogOpen(false);
      setSelectedReservation(null);
      toast("Checkout realizado", {
        description:
          `Se envió la habitación ${updated.room?.number ?? updated.roomId} a limpieza` +
          (dto.assignmentId ? ` (Asignación #${dto.assignmentId})` : "") +
          ". Ver en Limpieza.",
      });
    } catch (error) {
      console.error("Error performing checkout:", error);
      toast.error("Error", {
        description: "No se pudo completar el checkout",
      });
    } finally {
      setProcessingCheckout(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedReservation) return;

    try {
      setLoading(true);
      await reservationsApi.delete(Number(selectedReservation.id));
      setReservations(
        reservations.filter((r) => r.id !== selectedReservation.id),
      );
      setDeleteDialogOpen(false);
      setSelectedReservation(null);
      toast("Éxito", { description: "Reserva eliminada exitosamente" });
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast.error("Error", { description: "No se pudo eliminar la reserva" });
    } finally {
      setLoading(false);
    }
  };

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      (reservation.guestName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.id
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Reservas</h1>
          <p className="text-muted-foreground">
            Administra las reservas del hotel
          </p>
          <div className="flex items-center space-x-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por nombre o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                <SelectItem value="CHECKED_IN">Check-in</SelectItem>
                <SelectItem value="CHECKED_OUT">Check-out</SelectItem>
                <SelectItem value="CANCELLED">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={() => setNewReservationDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Reserva
        </Button>
      </div>

      <ReservationsTable
        reservations={filteredReservations}
        onViewReservation={handleViewReservation}
        onEditReservation={handleEditReservation}
        onDeleteReservation={handleDeleteReservation}
        currencyCode={currencyCode}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Diálogos */}
      <NewReservationDialog
        isOpen={newReservationDialogOpen}
        onClose={() => setNewReservationDialogOpen(false)}
        onAddReservation={handleAddReservation}
        rooms={rooms}
        loading={loading}
        currencyCode={currencyCode}
      />

      <ViewReservationDialog
        isOpen={viewDialogOpen}
        onClose={() => {
          setViewDialogOpen(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
        onCheckout={handleCheckout}
        isProcessing={processingCheckout}
        currencyCode={currencyCode}
      />

      <EditReservationDialog
        isOpen={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
        onUpdateReservation={handleUpdateReservation}
        rooms={rooms}
        loading={loading}
      />

      <DeleteReservationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
        onConfirmDelete={handleConfirmDelete}
        loading={loading}
      />
    </div>
  );
}