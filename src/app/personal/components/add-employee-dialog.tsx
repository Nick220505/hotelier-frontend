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

const employeeSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  document: z.string().min(5, "El documento debe tener al menos 5 caracteres"),
  position: z.string().min(1, "Debe seleccionar un cargo"),
  phone: z.string().min(7, "El teléfono debe tener al menos 7 caracteres"),
  email: z.string().email("Debe ingresar un email válido"),
  salary: z.number().min(0, "El salario debe ser mayor o igual a 0"),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddEmployee: (data: EmployeeFormData) => void;
}

export function AddEmployeeDialog({
  open,
  onOpenChange,
  onAddEmployee,
}: AddEmployeeDialogProps) {
  const employeeForm = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      lastName: "",
      document: "",
      position: "",
      phone: "",
      email: "",
      salary: 0,
    },
  });

  const handleSubmit = (data: EmployeeFormData) => {
    onAddEmployee(data);
    employeeForm.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Agregar Empleado</DialogTitle>
          <DialogDescription>
            Completa los datos del nuevo empleado.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={employeeForm.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                {...employeeForm.register("name")}
                placeholder="Juan"
              />
              {employeeForm.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {employeeForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                {...employeeForm.register("lastName")}
                placeholder="Pérez"
              />
              {employeeForm.formState.errors.lastName && (
                <p className="text-sm text-red-500">
                  {employeeForm.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="document">Documento</Label>
              <Input
                id="document"
                {...employeeForm.register("document")}
                placeholder="12345678"
              />
              {employeeForm.formState.errors.document && (
                <p className="text-sm text-red-500">
                  {employeeForm.formState.errors.document.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Cargo</Label>
              <Controller
                name="position"
                control={employeeForm.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANAGER">Gerente</SelectItem>
                      <SelectItem value="RECEPTIONIST">Recepcionista</SelectItem>
                      <SelectItem value="HOUSEKEEPER">Personal de Limpieza</SelectItem>
                      <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
                      <SelectItem value="CHEF">Chef</SelectItem>
                      <SelectItem value="WAITER">Mesero</SelectItem>
                      <SelectItem value="SECURITY">Seguridad</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {employeeForm.formState.errors.position && (
                <p className="text-sm text-red-500">
                  {employeeForm.formState.errors.position.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                {...employeeForm.register("phone")}
                placeholder="+57 300 123 4567"
              />
              {employeeForm.formState.errors.phone && (
                <p className="text-sm text-red-500">
                  {employeeForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...employeeForm.register("email")}
                placeholder="empleado@hotel.com"
              />
              {employeeForm.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {employeeForm.formState.errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Salario</Label>
            <Input
              id="salary"
              type="number"
              {...employeeForm.register("salary", { valueAsNumber: true })}
              placeholder="1500000"
            />
            {employeeForm.formState.errors.salary && (
              <p className="text-sm text-red-500">
                {employeeForm.formState.errors.salary.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Agregar Empleado</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
