import { createApiEndpoints } from "./base";
import { BaseEntity } from "../types";

// Room types
export interface Room extends BaseEntity {
  number: string;
  type: "INDIVIDUAL" | "DOBLE" | "SUITE" | "FAMILIAR";
  price: number;
  capacity: number;
  isAvailable: boolean;
  description?: string;
}

// Rooms API with standard CRUD operations
export const roomsApi = createApiEndpoints<Room>("/rooms");
