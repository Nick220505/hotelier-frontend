"use client";

import { useState } from "react";
import { toast } from "sonner";
import { eventsApi, EventBooking as ApiEventBooking } from "@/lib/api/events";
import { venuesApi, Venue as ApiVenue } from "@/lib/api/venues";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, MapPin, DollarSign, Users } from "lucide-react";
import EventManagement from "./event-management";
import VenueManagement from "./venue-management";
import EventsCalendar from "./events-calendar";

// Use API types
interface EventsDashboardProps {
  initialEvents: ApiEventBooking[];
  initialVenues: ApiVenue[];
}

export default function EventsDashboard({
  initialEvents,
  initialVenues,
}: EventsDashboardProps) {
  const [events, setEvents] = useState(initialEvents);
  const [venues, setVenues] = useState(initialVenues);

  const handleEventAdd = async (eventData: ApiEventBooking) => {
    try {
      // Create the event via API
      const newEvent = await eventsApi.create({
        title: eventData.title,
        eventDate: eventData.eventDate,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        attendees: eventData.attendees,
        totalCost: eventData.totalCost,
        status: eventData.status,
        clientName: eventData.clientName,
        clientEmail: eventData.clientEmail,
        clientPhone: eventData.clientPhone,
        notes: eventData.notes,
        venueId: eventData.venueId,
      });

      // Update local state with the new event from server
      setEvents([...events, newEvent]);
      toast.success("Evento creado exitosamente");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error al crear el evento. Por favor, inténtelo nuevamente.");
    }
  };

  const handleEventUpdate = async (
    eventId: number,
    updates: Partial<ApiEventBooking>,
  ) => {
    try {
      console.log(
        "Dashboard: Updating event with ID:",
        eventId,
        "Updates:",
        updates,
      );
      console.log("Dashboard: Updates keys:", Object.keys(updates));
      console.log(
        "Dashboard: totalCost in updates:",
        "totalCost" in updates,
        updates.totalCost,
      );

      // Update the event via API
      const updatedEvent = await eventsApi.update(eventId, updates);

      console.log("Dashboard: Event updated successfully:", updatedEvent);

      // Update local state
      setEvents((prevEvents) => {
        const newEvents = prevEvents.map((event) =>
          event.id === eventId ? updatedEvent : event,
        );
        console.log("Dashboard: Updated events state:", newEvents);
        return newEvents;
      });

      toast.success("Evento actualizado exitosamente");
    } catch (error) {
      console.error("Dashboard: Error updating event:", error);
      // Show more detailed error information
      if (error instanceof Error) {
        toast.error(`Error al actualizar el evento: ${error.message}`);
      } else {
        toast.error(
          "Error al actualizar el evento. Por favor, inténtelo nuevamente.",
        );
      }
    }
  };

  const handleEventDelete = async (eventId: number) => {
    try {
      // Delete the event via API
      await eventsApi.delete(eventId);

      // Update local state
      setEvents(events.filter((event) => event.id !== eventId));
      toast.success("Evento eliminado exitosamente");
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(
        "Error al eliminar el evento. Por favor, inténtelo nuevamente.",
      );
    }
  };

  const handleVenueAdd = (venue: ApiVenue) => {
    setVenues([...venues, venue]);
  };

  const handleVenueUpdate = async (id: number, updates: Partial<ApiVenue>) => {
    try {
      const updatedVenue = await venuesApi.update(id, updates);
      setVenues(
        venues.map((venue) =>
          (typeof venue.id === "string" ? parseInt(venue.id) : venue.id) === id
            ? updatedVenue
            : venue,
        ),
      );
      toast.success("Salón actualizado exitosamente");
    } catch (error) {
      console.error("Error updating venue:", error);
      toast.error(
        "Error al actualizar el salón. Por favor, inténtelo nuevamente.",
      );
    }
  };

  return (
    <div className="w-full max-w-full space-y-6 overflow-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Eventos y Salones</h1>
          <p className="text-muted-foreground">
            Administración de eventos, salones y servicios
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Eventos Este Mes
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">
              {events.filter((e) => e.status === "CONFIRMED").length}{" "}
              confirmados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Salones Disponibles
            </CardTitle>
            <MapPin className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {venues.filter((s) => s.available).length}
            </div>
            <p className="text-xs text-muted-foreground">
              De {venues.length} salones
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Eventos
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${events.reduce((total) => total + 0, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Asistentes Total
            </CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.reduce(
                (total, eventItem) => total + eventItem.attendees,
                0,
              )}
            </div>
            <p className="text-xs text-muted-foreground">Personas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="w-full space-y-4">
        <TabsList>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="salones">Salones</TabsTrigger>
          <TabsTrigger value="calendario">Calendario</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <EventManagement
            events={events}
            venues={venues}
            onEventAdd={handleEventAdd}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
          />
        </TabsContent>

        <TabsContent value="salones" className="space-y-4">
          <VenueManagement
            venues={venues}
            onVenueAdd={handleVenueAdd}
            onVenueUpdate={handleVenueUpdate}
          />
        </TabsContent>

        <TabsContent value="calendario" className="space-y-4">
          <EventsCalendar events={events} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
