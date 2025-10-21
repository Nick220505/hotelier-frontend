"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SalesTableProps {
  sales: Array<{
    date: string;
    roomService: number;
    restaurante: number;
    bar: number;
    total: number;
    orders: number;
  }>;
}

export function SalesTable({ sales }: SalesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reporte de Ventas</CardTitle>
        <CardDescription>Análisis de ventas por área y período</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Room Service</TableHead>
              <TableHead>Restaurante</TableHead>
              <TableHead>Bar</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Pedidos</TableHead>
              <TableHead>Promedio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{sale.date}</TableCell>
                <TableCell>${sale.roomService.toLocaleString()}</TableCell>
                <TableCell>${sale.restaurante.toLocaleString()}</TableCell>
                <TableCell>${sale.bar.toLocaleString()}</TableCell>
                <TableCell className="font-bold">
                  ${sale.total.toLocaleString()}
                </TableCell>
                <TableCell>{sale.orders}</TableCell>
                <TableCell>
                  ${Math.round(sale.total / sale.orders).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
