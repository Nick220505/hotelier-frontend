"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { MenuItem } from "@/lib/api/restaurant";

const orderItemSchema = z.object({
  menuItemId: z
    .string({ message: "Selecciona un producto" })
    .min(1, "Selecciona un producto"),
  quantity: z
    .number({ message: "La cantidad es obligatoria" })
    .min(1, "La cantidad debe ser mayor a 0")
    .max(99, "La cantidad debe ser menor a 100"),
  specialRequests: z.string().optional(),
});

const newOrderSchema = z.object({
  roomNumber: z
    .string({ message: "El número de habitación es obligatorio" })
    .min(1, "Ingresa el número de habitación")
    .max(10, "Número de habitación muy largo"),
  guestName: z
    .string({ message: "El nombre del huésped es obligatorio" })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre debe tener máximo 100 caracteres"),
  specialInstructions: z
    .string()
    .max(500, "Las instrucciones deben tener máximo 500 caracteres")
    .optional(),
  selectedItems: z
    .array(orderItemSchema)
    .min(1, "Debe agregar al menos un producto"),
});

type NewOrderFormData = z.infer<typeof newOrderSchema>;

interface NewOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItems: MenuItem[];
  onCreateOrder: (orderData: NewOrderFormData) => void;
  isLoading?: boolean;
}

export function NewOrderDialog({
  open,
  onOpenChange,
  menuItems,
  onCreateOrder,
  isLoading = false,
}: NewOrderDialogProps) {
  const form = useForm<NewOrderFormData>({
    resolver: zodResolver(newOrderSchema),
    defaultValues: {
      roomNumber: "",
      guestName: "",
      specialInstructions: "",
      selectedItems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "selectedItems",
  });

  const onSubmit = (data: NewOrderFormData) => {
    onCreateOrder(data);
    form.reset();
    onOpenChange(false);
  };

  const addItemToOrder = () => {
    append({ menuItemId: "", quantity: 1, specialRequests: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Orden de Room Service</DialogTitle>
          <DialogDescription>
            Crea una nueva orden para el servicio a la habitación
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roomNumber">Habitación *</Label>
              <Input
                id="roomNumber"
                {...form.register("roomNumber")}
                placeholder="101"
                disabled={form.formState.isSubmitting}
                className={
                  form.formState.errors.roomNumber ? "border-red-500" : ""
                }
              />
              {form.formState.errors.roomNumber && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.roomNumber.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="guestName">Nombre del Huésped *</Label>
              <Input
                id="guestName"
                {...form.register("guestName")}
                placeholder="Juan Pérez"
                disabled={form.formState.isSubmitting}
                className={
                  form.formState.errors.guestName ? "border-red-500" : ""
                }
              />
              {form.formState.errors.guestName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.guestName.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label>Productos</Label>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-2 p-3 border rounded-lg"
                >
                  <Select
                    value={form.watch(`selectedItems.${index}.menuItemId`)}
                    onValueChange={(value) =>
                      form.setValue(`selectedItems.${index}.menuItemId`, value)
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {menuItems
                        .filter((menuItem) => menuItem.available)
                        .map((menuItem) => (
                          <SelectItem key={menuItem.id} value={menuItem.id}>
                            {menuItem.name} - ${menuItem.price.toLocaleString()}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    className="w-20"
                    placeholder="Cant."
                    min="1"
                    {...form.register(`selectedItems.${index}.quantity`, {
                      valueAsNumber: true,
                    })}
                    disabled={form.formState.isSubmitting}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={form.formState.isSubmitting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addItemToOrder}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="specialInstructions">
              Instrucciones Especiales
            </Label>
            <Textarea
              id="specialInstructions"
              {...form.register("specialInstructions")}
              placeholder="Instrucciones especiales para la orden..."
              disabled={form.formState.isSubmitting}
              className={
                form.formState.errors.specialInstructions
                  ? "border-red-500"
                  : ""
              }
            />
            {form.formState.errors.specialInstructions && (
              <p className="text-sm text-red-500">
                {form.formState.errors.specialInstructions.message}
              </p>
            )}
          </div>

          {form.formState.errors.selectedItems && (
            <p className="text-sm text-red-500">
              {form.formState.errors.selectedItems.message}
            </p>
          )}

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading || form.formState.isSubmitting}
              className="flex-1"
            >
              {(isLoading || form.formState.isSubmitting) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Crear Orden
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
