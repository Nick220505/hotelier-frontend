import { apiRequest, createApiEndpoints } from "./base";

export interface Guest {
  id: number;
  name: string;
  email: string;
  phone?: string;
  document?: string;
  address?: string;
  nationality?: string;
  birthDate?: string;
  preferences?: string;
  vip: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateGuest = Omit<
  Guest,
  "id" | "createdAt" | "updatedAt" | "vip"
> & {
  vip?: boolean;
};

const base = createApiEndpoints<Guest, CreateGuest, Partial<CreateGuest>>(
  "/guests",
);

export interface ActiveGuest extends Guest {
  roomNumber?: string;
  checkIn: string;
  checkOut: string;
}

export const guestsApi = {
  ...base,
  search: (term: string): Promise<Guest[]> =>
    apiRequest(`/guests?search=${encodeURIComponent(term)}`),
  getActiveGuests: async (): Promise<ActiveGuest[]> =>
    apiRequest("/guests/active"),
};
