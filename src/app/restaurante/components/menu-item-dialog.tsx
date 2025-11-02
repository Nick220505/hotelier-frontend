"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { MenuItem, restaurantApi } from "@/lib/api/restaurant";
import { MenuItemFormData } from "@/lib/schemas/restaurant";
import { MenuItemForm } from "./menu-item-form";

interface MenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: MenuItem;
  onSuccess?: () => void;
}

export function MenuItemDialog({
  open,
  onOpenChange,
  item,
  onSuccess,
}: MenuItemDialogProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!item;

  const handleSubmit = async (data: MenuItemFormData) => {
    setLoading(true);
    try {
      const payload = {
        category: data.category,
        name: data.name,
        price: data.price,
        available: data.available,
        ...(data.description &&
          data.description.trim() && { description: data.description.trim() }),
        ...(data.preparationTime &&
          data.preparationTime.trim() && {
            preparationTime: data.preparationTime.trim(),
          }),
        ...(data.ingredients?.length && { ingredients: data.ingredients }),
        ...(data.allergens?.length && { allergens: data.allergens }),
      };

      if (isEditing) {
        await restaurantApi.updateMenuItem(item, payload);
        toast("Item actualizado", {
          description: `${data.name} ha sido actualizado exitosamente`,
        });
      } else {
        await restaurantApi.createMenuItem(payload);
        toast("Item creado", {
          description: `${data.name} ha sido creado exitosamente`,
        });
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving menu item:", error);
      let errorMessage = `No se pudo ${isEditing ? "actualizar" : "crear"} el item del menú`;

      if (error instanceof Error) {
        if (
          error.message.includes("Access denied") ||
          error.message.includes("403")
        ) {
          errorMessage =
            "No tienes permisos para realizar esta acción. Contacta al administrador.";
        } else if (
          error.message.includes("Authentication required") ||
          error.message.includes("401")
        ) {
          errorMessage =
            "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
        } else if (
          error.message.includes("not found") ||
          error.message.includes("404")
        ) {
          errorMessage = "El item del menú no fue encontrado.";
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      toast("Error", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Item del Menú" : "Crear Nuevo Item del Menú"}
          </DialogTitle>
        </DialogHeader>

        <MenuItemForm
          item={item}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}
