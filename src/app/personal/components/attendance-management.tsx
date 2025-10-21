"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Attendance {
  id: string;
  employeeId: string;
  employee: string;
  date: string;
  entryTime: string;
  exitTime: string;
  regularHours: number;
  extraHours: number;
  status: string;
  notes: string;
}

interface AttendanceManagementProps {
  attendance: Attendance[];
}

export default function AttendanceManagement({
  attendance,
}: AttendanceManagementProps) {
  const getAttendanceStatusBadge = (status: string) => {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case "PRESENT":
      case "PRESENTE":
        return <Badge className="bg-green-100 text-green-800">Presente</Badge>;
      case "LATE":
      case "TARDE":
        return <Badge className="bg-yellow-100 text-yellow-800">Tarde</Badge>;
      case "ABSENT":
      case "AUSENTE":
        return <Badge className="bg-red-100 text-red-800">Ausente</Badge>;
      case "SICK_LEAVE":
      case "INCAPACIDAD":
        return <Badge className="bg-blue-100 text-blue-800">Incapacidad</Badge>;
      case "VACATION":
      case "VACACIONES":
        return (
          <Badge className="bg-purple-100 text-purple-800">Vacaciones</Badge>
        );
      case "EARLY_LEAVE":
      case "SALIDA_TEMPRANA":
        return (
          <Badge className="bg-orange-100 text-orange-800">
            Salida Temprana
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Control de Asistencia</h3>
        <p className="text-sm text-muted-foreground">
          Registro de entrada y salida de empleados
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empleado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Entrada</TableHead>
            <TableHead>Salida</TableHead>
            <TableHead>Horas Reg.</TableHead>
            <TableHead>Horas Extra</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Observaciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.employee}</TableCell>
              <TableCell>{record.date}</TableCell>
              <TableCell>{record.entryTime}</TableCell>
              <TableCell>{record.exitTime}</TableCell>
              <TableCell>{record.regularHours}h</TableCell>
              <TableCell>{record.extraHours}h</TableCell>
              <TableCell>{getAttendanceStatusBadge(record.status)}</TableCell>
              <TableCell>{record.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
