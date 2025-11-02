"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, Plus } from "lucide-react";
import { BeverageInventoryItem } from "@/lib/api/restaurant";
import { RestockDialog } from "./restock-dialog";

interface InventoryTableProps {
  items: BeverageInventoryItem[];
  onRestock: (itemId: string, newStock: number) => void;
  onRefresh?: () => void;
}

export function InventoryTable({
  items,
  /* onRestock, */ onRefresh,
}: InventoryTableProps) {
  const [selectedItem, setSelectedItem] = useState<
    BeverageInventoryItem | undefined
  >();
  const [restockDialogOpen, setRestockDialogOpen] = useState(false);

  const handleRestockClick = (item: BeverageInventoryItem) => {
    setSelectedItem(item);
    setRestockDialogOpen(true);
  };

  const handleRestockSuccess = () => {
    onRefresh?.();
  };

  const getStatusBadge = (item: BeverageInventoryItem) => {
    switch (item.status) {
      case "available":
        return <Badge variant="default">Disponible</Badge>;
      case "low_stock":
        return <Badge variant="secondary">Stock Bajo</Badge>;
      case "agotado":
        return <Badge variant="destructive">Agotado</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Inventario de Bebidas y Alimentos</CardTitle>
          <CardDescription>Control de stock y reposición</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Mínimo</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Costo/Unidad</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      {item.stock}
                      {item.stock <= item.minimumStock && (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.minimumStock}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>${item.unitCost}</TableCell>
                  <TableCell>{item.supplier}</TableCell>
                  <TableCell>{getStatusBadge(item)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestockClick(item)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Reabastecer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {items.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No hay items de inventario disponibles
            </div>
          )}
        </CardContent>
      </Card>

      <RestockDialog
        open={restockDialogOpen}
        onOpenChange={setRestockDialogOpen}
        item={selectedItem}
        onSuccess={handleRestockSuccess}
      />
    </>
  );
}
