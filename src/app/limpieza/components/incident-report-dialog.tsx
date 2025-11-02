"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Wrench } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { housekeepingApi, Room } from "@/lib/api/housekeeping";

// Zod schema for form validation
const incidentReportSchema = z.object({
  room: z
    .string()
    .min(1, "Debe seleccionar una habitación")
    .refine((value) => value !== "loading" && value !== "no-rooms", {
      message: "Debe seleccionar una habitación válida",
    }),
  type: z.string().min(1, "Debe seleccionar un tipo de incidencia"),
  priority: z.string().min(1, "Debe seleccionar una prioridad"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres"),
});

type IncidentReportFormData = z.infer<typeof incidentReportSchema>;

interface IncidentReportDialogProps {
  onReportIncident: (incident: {
    room: string;
    type: string;
    priority: string;
    description: string;
  }) => void;
}

export default function IncidentReportDialog({
  onReportIncident,
}: IncidentReportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<IncidentReportFormData>({
    resolver: zodResolver(incidentReportSchema),
    defaultValues: {
      room: "",
      type: "",
      priority: "",
      description: "",
    },
  });

  // Load rooms when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadRooms();
    }
  }, [isOpen]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const availableRooms = await housekeepingApi.getRoomsForIncidentReports();
      setRooms(availableRooms);
    } catch (error) {
      console.error("Error loading rooms:", error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: IncidentReportFormData) => {
    try {
      setLoading(true);

      // Create incident report through API
      await housekeepingApi.createIncidentReport({
        roomNumber: data.room,
        type: data.type,
        priority: data.priority,
        description: data.description,
        reportedBy: "Housekeeping Staff",
      });

      // Call parent callback for UI updates
      onReportIncident(data);

      // Show success toast
      toast.success("Incidencia reportada exitosamente", {
        description: `La habitación ${data.room} ha sido marcada en mantenimiento`,
      });

      // Reset form
      form.reset();
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating incident report:", error);
      toast.error("Error al reportar la incidencia", {
        description: "Por favor, intenta nuevamente",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Wrench className="mr-2 h-4 w-4" />
          Solicitud a mantenimiento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solicitud a mantenimiento</DialogTitle>
          <DialogDescription>
            Crear un nuevo reporte de mantenimiento
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="room"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Habitación</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar habitación" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loading ? (
                          <SelectItem value="loading" disabled>
                            Cargando habitaciones...
                          </SelectItem>
                        ) : rooms.length === 0 ? (
                          <SelectItem value="no-rooms" disabled>
                            No hay habitaciones disponibles
                          </SelectItem>
                        ) : (
                          rooms.map((room) => (
                            <SelectItem key={room.number} value={room.number}>
                              Habitación {room.number} - {room.type}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Incidencia</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Plomería">Plomería</SelectItem>
                        <SelectItem value="Electricidad">
                          Electricidad
                        </SelectItem>
                        <SelectItem value="Aire Acondicionado">
                          Aire Acondicionado
                        </SelectItem>
                        <SelectItem value="Mobiliario">Mobiliario</SelectItem>
                        <SelectItem value="Electrodomésticos">
                          Electrodomésticos
                        </SelectItem>
                        <SelectItem value="Estructural">Estructural</SelectItem>
                        <SelectItem value="Estético">Estético</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridad</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar prioridad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe la incidencia..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  form.reset();
                }}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !form.formState.isValid}
              >
                {loading ? "Creando..." : "Crear Reporte"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
