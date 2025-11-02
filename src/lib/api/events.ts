import { apiRequest } from "./base";
import { BaseEntity } from "../types";
import { Venue } from "./venues";

// Event types
export type EventStatus =
  | "PLANNED"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface EventBooking extends BaseEntity {
  title: string;
  description?: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  attendees: number;
  totalCost: number;
  status: EventStatus;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  notes?: string;
  venueId: number;
  venue: Venue;
}

// Extended events API
export const eventsApi = {
  // Basic CRUD operations for event bookings
  getAll: (): Promise<EventBooking[]> => apiRequest("/events"),
  getById: (id: number): Promise<EventBooking> => apiRequest(`/events/${id}`),
  create: (
    data: Omit<EventBooking, "id" | "createdAt" | "updatedAt" | "venue">,
  ): Promise<EventBooking> =>
    apiRequest("/events/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (
    id: number,
    data: Partial<
      Omit<EventBooking, "id" | "createdAt" | "updatedAt" | "venue">
    >,
  ): Promise<EventBooking> =>
    apiRequest(`/events/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: number): Promise<EventBooking> =>
    apiRequest(`/events/${id}`, {
      method: "DELETE",
    }),

  // Specialized endpoints
  getUpcoming: (): Promise<EventBooking[]> => apiRequest("/events/upcoming"),
};
