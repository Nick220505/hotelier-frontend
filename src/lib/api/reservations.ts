import { apiRequest, createApiEndpoints } from "./base";
import { BaseEntity } from "../types";
import { User } from "./auth";
import { Room } from "./rooms";

// Reservation types
export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED";

export type BookingChannel =
  | "DIRECT"
  | "BOOKING_COM"
  | "EXPEDIA"
  | "AIRBNB"
  | "AGENCY"
  | "PHONE";

export interface Reservation extends BaseEntity {
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalAmount: number;
  discountPercent?: number;
  discountAmount?: number;
  status: ReservationStatus;
  channel: BookingChannel;
  notes?: string;
  userId: number;
  roomId: number;
  guestId?: number;
  user: User;
  room: Room;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  nights?: number;
}

// Create base CRUD operations
const baseApi = createApiEndpoints<Reservation>("/reservations");

// Extended reservations API with analytics and reception features
export const reservationsApi = {
  // Base CRUD operations
  ...baseApi,
  getCurrentGuests: (): Promise<Reservation[]> =>
    apiRequest("/reservations/current"),

  // Checkout endpoint (returns DTO)
  checkout: (
    id: number,
  ): Promise<{
    reservation: Reservation;
    assignmentId?: number | null;
    invoiceId?: number | null;
  }> => apiRequest(`/reservations/${id}/checkout`, { method: "PATCH" }),

  // Self-service endpoints
  getMine: (): Promise<Reservation[]> => apiRequest(`/reservations/mine`),
  createSelf: (
    data: Omit<
      Reservation,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "user"
      | "room"
      | "totalAmount"
      | "status"
    >,
  ): Promise<Reservation> =>
    apiRequest(`/reservations/self`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Availability lookup
  getAvailability: (
    startDate: string,
    endDate: string,
    opts?: { type?: string; guests?: number },
  ): Promise<Room[]> => {
    const params = new URLSearchParams({ startDate, endDate });
    if (opts?.type) params.set("type", opts.type);
    if (typeof opts?.guests === "number")
      params.set("guests", String(opts.guests));

    const url = `/reservations/availability?${params.toString()}`;
    console.log("ReservationsApi - getAvailability called:", {
      startDate,
      endDate,
      opts,
      url,
    });

    return apiRequest(url)
      .then((response) => {
        const rooms = response as Room[];
        console.log("ReservationsApi - getAvailability response:", rooms);
        return rooms;
      })
      .catch((error) => {
        console.error("ReservationsApi - getAvailability error:", error);
        throw error;
      });
  },

  // Billing details for invoicing
  getReservationsWithBillingDetails: (): Promise<ReservationBillingDetails[]> =>
    apiRequest("/reservations/billing-details"),
};

export interface RoomServiceCharge {
  orderId: number;
  orderNumber: string;
  orderTime: string;
  total: number;
  status: string;
  items: Array<{
    item: string;
    quantity: number;
    price: number;
    notes?: string;
  }>;
}

export interface EventCharge {
  bookingId: number;
  title: string;
  eventDate: string;
  total: number;
  status: string;
  attendees: number;
}

export interface ReservationBillingDetails {
  reservation: Reservation;
  roomCharges: number;
  roomServiceCharges: RoomServiceCharge[];
  roomServiceTotal: number;
  eventCharges: EventCharge[];
  eventTotal: number;
  grandTotal: number;
  hasInvoice: boolean;
  isPendingPayment?: boolean;
  reservationStatus?: string;
}
