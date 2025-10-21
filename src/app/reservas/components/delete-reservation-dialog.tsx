"use client";

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
import { Loader2 } from "lucide-react";
import { type Reservation } from "@/lib/api/reservations";

interface DeleteReservationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onConfirmDelete: () => void;
  loading: boolean;
}

export function DeleteReservationDialog({
  isOpen,
  onClose,
  reservation,
  onConfirmDelete,
  loading,
}: DeleteReservationDialogProps) {
  if (!reservation) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar reserva?</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Está seguro de que desea eliminar la reserva #{reservation.id} de{" "}
            <strong>{reservation.guestName}</strong>?
            <br />
            <br />
            Esta acción no se puede deshacer. La reserva será eliminada
            permanentemente del sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
