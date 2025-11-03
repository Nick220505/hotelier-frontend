"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Event creation schema
const eventCreationSchema = z
  .object({
    name: z
      .string()
      .min(1, "El nombre del evento es requerido")
      .min(3, "El nombre debe tener al menos 3 caracteres"),
    client: z.string().min(1, "El nombre del cliente es requerido"),
    clientEmail: z.string().email("Debe ser un email válido"),
    clientPhone: z.string().optional(),
    date: z.string().min(1, "La fecha es requerida"),
    startTime: z.string().min(1, "La hora de inicio es requerida"),
    endTime: z.string().min(1, "La hora de fin es requerida"),
    venueId: z.string().min(1, "Debe seleccionar un salón"),
    capacity: z.string().min(1, "La capacidad es requerida"),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.startTime < data.endTime;
      }
      return true;
    },
    {
      message: "La hora de inicio debe ser anterior a la hora de fin",
      path: ["endTime"],
    },
  );

type EventCreationFormData = z.infer<typeof eventCreationSchema>;

interface EventBookingData {
  name: string;
  client: string;
  clientEmail: string;
  clientPhone?: string;
  date: string;
  startTime: string;
  endTime: string;
  venueId: number;
  capacity: number;
  description?: string;
  totalPrice: number;
}

interface Venue {
  id: number;
  name: string;
  capacity: number;
  basePrice: number;
  location: string;
  available?: boolean;
  description?: string;
}

interface EventCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventAdd: (event: EventBookingData) => Promise<void>;
  venues: Venue[];
}

export function EventCreationDialog({
  open,
  onOpenChange,
  onEventAdd,
  venues = [],
}: EventCreationDialogProps) {
  const form = useForm<EventCreationFormData>({
    resolver: zodResolver(eventCreationSchema),
    defaultValues: {
      name: "",
      client: "",
      clientEmail: "",
      clientPhone: "",
      date: "",
      startTime: "",
      endTime: "",
      venueId: "",
      capacity: "",
      description: "",
    },
  });

  const watchedValues = useWatch({ control: form.control }) || {};

  // Calculate total price based on venue base price and duration
  const calculateTotalPrice = (): number => {
    const selectedVenue = venues.find(
      (v) => v.id === parseInt(watchedValues.venueId || "0"),
    );
    if (!selectedVenue || !watchedValues.startTime || !watchedValues.endTime)
      return 0;

    const startTime = new Date(`2000-01-01T${watchedValues.startTime}`);
    const endTime = new Date(`2000-01-01T${watchedValues.endTime}`);
    const durationHours =
      (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

    return selectedVenue.basePrice * durationHours;
  };

  const onSubmit = async (data: EventCreationFormData) => {
    try {
      const eventData: EventBookingData = {
        name: data.name,
        client: data.client,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        venueId: parseInt(data.venueId),
        capacity: parseInt(data.capacity),
        description: data.description,
        totalPrice: calculateTotalPrice(),
      };

      await onEventAdd(eventData);
      form.reset();
      onOpenChange(false);
      toast.success("Evento creado exitosamente");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Error al crear el evento");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Evento</DialogTitle>
          <DialogDescription>
            Complete los detalles del evento para realizar la reserva.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Evento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Cumpleaños de Ana" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email del Cliente</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="cliente@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="clientPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono del Cliente (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Número de teléfono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha del Evento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de Inicio</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de Fin</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="venueId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salón</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar salón" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {venues
                          .filter((venue) => venue.available !== false)
                          .map((venue) => (
                            <SelectItem
                              key={venue.id}
                              value={venue.id.toString()}
                            >
                              {venue.name} - Capacidad: {venue.capacity}{" "}
                              personas
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
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Invitados</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ej: 50"
                        min="1"
                        {...field}
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
                  <FormLabel>Descripción Adicional (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalles adicionales del evento..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedValues.venueId &&
              watchedValues.startTime &&
              watchedValues.endTime && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Precio Base del Salón:</span>
                      <span>
                        $
                        {venues.find(
                          (v) => v.id === parseInt(watchedValues.venueId || "0"),
                        )?.basePrice || 0}
                        /hora
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg mt-2">
                      <span>Total Estimado:</span>
                      <span>${calculateTotalPrice()}</span>
                    </div>
                  </div>
                </div>
              )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Crear Evento</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
