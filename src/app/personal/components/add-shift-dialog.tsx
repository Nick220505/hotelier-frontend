import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const shiftSchema = z.object({
  employeeId: z.string().min(1, "Debe seleccionar un empleado"),
  date: z.string().min(1, "La fecha es requerida"),
  type: z.string().min(1, "Debe seleccionar un tipo de turno"),
  startTime: z.string().min(1, "La hora de inicio es requerida"),
  endTime: z.string().min(1, "La hora de fin es requerida"),
});

type ShiftFormData = z.infer<typeof shiftSchema>;

interface Employee {
  id: string;
  name: string;
  lastName: string;
  position: string;
  department: string;
}

interface AddShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  onAddShift: (data: ShiftFormData) => void;
}

export function AddShiftDialog({
  open,
  onOpenChange,
  employees,
  onAddShift,
}: AddShiftDialogProps) {
  const shiftForm = useForm<ShiftFormData>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      employeeId: "",
      date: "",
      type: "",
      startTime: "",
      endTime: "",
    },
  });

  const handleSubmit = (data: ShiftFormData) => {
    onAddShift(data);
    shiftForm.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Turno</DialogTitle>
          <DialogDescription>
            Completa los datos para programar un nuevo turno.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={shiftForm.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="employeeId">Empleado</Label>
            <Controller
              name="employeeId"
              control={shiftForm.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.name} {emp.lastName} - {emp.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {shiftForm.formState.errors.employeeId && (
              <p className="text-sm text-red-500">
                {shiftForm.formState.errors.employeeId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Controller
              name="date"
              control={shiftForm.control}
              render={({ field }) => <Input type="date" {...field} />}
            />
            {shiftForm.formState.errors.date && (
              <p className="text-sm text-red-500">
                {shiftForm.formState.errors.date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Turno</Label>
            <Controller
              name="type"
              control={shiftForm.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MORNING">Mañana</SelectItem>
                    <SelectItem value="EVENING">Tarde</SelectItem>
                    <SelectItem value="NIGHT">Noche</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {shiftForm.formState.errors.type && (
              <p className="text-sm text-red-500">
                {shiftForm.formState.errors.type.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Hora de Inicio</Label>
              <Controller
                name="startTime"
                control={shiftForm.control}
                render={({ field }) => <Input type="time" {...field} />}
              />
              {shiftForm.formState.errors.startTime && (
                <p className="text-sm text-red-500">
                  {shiftForm.formState.errors.startTime.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Hora de Fin</Label>
              <Controller
                name="endTime"
                control={shiftForm.control}
                render={({ field }) => <Input type="time" {...field} />}
              />
              {shiftForm.formState.errors.endTime && (
                <p className="text-sm text-red-500">
                  {shiftForm.formState.errors.endTime.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Agregar Turno</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
