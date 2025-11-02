"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Define the schema based on the backend entity structure
const inventoryItemSchema = z
  .object({
    name: z.string().min(1, "Nombre es requerido").max(100, "Nombre muy largo"),
    category: z.enum([
      "LINENS",
      "AMENITIES",
      "CLEANING_SUPPLIES",
      "FOOD_BEVERAGE",
      "MAINTENANCE",
      "OFFICE_SUPPLIES",
      "FURNITURE",
      "ELECTRONICS",
    ]),
    currentStock: z.number().min(0, "Stock actual debe ser mayor o igual a 0"),
    minimumStock: z.number().min(0, "Stock mínimo debe ser mayor o igual a 0"),
    maximumStock: z.number().min(1, "Stock máximo debe ser mayor a 0"),
    unit: z.string().min(1, "Unidad es requerida").max(20, "Unidad muy larga"),
    unitCost: z.number().min(0, "Costo debe ser mayor o igual a 0"),
    supplier: z
      .string()
      .min(1, "Proveedor es requerido")
      .max(100, "Proveedor muy largo"),
    description: z.string().optional(),
    location: z.string().optional(),
    supplierId: z.number().optional(),
    lastRestockDate: z.string().nullable().optional(),
  })
  .refine((data) => data.maximumStock >= data.minimumStock, {
    message: "Stock máximo debe ser mayor o igual al stock mínimo",
    path: ["maximumStock"],
  })
  .refine((data) => data.maximumStock >= data.currentStock, {
    message: "Stock máximo debe ser mayor o igual al stock actual",
    path: ["maximumStock"],
  });

export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;

interface InventoryItemFormProps {
  initialData?: Partial<InventoryItemFormData>;
  onSubmit: (data: InventoryItemFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const categoryLabels = {
  LINENS: "Ropa de Cama",
  AMENITIES: "Amenidades",
  CLEANING_SUPPLIES: "Suministros de Limpieza",
  FOOD_BEVERAGE: "Alimentos y Bebidas",
  MAINTENANCE: "Mantenimiento",
  OFFICE_SUPPLIES: "Suministros de Oficina",
  FURNITURE: "Mobiliario",
  ELECTRONICS: "Electrónicos",
};

export function InventoryItemForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Guardar",
}: InventoryItemFormProps) {
  const form = useForm<InventoryItemFormData>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || undefined,
      currentStock: initialData?.currentStock || 0,
      minimumStock: initialData?.minimumStock || 0,
      maximumStock: initialData?.maximumStock || 0,
      unit: initialData?.unit || "",
      unitCost: initialData?.unitCost || 0,
      supplier: initialData?.supplier || "",
      description: initialData?.description || "",
      location: initialData?.location || "",
      supplierId: initialData?.supplierId || undefined,
      lastRestockDate: initialData?.lastRestockDate || undefined,
    },
  });

  const handleSubmit = async (data: InventoryItemFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Producto</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Sábanas de algodón blancas"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Actual</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minimumStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Mínimo</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Cantidad mínima antes de alertar sobre stock bajo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maximumStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Máximo</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Capacidad máxima de almacenamiento
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unidad de Medida</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: piezas, litros, kg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unitCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Costo por Unidad</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proveedor</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del proveedor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Almacén A, Estante 3" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastRestockDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Última Fecha de Reabastecimiento (Opcional)
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción detallada del producto..."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
