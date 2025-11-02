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
  shiftStatusTranslations,
  departmentTranslations,
} from "@/lib/translations/staff";

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
  type: string;
  startTime: string;
  endTime: string;
  department: string;
  status: string;
}

interface ShiftsTableProps {
  shifts: Shift[];
}

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
        <Badge className="bg-blue-100 text-blue-800">{translatedStatus}</Badge>
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
        <Badge className="bg-green-100 text-green-800">{translatedDept}</Badge>
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

export function ShiftsTable({ shifts }: ShiftsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empleado</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Tipo de Turno</TableHead>
            <TableHead>Horario</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shifts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No hay turnos programados
              </TableCell>
            </TableRow>
          ) : (
            shifts.map((shift) => (
              <TableRow key={shift.id}>
                <TableCell className="font-medium">
                  {shift.employee.name}
                  <div className="text-sm text-muted-foreground">
                    {shift.employee.position}
                  </div>
                </TableCell>
                <TableCell>
                  {getDepartmentBadge(shift.employee.department)}
                </TableCell>
                <TableCell>
                  {new Date(shift.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{getShiftTypeLabel(shift.type)}</TableCell>
                <TableCell>
                  {shift.startTime} - {shift.endTime}
                </TableCell>
                <TableCell>{getShiftStatusBadge(shift.status)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
