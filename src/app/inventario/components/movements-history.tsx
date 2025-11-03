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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InventoryMovement } from "@/lib/api/inventory";

interface MovementsHistoryProps {
  movements: InventoryMovement[];
}

export function MovementsHistory({ movements }: MovementsHistoryProps) {
  const getMovementTypeBadge = (type: string) => {
    return type === "entrada" ? (
      <Badge className="bg-green-100 text-green-800">Entrada</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Salida</Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Movimientos</CardTitle>
        <CardDescription>
          Registro de entradas y salidas de inventario
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Motivo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movements.map((movement) => (
              <TableRow key={movement.id}>
                <TableCell>{movement.date}</TableCell>
                <TableCell>{getMovementTypeBadge(movement.type)}</TableCell>
                <TableCell className="font-medium">{movement.item}</TableCell>
                <TableCell>{movement.quantity}</TableCell>
                <TableCell>{movement.user}</TableCell>
                <TableCell>{movement.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
