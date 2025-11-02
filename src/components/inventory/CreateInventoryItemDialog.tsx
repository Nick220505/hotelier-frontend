"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  InventoryItemForm,
  type InventoryItemFormData,
} from "./InventoryItemForm";
import { inventoryApi } from "@/lib/api/inventory";
import { toast } from "sonner";

interface CreateInventoryItemDialogProps {
  onItemCreated?: () => void;
}

export function CreateInventoryItemDialog({
  onItemCreated,
}: CreateInventoryItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: InventoryItemFormData) => {
    setIsSubmitting(true);
    try {
      await inventoryApi.createInventoryItem(data);

      toast.success("Producto creado exitosamente");

      setOpen(false);
      onItemCreated?.();
    } catch (error) {
      console.error("Error creating inventory item:", error);
      toast.error("No se pudo crear el producto. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Producto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Producto al Inventario</DialogTitle>
          <DialogDescription>
            Completa la información del nuevo producto. Los campos marcados son
            obligatorios.
          </DialogDescription>
        </DialogHeader>

        <InventoryItemForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          submitLabel="Crear Producto"
        />
      </DialogContent>
    </Dialog>
  );
}
