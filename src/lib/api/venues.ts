import { apiRequest } from "./base";
import { BaseEntity } from "../types";

// Venue types
export interface Venue extends BaseEntity {
  name: string;
  capacity: number;
  area: number;
  hourlyRate: number;
  available: boolean;
  location: string;
  description?: string;
}

// Backend venue type
interface BackendVenue {
  id: number;
  name: string;
  capacity: number;
  area: number;
  hourlyRate: number;
  available: boolean;
  location: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Transform backend venue to frontend format
const transformVenue = (backendVenue: BackendVenue): Venue => {
  return {
    id: backendVenue.id,
    name: backendVenue.name,
    capacity: backendVenue.capacity,
    area: backendVenue.area,
    hourlyRate: backendVenue.hourlyRate,
    available: backendVenue.available,
    location: backendVenue.location,
    description: backendVenue.description,
    createdAt: backendVenue.createdAt,
    updatedAt: backendVenue.updatedAt,
  };
};

// Extended venues API with data transformation
export const venuesApi = {
  // Override getAll to transform data
  getAll: async (): Promise<Venue[]> => {
    const backendVenues = await apiRequest("/venues");
    return (backendVenues as BackendVenue[]).map(transformVenue);
  },

  // Override getById to transform data
  getById: async (id: number): Promise<Venue> => {
    const backendVenue = await apiRequest(`/venues/${id}`);
    return transformVenue(backendVenue as BackendVenue);
  },

  // Specialized endpoints
  getAvailable: async (): Promise<Venue[]> => {
    const backendVenues = await apiRequest("/venues/available");
    return (backendVenues as BackendVenue[]).map(transformVenue);
  },

  // Create new venue
  create: async (data: Omit<Venue, "id" | "createdAt" | "updatedAt">): Promise<Venue> => {
    const backendVenue = await apiRequest("/venues", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return transformVenue(backendVenue as BackendVenue);
  },

  // Update existing venue
  update: async (id: number, data: Partial<Omit<Venue, "id" | "createdAt" | "updatedAt">>): Promise<Venue> => {
    const backendVenue = await apiRequest(`/venues/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return transformVenue(backendVenue as BackendVenue);
  },

  // Delete venue
  delete: async (id: number): Promise<void> => {
    await apiRequest(`/venues/${id}`, {
      method: "DELETE",
    });
  },
};
