import { z } from "zod";

// Menu Item Schema
export const menuItemSchema = z.object({
  category: z.string().min(1, "La categoría es requerida"),
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  price: z.number().min(0, "El precio debe ser mayor a 0"),
  preparationTime: z.string().optional(),
  available: z.boolean(),
  ingredients: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
});

export type MenuItemFormData = z.infer<typeof menuItemSchema>;

// Restock Schema
export const restockSchema = z.object({
  newStock: z.number().min(0, "El stock debe ser mayor o igual a 0"),
});

export type RestockFormData = z.infer<typeof restockSchema>;

// Helper function to convert comma-separated string to array
export const stringToArray = (value: string): string[] => {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

// Helper function to convert array to comma-separated string
export const arrayToString = (arr: string[] | undefined): string => {
  return arr ? arr.join(", ") : "";
};
