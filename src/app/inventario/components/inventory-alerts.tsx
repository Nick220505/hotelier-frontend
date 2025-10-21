"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Truck } from "lucide-react";
import { InventoryItem } from "@/lib/api/inventory";
import { unitTranslations } from "@/lib/translations/inventory";

interface InventoryAlertsProps {
  items: InventoryItem[];
  onReorder: (itemId: string) => void;
}

export function InventoryAlerts({ items, onReorder }: InventoryAlertsProps) {
  const alertItems = items.filter(
    (item) =>
      item.status === "bajo_stock" ||
      item.status === "critico" ||
      item.status === "agotado",
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas de Inventario</CardTitle>
        <CardDescription>
          Items que requieren atención inmediata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alertItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <AlertTriangle
                  className={`h-5 w-5 ${
                    item.status === "agotado"
                      ? "text-red-600"
                      : item.status === "critico"
                        ? "text-red-500"
                        : "text-yellow-500"
                  }`}
                />
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Stock actual: {item.currentStock}{" "}
                    {unitTranslations[
                      item.unit as keyof typeof unitTranslations
                    ] || item.unit}
                  </div>
                </div>
              </div>
              <Button size="sm" onClick={() => onReorder(item.id)}>
                <Truck className="mr-2 h-4 w-4" />
                Reponer
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
