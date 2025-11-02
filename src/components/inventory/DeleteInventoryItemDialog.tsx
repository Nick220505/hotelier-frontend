"use client";

import { useState } from "react";
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
import { inventoryApi, type InventoryItem } from "@/lib/api/inventory";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DeleteInventoryItemDialogProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemDeleted?: () => void;
}

export function DeleteInventoryItemDialog({
  item,
  open,
  onOpenChange,
  onItemDeleted,
}: DeleteInventoryItemDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!item) return;

    setIsDeleting(true);
    try {
      await inventoryApi.deleteInventoryItem(item.id);

      toast.success("Producto eliminado exitosamente");

      onOpenChange(false);
      onItemDeleted?.();
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      toast.error(
        "No se pudo eliminar el producto. Por favor intenta de nuevo.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!item) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el
            producto &quot;{item.name}&quot; del inventario.
            {item.currentStock > 0 && (
              <span className="block mt-2 text-amber-600 font-medium">
                ⚠️ Advertencia: Este producto tiene {item.currentStock}{" "}
                {item.unit} en stock.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
