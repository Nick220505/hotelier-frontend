"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { CheckCircle, Clock } from "lucide-react";

interface MaintenanceReport {
  id: string;
  room: string;
  type: string;
  description: string;
  priority: string;
  status: string;
  assignedTechnician?: string;
  estimatedTime?: string;
}

interface MaintenanceManagementProps {
  maintenanceReports: MaintenanceReport[];
  onStartMaintenance: (reportId: string) => void;
  onCompleteMaintenance: (reportId: string) => void;
}

export default function MaintenanceManagement({
  maintenanceReports,
  onStartMaintenance,
  onCompleteMaintenance,
}: MaintenanceManagementProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "alta":
        return <Badge variant="destructive">Alta</Badge>;
      case "media":
        return <Badge className="bg-yellow-100 text-yellow-800">Media</Badge>;
      case "baja":
        return <Badge variant="secondary">Baja</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getMaintenanceStatusBadge = (status: string) => {
    switch (status) {
      case "pendiente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
        );
      case "en_proceso":
        return <Badge className="bg-blue-100 text-blue-800">En Proceso</Badge>;
      case "completado":
        return (
          <Badge className="bg-green-100 text-green-800">Completado</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reportes de Mantenimiento</CardTitle>
        <CardDescription>Gestión de incidencias y reparaciones</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Habitación</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Técnico</TableHead>
              <TableHead>Tiempo Est.</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenanceReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.id}</TableCell>
                <TableCell>{report.room}</TableCell>
                <TableCell>{report.type}</TableCell>
                <TableCell>{report.description}</TableCell>
                <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                <TableCell>
                  {getMaintenanceStatusBadge(report.status)}
                </TableCell>
                <TableCell>
                  {report.assignedTechnician || "No asignado"}
                </TableCell>
                <TableCell>{report.estimatedTime || "No estimado"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {report.status === "pendiente" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onStartMaintenance(report.id)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Iniciar
                      </Button>
                    )}
                    {report.status === "en_proceso" && (
                      <Button
                        size="sm"
                        onClick={() => onCompleteMaintenance(report.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Completar
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
