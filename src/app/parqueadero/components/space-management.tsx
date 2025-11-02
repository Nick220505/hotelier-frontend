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
import { Wrench, AlertTriangle } from "lucide-react";
import { ParkingSpace } from "@/lib/api/parking";
import { useAuthContext } from "@/contexts/auth-context";

interface SpaceManagementProps {
  spaces: ParkingSpace[];
  onSpaceMaintenance: (spaceId: string) => void;
  onSpaceEnable: (spaceId: string) => void;
}

export default function SpaceManagement({
  spaces,
  onSpaceMaintenance,
  onSpaceEnable,
}: SpaceManagementProps) {
  const { hasRole } = useAuthContext();
  const getSpaceStatusBadge = (status: string) => {
    switch (status) {
      case "disponible":
        return (
          <Badge className="bg-green-100 text-green-800">Disponible</Badge>
        );
      case "ocupado":
        return <Badge className="bg-red-100 text-red-800">Ocupado</Badge>;
      case "reservado":
        return <Badge className="bg-blue-100 text-blue-800">Reservado</Badge>;
      case "mantenimiento":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Mantenimiento</Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa de Espacios</CardTitle>
        <CardDescription>
          Estado actual de los espacios de parqueadero
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Zona</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Vehículo Actual</TableHead>
              <TableHead>Estado</TableHead>
              {!hasRole("cliente") && <TableHead>Acciones</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {spaces.map((space) => (
              <TableRow key={space.id}>
                <TableCell className="font-medium">{space.code}</TableCell>
                <TableCell>{space.zone}</TableCell>
                <TableCell>
                  <Badge variant="outline">{space.type}</Badge>
                </TableCell>
                <TableCell>{space.location}</TableCell>
                <TableCell>
                  {space.currentVehicle ? (
                    <div className="font-medium">{space.currentVehicle}</div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>{getSpaceStatusBadge(space.status)}</TableCell>
                {!hasRole("cliente") && (
                  <TableCell>
                    <div className="flex space-x-2">
                      {space.status === "mantenimiento" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSpaceEnable(space.id)}
                        >
                          <Wrench className="mr-2 h-4 w-4" />
                          Habilitar
                        </Button>
                      )}
                      {space.status === "disponible" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSpaceMaintenance(space.id)}
                        >
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Mantenimiento
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
