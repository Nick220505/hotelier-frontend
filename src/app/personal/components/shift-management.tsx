"use client";

import { useState } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarDays, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  shiftStatusTranslations,
  departmentTranslations,
} from "@/lib/translations/staff";

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

interface Shift {
  id: string;
  employeeId: string;
  employee: {
    id: number;
    employeeId: string;
    name: string;
    department: string;
    position: string;
    shift: string;
    status: string;
  };
  date: string;
  type: string; // This is the shift type from backend (MORNING, EVENING, NIGHT)
  startTime: string;
  endTime: string;
  department: string;
  status: string;
}

interface ShiftManagementProps {
  shifts: Shift[];
  employees: Employee[];
  onShiftsChange: (shifts: Shift[]) => void;
}

export default function ShiftManagement({
  shifts,
  employees,
  onShiftsChange,
}: ShiftManagementProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();

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

  const getShiftTypeLabel = (type: string) => {
    const normalizedType = type.toUpperCase();
    switch (normalizedType) {
      case "MORNING":
        return "Mañana";
      case "EVENING":
        return "Tarde";
      case "NIGHT":
        return "Noche";
      default:
        return type;
    }
  };

  const getShiftStatusBadge = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    const translatedStatus =
      shiftStatusTranslations[
        normalizedStatus as keyof typeof shiftStatusTranslations
      ] || status;

    switch (normalizedStatus) {
      case "SCHEDULED":
      case "PROGRAMADO":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            {translatedStatus}
          </Badge>
        );
      case "ACTIVE":
      case "EN_CURSO":
        return (
          <Badge className="bg-green-100 text-green-800">
            {translatedStatus}
          </Badge>
        );
      case "COMPLETED":
      case "COMPLETADO":
        return (
          <Badge className="bg-emerald-100 text-emerald-800">
            {translatedStatus}
          </Badge>
        );
      case "CANCELLED":
      case "CANCELADO":
        return (
          <Badge className="bg-red-100 text-red-800">{translatedStatus}</Badge>
        );
      case "NO_SHOW":
      case "AUSENTE":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            {translatedStatus}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{translatedStatus}</Badge>;
    }
  };

  const getDepartmentBadge = (department: string) => {
    const normalizedDept = department.toUpperCase();
    const translatedDept =
      departmentTranslations[
        normalizedDept as keyof typeof departmentTranslations
      ] || department;

    switch (department.toLowerCase()) {
      case "limpieza":
      case "housekeeping":
        return (
          <Badge className="bg-blue-100 text-blue-800">{translatedDept}</Badge>
        );
      case "recepción":
      case "front_desk":
        return (
          <Badge className="bg-green-100 text-green-800">
            {translatedDept}
          </Badge>
        );
      case "mantenimiento":
      case "maintenance":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            {translatedDept}
          </Badge>
        );
      case "seguridad":
      case "security":
        return (
          <Badge className="bg-red-100 text-red-800">{translatedDept}</Badge>
        );
      case "restaurante":
      case "restaurant":
        return (
          <Badge className="bg-purple-100 text-purple-800">
            {translatedDept}
          </Badge>
        );
      case "administración":
      case "management":
        return (
          <Badge className="bg-gray-100 text-gray-800">{translatedDept}</Badge>
        );
      default:
        return <Badge variant="outline">{translatedDept}</Badge>;
    }
  };

  const handleAddShift = (data: ShiftFormData) => {
    const employee = employees.find((emp) => emp.id === data.employeeId);
    const shift = {
      id: `T${String(shifts.length + 1).padStart(3, "0")}`,
      employeeId: data.employeeId,
      employee: employee
        ? {
            id: parseInt(employee.id),
            employeeId: employee.id,
            name: `${employee.name} ${employee.lastName}`,
            department: employee.department || "",
            position: employee.position || "",
            shift: employee.shift || "",
            status: "ACTIVE",
          }
        : {
            id: 0,
            employeeId: "",
            name: "",
            department: "",
            position: "",
            shift: "",
            status: "ACTIVE",
          },
      date: data.date,
      type: data.type,
      startTime: data.startTime,
      endTime: data.endTime,
      department: "",
      status: "programado",
    };
    onShiftsChange([...shifts, shift]);
    shiftForm.reset();
    setSelectedDate(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <CalendarDays className="mr-2 h-4 w-4" />
              Programar Turno
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Programar Turno</DialogTitle>
              <DialogDescription>Asignar turno a un empleado</DialogDescription>
            </DialogHeader>
            <form onSubmit={shiftForm.handleSubmit(handleAddShift)}>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="employee">Empleado</Label>
                  <Controller
                    name="employeeId"
                    control={shiftForm.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar empleado" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name} {employee.lastName} -{" "}
                              {employee.position}
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fecha</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-transparent"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate
                            ? format(selectedDate, "PPP", { locale: es })
                            : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            shiftForm.setValue(
                              "date",
                              date ? date.toISOString().split("T")[0] : "",
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {shiftForm.formState.errors.date && (
                      <p className="text-sm text-red-500">
                        {shiftForm.formState.errors.date.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="turno">Turno</Label>
                    <Controller
                      name="type"
                      control={shiftForm.control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar turno" />
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
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="horaInicio">Hora Inicio</Label>
                    <Input
                      id="horaInicio"
                      type="time"
                      {...shiftForm.register("startTime")}
                    />
                    {shiftForm.formState.errors.startTime && (
                      <p className="text-sm text-red-500">
                        {shiftForm.formState.errors.startTime.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horaFin">Hora Fin</Label>
                    <Input
                      id="horaFin"
                      type="time"
                      {...shiftForm.register("endTime")}
                    />
                    {shiftForm.formState.errors.endTime && (
                      <p className="text-sm text-red-500">
                        {shiftForm.formState.errors.endTime.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                  <Button type="submit">Programar Turno</Button>
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
            <TableHead>Fecha</TableHead>
            <TableHead>Turno</TableHead>
            <TableHead>Horario</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shifts.map((shift) => (
            <TableRow key={shift.id}>
              <TableCell className="font-medium">
                {shift.employee.name}
              </TableCell>
              <TableCell>{shift.date}</TableCell>
              <TableCell>{getShiftTypeLabel(shift.type)}</TableCell>
              <TableCell>
                {shift.startTime} - {shift.endTime}
              </TableCell>
              <TableCell>{getDepartmentBadge(shift.department)}</TableCell>
              <TableCell>{getShiftStatusBadge(shift.status)}</TableCell>
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
