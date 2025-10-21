"use client";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Truck } from "lucide-react";
import { InventoryItem } from "@/lib/types";
import {
  inventoryCategoryTranslations,
  inventoryStatusTranslations,
  unitTranslations,
} from "@/lib/translations/inventory";

interface InventoryTableProps {
  items: InventoryItem[];
  onReorder: (itemId: string) => void;
}

export function InventoryTable({ items, onReorder }: InventoryTableProps) {
  const getStockBadge = (status: string) => {
    const translatedStatus =
      inventoryStatusTranslations[
        status.toUpperCase() as keyof typeof inventoryStatusTranslations
      ] || status;

    switch (status.toLowerCase()) {
      case "available":
      case "disponible":
        return (
          <Badge className="bg-green-100 text-green-800">Disponible</Badge>
        );
      case "low_stock":
      case "bajo_stock":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Bajo Stock</Badge>
        );
      case "out_of_stock":
      case "critico":
      case "agotado":
        return <Badge className="bg-red-100 text-red-800">Agotado</Badge>;
      default:
        return <Badge variant="outline">{translatedStatus}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Inventario</CardTitle>
        <CardDescription>{items.length} productos encontrados</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Min/Max</TableHead>
              <TableHead>Costo Unit.</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.location}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {inventoryCategoryTranslations[
                      item.category as keyof typeof inventoryCategoryTranslations
                    ] || item.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {item.currentStock}{" "}
                      {unitTranslations[
                        item.unit as keyof typeof unitTranslations
                      ] || item.unit}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${
                          item.currentStock <= item.minimumStock
                            ? "bg-red-600"
                            : item.currentStock <= item.minimumStock * 1.5
                              ? "bg-yellow-600"
                              : "bg-green-600"
                        }`}
                        style={{
                          width: `${Math.min(
                            (item.currentStock / item.maximumStock) * 100,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>Min: {item.minimumStock}</div>
                    <div>Max: {item.maximumStock}</div>
                  </div>
                </TableCell>
                <TableCell>${item.unitCost.toLocaleString()}</TableCell>
                <TableCell>
                  ${(item.currentStock * item.unitCost).toLocaleString()}
                </TableCell>
                <TableCell>{getStockBadge(item.status)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {(item.status === "bajo_stock" ||
                      item.status === "critico" ||
                      item.status === "agotado") && (
                      <Button size="sm" onClick={() => onReorder(item.id)}>
                        <Truck className="mr-2 h-4 w-4" />
                        Reponer
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
