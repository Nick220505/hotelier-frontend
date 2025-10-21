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
import { Bed } from "lucide-react";

interface Room {
  id: string;
  number: string;
  type: string;
  available: boolean;
  status: string;
  lastCleaning?: string;
  nextGuest?: string;
  assignedEmployee?: string;
}

interface RoomStatusManagementProps {
  rooms: Room[];
  onStartCleaning: (roomNumber: string) => void;
}

export default function RoomStatusManagement({
  rooms,
  onStartCleaning,
}: RoomStatusManagementProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "limpia":
        return <Badge className="bg-green-100 text-green-800">Limpia</Badge>;
      case "sucia":
        return <Badge className="bg-red-100 text-red-800">Sucia</Badge>;
      case "en_limpieza":
        return <Badge className="bg-blue-100 text-blue-800">En Limpieza</Badge>;
      case "mantenimiento":
        return (
          <Badge className="bg-orange-100 text-orange-800">Mantenimiento</Badge>
        );
      case "ocupada":
        return <Badge className="bg-purple-100 text-purple-800">Ocupada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de Habitaciones</CardTitle>
        <CardDescription>
          Control en tiempo real del estado de limpieza
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Habitación</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Última Limpieza</TableHead>
              <TableHead>Próximo Huésped</TableHead>
              <TableHead>Empleado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.number}>
                <TableCell className="font-medium">{room.number}</TableCell>
                <TableCell>{room.type}</TableCell>
                <TableCell>
                  {getStatusBadge(room.available ? "limpia" : "ocupada")}
                </TableCell>
                <TableCell>{room.lastCleaning || "Hoy 14:00"}</TableCell>
                <TableCell>{room.nextGuest || "-"}</TableCell>
                <TableCell>{room.assignedEmployee || "No asignado"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {!room.available && (
                      <Button
                        size="sm"
                        onClick={() => onStartCleaning(room.number)}
                      >
                        <Bed className="mr-2 h-4 w-4" />
                        Iniciar Limpieza
                      </Button>
                    )}
                    {room.available && (
                      <Badge className="bg-green-100 text-green-800">
                        Lista
                      </Badge>
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
