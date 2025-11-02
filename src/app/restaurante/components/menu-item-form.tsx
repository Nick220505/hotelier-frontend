"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import {
  menuItemSchema,
  MenuItemFormData,
  stringToArray,
  arrayToString,
} from "@/lib/schemas/restaurant";
import { MenuItem } from "@/lib/api/restaurant";

const categories = [
  "Appetizers",
  "Main Courses",
  "Desserts",
  "Beverages",
  "Specials",
];

interface MenuItemFormProps {
  item?: MenuItem;
  onSubmit: (data: MenuItemFormData) => void;
  onCancel: () => void;
  loading: boolean;
}

export function MenuItemForm({
  item,
  onSubmit,
  onCancel,
  loading,
}: MenuItemFormProps) {
  const isEditing = !!item;

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      category: item?.category || "",
      name: item?.name || "",
      description: item?.description || "",
      price: item?.price || 0,
      preparationTime: item?.preparationTime || "",
      available: item?.available ?? true,
      ingredients: item?.ingredients || [],
      allergens: item?.allergens || [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const handleFormSubmit = (data: MenuItemFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Categoría *</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <p className="text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Precio *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && (
            <p className="text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nombre *</Label>
        <Input
          id="name"
          placeholder="Ej: Pasta Carbonara"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          placeholder="Descripción del plato..."
          rows={3}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="preparationTime">Tiempo de Preparación</Label>
        <Input
          id="preparationTime"
          placeholder="Ej: 15 minutos"
          {...register("preparationTime")}
        />
        {errors.preparationTime && (
          <p className="text-sm text-red-600">
            {errors.preparationTime.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ingredients">Ingredientes (separados por comas)</Label>
        <Controller
          name="ingredients"
          control={control}
          render={({ field }) => (
            <Textarea
              id="ingredients"
              placeholder="pasta, bacon, huevos, queso parmesano..."
              rows={2}
              value={arrayToString(field.value)}
              onChange={(e) => field.onChange(stringToArray(e.target.value))}
            />
          )}
        />
        {errors.ingredients && (
          <p className="text-sm text-red-600">{errors.ingredients.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="allergens">Alérgenos (separados por comas)</Label>
        <Controller
          name="allergens"
          control={control}
          render={({ field }) => (
            <Input
              id="allergens"
              placeholder="gluten, lactosa, huevos..."
              value={arrayToString(field.value)}
              onChange={(e) => field.onChange(stringToArray(e.target.value))}
            />
          )}
        />
        {errors.allergens && (
          <p className="text-sm text-red-600">{errors.allergens.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label className="text-base">Disponible</Label>
          <div className="text-sm text-muted-foreground">
            El item estará disponible para pedidos
          </div>
        </div>
        <Controller
          name="available"
          control={control}
          render={({ field }) => (
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? isEditing
              ? "Actualizando..."
              : "Creando..."
            : isEditing
              ? "Actualizar"
              : "Crear"}
        </Button>
      </div>
    </form>
  );
}
