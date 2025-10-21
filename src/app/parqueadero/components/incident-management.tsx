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
import { CheckCircle } from "lucide-react";
import { ParkingIncident } from "@/lib/api/parking";

interface IncidentManagementProps {
  incidents: ParkingIncident[];
  onAssignIncident: (incidentId: string) => void;
  onResolveIncident: (incidentId: string) => void;
}

export default function IncidentManagement({
  incidents,
  onAssignIncident,
  onResolveIncident,
}: IncidentManagementProps) {
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

  const getIncidentStatusBadge = (status: string) => {
    switch (status) {
      case "pendiente":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
        );
      case "en_proceso":
        return <Badge className="bg-blue-100 text-blue-800">En Proceso</Badge>;
      case "resuelto":
        return <Badge className="bg-green-100 text-green-800">Resuelto</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incidencias Reportadas</CardTitle>
        <CardDescription>Gestión de incidencias y problemas</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Vehículo/Espacio</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell>
                  <Badge variant="outline">{incident.type}</Badge>
                </TableCell>
                <TableCell>{incident.description}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {incident.vehicle && <div>Veh: {incident.vehicle}</div>}
                    {incident.space && <div>Esp: {incident.space}</div>}
                  </div>
                </TableCell>
                <TableCell>{incident.reportDate}</TableCell>
                <TableCell>{incident.responsible}</TableCell>
                <TableCell>{getPriorityBadge(incident.priority)}</TableCell>
                <TableCell>{getIncidentStatusBadge(incident.status)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {incident.status === "pendiente" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAssignIncident(incident.id)}
                      >
                        Asignar
                      </Button>
                    )}
                    {incident.status === "en_proceso" && (
                      <Button
                        size="sm"
                        onClick={() => onResolveIncident(incident.id)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Resolver
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
