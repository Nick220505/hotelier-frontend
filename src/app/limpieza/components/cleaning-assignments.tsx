"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Play, CheckCircle } from "lucide-react";

export interface CleaningAssignment {
  id: string;
  employeeName: string;
  roomNumber: string;
  assignedDate: string;
  startedAt?: string;
  completedAt?: string;
  status: string;
  notes?: string;
  qualityScore?: number;
}

interface CleaningAssignmentsProps {
  assignments: CleaningAssignment[];
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
}

export default function CleaningAssignments({
  assignments,
  onStart,
  onComplete,
}: CleaningAssignmentsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pendiente":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case "en_proceso":
        return <Badge className="bg-blue-100 text-blue-800">En Proceso</Badge>;
      case "completado":
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>;
      case "inspeccionado":
        return <Badge className="bg-purple-100 text-purple-800">Inspeccionado</Badge>;
      case "necesita_mantenimiento":
        return (
          <Badge className="bg-orange-100 text-orange-800">Mantenimiento</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asignaciones de Limpieza</CardTitle>
        <CardDescription>Gestión de tareas de limpieza del día</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Habitación</TableHead>
              <TableHead>Empleado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.id}</TableCell>
                <TableCell>{a.roomNumber}</TableCell>
                <TableCell>{a.employeeName}</TableCell>
                <TableCell>{a.assignedDate}</TableCell>
                <TableCell>{getStatusBadge(a.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {a.status === "pendiente" && (
                      <Button variant="outline" size="sm" onClick={() => onStart(a.id)}>
                        <Play className="mr-2 h-4 w-4" /> Iniciar
                      </Button>
                    )}
                    {a.status === "en_proceso" && (
                      <Button size="sm" onClick={() => onComplete(a.id)}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Completar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
