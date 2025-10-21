"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { Room } from "@/lib/api/rooms";

interface ReservationFormData {
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  guests: string;
  checkInDate: string;
  checkOutDate: string;
  roomId: string;
  discountAmount?: string;
  guestId?: string;
}

interface DateSelectionSectionProps {
  form: UseFormReturn<ReservationFormData>;
  availableRooms: Room[];
  availabilityLoading?: boolean;
  currencyCode?: string;
  enabled?: boolean;
}

export function DateSelectionSection({ 
  form, 
  availableRooms, 
  availabilityLoading = false, 
  currencyCode, 
  enabled = true 
}: DateSelectionSectionProps) {
  if (!enabled) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="checkInDate">Fecha Check-in *</Label>
        <Input
          id="checkInDate"
          type="date"
          {...form.register("checkInDate")}
        />
        {form.formState.errors.checkInDate && (
          <p className="text-sm text-red-600">
            {String(form.formState.errors.checkInDate.message)}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="checkOutDate">Fecha Check-out *</Label>
        <Input
          id="checkOutDate"
          type="date"
          min={form.watch("checkInDate")}
          {...form.register("checkOutDate")}
        />
        {form.formState.errors.checkOutDate && (
          <p className="text-sm text-red-600">
            {String(form.formState.errors.checkOutDate.message)}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="roomId">Habitación *</Label>
        {availabilityLoading && (
          <div className="text-xs text-muted-foreground">Buscando disponibilidad...</div>
        )}
        <Select
          value={form.watch("roomId")}
          onValueChange={(value) => form.setValue("roomId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar habitación" />
          </SelectTrigger>
          <SelectContent>
            {availabilityLoading ? (
              <div className="p-2 text-center text-sm text-muted-foreground">
                Buscando habitaciones disponibles...
              </div>
            ) : (() => {
              const formValues = form.watch();
              
              // Solo mostrar habitaciones si tenemos fechas seleccionadas y la búsqueda de disponibilidad ha completado
              if (!formValues.checkInDate || !formValues.checkOutDate) {
                return (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    Selecciona fechas de check-in y check-out para ver habitaciones disponibles
                  </div>
                );
              }
              
              // Si ya tenemos fechas pero no hay resultado de disponibilidad, mostrar mensaje de búsqueda
              if (availableRooms === null) {
                return (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    Selecciona fechas para ver disponibilidad
                  </div>
                );
              }
              
              const roomsToShow = availableRooms;
              
              if (roomsToShow.length === 0) {
                return (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    No hay habitaciones disponibles para las fechas seleccionadas
                  </div>
                );
              }

              const formatCurrency = (val: number) => {
                try {
                  return new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: currencyCode || "COP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(val);
                } catch {
                  return `$${val.toLocaleString()}`;
                }
              };

              const getRoomTypeDisplayName = (type: string) => {
                switch (type) {
                  case "INDIVIDUAL":
                    return "Individual";
                  case "DOBLE":
                    return "Doble";
                  case "SUITE":
                    return "Suite";
                  case "FAMILIAR":
                    return "Familiar";
                  default:
                    return type;
                }
              };

              return roomsToShow.map((room) => (
                <SelectItem key={room.id} value={room.id.toString()}>
                  {room.number} - {getRoomTypeDisplayName(room.type)} (
                  {formatCurrency(Number(room.price))}/noche, cap. {room.capacity})
                </SelectItem>
              ));
            })()
            }
          </SelectContent>
        </Select>
        {form.formState.errors.roomId && (
          <p className="text-sm text-red-600">
            {String(form.formState.errors.roomId.message)}
          </p>
        )}
      </div>
    </div>
  );
}
