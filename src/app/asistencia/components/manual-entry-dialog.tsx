"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const manualEntrySchema = z.object({
  employeeId: z.number().min(1, "Debe seleccionar un empleado"),
  date: z.string().min(1, "La fecha es obligatoria"),
  clockInTime: z.string().min(1, "La hora de entrada es obligatoria"),
  clockOutTime: z.string().optional(),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EARLY_OUT", "OVERTIME"]),
  notes: z.string().optional(),
});

type ManualEntryFormData = z.infer<typeof manualEntrySchema>;

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  isActive: boolean;
}

interface ManualEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  onSubmit: (entry: {
    employeeId: number;
    date: string;
    clockInTime: string;
    clockOutTime: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "EARLY_OUT" | "OVERTIME";
    notes: string;
  }) => void;
}

export function ManualEntryDialog({
  open,
  onOpenChange,
  employees,
  onSubmit,
}: ManualEntryDialogProps) {
  const form = useForm<ManualEntryFormData>({
    resolver: zodResolver(manualEntrySchema),
    defaultValues: {
      employeeId: 0,
      date: new Date().toISOString().split("T")[0],
      clockInTime: "",
      clockOutTime: "",
      status: "PRESENT",
      notes: "",
    },
  });

  const handleFormSubmit = (data: ManualEntryFormData) => {
    onSubmit({
      ...data,
      clockOutTime: data.clockOutTime || "",
      notes: data.notes || "",
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registro Manual de Asistencia</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Empleado *</Label>
            <Controller
              name="employeeId"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value.toString()}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                >
                  <SelectTrigger
                    className={
                      form.formState.errors.employeeId ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Seleccionar empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees
                      .filter((e) => e.isActive)
                      .map((employee) => (
                        <SelectItem
                          key={employee.id}
                          value={employee.id.toString()}
                        >
                          {employee.name} - {employee.position}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.employeeId && (
              <p className="text-sm text-red-500">
                {form.formState.errors.employeeId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Fecha *</Label>
            <Input
              type="date"
              {...form.register("date")}
              className={form.formState.errors.date ? "border-red-500" : ""}
            />
            {form.formState.errors.date && (
              <p className="text-sm text-red-500">
                {form.formState.errors.date.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hora de Entrada *</Label>
              <Input
                type="time"
                {...form.register("clockInTime")}
                className={
                  form.formState.errors.clockInTime ? "border-red-500" : ""
                }
              />
              {form.formState.errors.clockInTime && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.clockInTime.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Hora de Salida</Label>
              <Input
                type="time"
                {...form.register("clockOutTime")}
                className={
                  form.formState.errors.clockOutTime ? "border-red-500" : ""
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Estado *</Label>
            <Controller
              name="status"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={
                      form.formState.errors.status ? "border-red-500" : ""
                    }
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRESENT">Presente</SelectItem>
                    <SelectItem value="ABSENT">Ausente</SelectItem>
                    <SelectItem value="LATE">Tarde</SelectItem>
                    <SelectItem value="EARLY_OUT">Salida Temprana</SelectItem>
                    <SelectItem value="OVERTIME">Tiempo Extra</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.status && (
              <p className="text-sm text-red-500">
                {form.formState.errors.status.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Notas</Label>
            <Textarea
              placeholder="Observaciones adicionales..."
              {...form.register("notes")}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                onOpenChange(false);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">Crear Registro</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
