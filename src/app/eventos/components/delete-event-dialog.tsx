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
import { toast } from "sonner";

interface Event {
  id: number;
  title: string;
  client: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  services: {
    catering: boolean;
    audiovisual: boolean;
    decoration: boolean;
    accommodation: boolean;
  };
  budget: number;
  status: string;
}

interface DeleteEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onEventDelete: (id: number) => Promise<void>;
}

export function DeleteEventDialog({
  open,
  onOpenChange,
  event,
  onEventDelete,
}: DeleteEventDialogProps) {
  const handleDelete = async () => {
    if (!event) return;

    try {
      await onEventDelete(event.id);
      toast.success("Evento eliminado exitosamente");
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Hubo un problema al eliminar el evento");
    }
  };

  if (!event) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. El evento &quot;{event.title}
            &quot; programado para el {event.date} con {event.client} será
            eliminado permanentemente del sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
