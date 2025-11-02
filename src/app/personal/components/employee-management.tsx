"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { UserPlus } from "lucide-react";
import {
  positionTranslations,
  departmentTranslations,
  shiftTranslations,
} from "@/lib/translations/staff";

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

interface Employee {
  id: string;
  name: string;
  lastName: string;
  document: string;
  position: string;
  department: string;
  phone: string;
  email: string;
  hireDate: string;
  salary: number;
  shift: string;
  status: string;
  supervisor: string;
}

interface EmployeeManagementProps {
  employees: Employee[];
  onEmployeesChange: (employees: Employee[]) => void;
}

export default function EmployeeManagement({
  employees,
  onEmployeesChange,
}: EmployeeManagementProps) {
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

  const getEmployeeStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "activo":
      case "active":
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case "vacaciones":
      case "on_leave":
        return <Badge className="bg-blue-100 text-blue-800">Vacaciones</Badge>;
      case "incapacidad":
      case "sick_leave":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Incapacidad</Badge>
        );
      case "inactivo":
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDepartmentBadge = (department: string) => {
    const translatedDept =
      departmentTranslations[
        department.toUpperCase() as keyof typeof departmentTranslations
      ] || department;

    const colorMap: Record<string, string> = {
      Limpieza: "bg-blue-100 text-blue-800",
      Recepción: "bg-green-100 text-green-800",
      Mantenimiento: "bg-orange-100 text-orange-800",
      Seguridad: "bg-red-100 text-red-800",
      Restaurante: "bg-purple-100 text-purple-800",
      Cocina: "bg-yellow-100 text-yellow-800",
      Bar: "bg-indigo-100 text-indigo-800",
      Gerencia: "bg-gray-100 text-gray-800",
    };

    const colorClass = colorMap[translatedDept] || "bg-gray-100 text-gray-800";

    return <Badge className={colorClass}>{translatedDept}</Badge>;
  };

  const handleAddEmployee = (data: EmployeeFormData) => {
    const employee = {
      id: `EMP${String(employees.length + 1).padStart(3, "0")}`,
      name: data.name,
      lastName: data.lastName,
      document: data.document,
      position: data.position,
      department: "",
      phone: data.phone,
      email: data.email,
      hireDate: new Date().toISOString().split("T")[0],
      salary: data.salary,
      shift: "",
      status: "activo",
      supervisor: "",
    };
    onEmployeesChange([...employees, employee]);
    employeeForm.reset();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Nuevo Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nuevo Empleado</DialogTitle>
              <DialogDescription>
                Registrar un nuevo empleado en el sistema
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={employeeForm.handleSubmit(handleAddEmployee)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre</Label>
                    <Input
                      id="nombre"
                      {...employeeForm.register("name")}
                      placeholder="Nombre"
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
                      placeholder="Apellido"
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
                      placeholder="Número de documento"
                    />
                    {employeeForm.formState.errors.document && (
                      <p className="text-sm text-red-500">
                        {employeeForm.formState.errors.document.message}
                      </p>
                    )}
                  </div>
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...employeeForm.register("email")}
                    placeholder="email@hotel.com"
                  />
                  {employeeForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {employeeForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Controller
                      name="position"
                      control={employeeForm.control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cargo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cliente">Cliente</SelectItem>
                            <SelectItem value="Administrador">
                              Administrador
                            </SelectItem>
                            <SelectItem value="Personal de Limpieza">
                              Personal de Limpieza
                            </SelectItem>
                            <SelectItem value="Personal de Mantenimiento">
                              Personal de Mantenimiento
                            </SelectItem>
                            <SelectItem value="Personal de Restaurante">
                              Personal de Restaurante
                            </SelectItem>
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
                  <div className="space-y-2">
                    <Label htmlFor="salario">Salario</Label>
                    <Input
                      id="salario"
                      type="number"
                      {...employeeForm.register("salary", {
                        valueAsNumber: true,
                      })}
                      placeholder="2500000"
                    />
                    {employeeForm.formState.errors.salary && (
                      <p className="text-sm text-red-500">
                        {employeeForm.formState.errors.salary.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                  <Button type="submit">Crear Empleado</Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empleado</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Turno</TableHead>
            <TableHead>Salario</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {employee.name} {employee.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {employee.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>{employee.document}</TableCell>
              <TableCell>
                {positionTranslations[
                  employee.position as keyof typeof positionTranslations
                ] || employee.position}
              </TableCell>
              <TableCell>{getDepartmentBadge(employee.department)}</TableCell>
              <TableCell>
                {shiftTranslations[
                  employee.shift as keyof typeof shiftTranslations
                ] || employee.shift}
              </TableCell>
              <TableCell>${employee.salary.toLocaleString()}</TableCell>
              <TableCell>{getEmployeeStatusBadge(employee.status)}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
