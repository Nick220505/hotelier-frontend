"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { shiftsApi, type Shift } from "@/lib/api/shifts";
import { type Employee } from "@/lib/api/employees";

const createShiftSchema = z.object({
  employeeId: z
    .string({ message: "El empleado es obligatorio" })
    .min(1, "Selecciona un empleado"),
  date: z
    .string({ message: "La fecha es obligatoria" })
    .min(1, "Selecciona una fecha")
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, "La fecha no puede ser anterior a hoy"),
  type: z
    .enum(["REGULAR", "OVERTIME", "HOLIDAY"], {
      message: "Selecciona un tipo de turno válido",
    }),
  startTime: z
    .string({ message: "La hora de inicio es obligatoria" })
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido"),
  endTime: z
    .string({ message: "La hora de fin es obligatoria" })
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido"),
  position: z
    .enum(["RECEPTION", "HOUSEKEEPING", "RESTAURANT", "MAINTENANCE", "SECURITY"], {
      message: "Selecciona una posición válida",
    }),
}).refine((data) => {
  const start = new Date(`1970-01-01T${data.startTime}:00`);
  const end = new Date(`1970-01-01T${data.endTime}:00`);
  return end > start;
}, {
  message: "La hora de fin debe ser posterior a la hora de inicio",
  path: ["endTime"],
});

type CreateShiftFormData = z.infer<typeof createShiftSchema>;

interface CreateShiftDialogProps {
  employees: Employee[];
  onShiftCreated: (shift: Shift) => void;
}

export function CreateShiftDialog({ employees, onShiftCreated }: CreateShiftDialogProps) {
  const [loading, setLoading] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  
  const form = useForm<CreateShiftFormData>({
    resolver: zodResolver(createShiftSchema),
    defaultValues: {
      employeeId: "",
      date: new Date().toISOString().split('T')[0],
      type: "REGULAR",
      startTime: "08:00",
      endTime: "16:00",
      position: "RECEPTION"
    },
  });

  const onSubmit = async (data: CreateShiftFormData) => {
    try {
      setLoading(true);
      const shiftToCreate = {
        employeeId: parseInt(data.employeeId),
        date: data.date,
        type: data.type as Shift['type'],
        startTime: data.startTime,
        endTime: data.endTime,
        position: data.position,
        department: data.position, // Use position as department for now
        status: "SCHEDULED" as const,
      };

      const createdShift = await shiftsApi.create(shiftToCreate);
      onShiftCreated(createdShift);
      
      form.reset();
      setOpenCreateDialog(false);
      toast.success("Turno creado exitosamente");
    } catch (error) {
      console.error("Error creating shift:", error);
      toast.error("Error al crear el turno");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Turno
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Turno</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">Empleado</Label>
            <Select
              value={form.watch("employeeId")}
              onValueChange={(value) => form.setValue("employeeId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar empleado" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id.toString()}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.employeeId && (
              <p className="text-sm text-red-500">{form.formState.errors.employeeId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              {...form.register("date")}
              disabled={form.formState.isSubmitting}
              className={form.formState.errors.date ? "border-red-500" : ""}
            />
            {form.formState.errors.date && (
              <p className="text-sm text-red-500">{form.formState.errors.date.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Hora Inicio</Label>
              <Input
                id="startTime"
                type="time"
                {...form.register("startTime")}
                disabled={form.formState.isSubmitting}
                className={form.formState.errors.startTime ? "border-red-500" : ""}
              />
              {form.formState.errors.startTime && (
                <p className="text-sm text-red-500">{form.formState.errors.startTime.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Hora Fin</Label>
              <Input
                id="endTime"
                type="time"
                {...form.register("endTime")}
                disabled={form.formState.isSubmitting}
                className={form.formState.errors.endTime ? "border-red-500" : ""}
              />
              {form.formState.errors.endTime && (
                <p className="text-sm text-red-500">{form.formState.errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Posición</Label>
            <Select
              value={form.watch("position")}
              onValueChange={(value) => form.setValue("position", value as "RECEPTION" | "HOUSEKEEPING" | "RESTAURANT" | "MAINTENANCE" | "SECURITY")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RECEPTION">Recepción</SelectItem>
                <SelectItem value="HOUSEKEEPING">Limpieza</SelectItem>
                <SelectItem value="RESTAURANT">Restaurante</SelectItem>
                <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
                <SelectItem value="SECURITY">Seguridad</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.position && (
              <p className="text-sm text-red-500">{form.formState.errors.position.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenCreateDialog(false)}
              className="flex-1"
              disabled={loading || form.formState.isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="flex-1"
              disabled={loading || form.formState.isSubmitting}
            >
              {(loading || form.formState.isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Turno
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
