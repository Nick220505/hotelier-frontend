"use client";

import { useState } from "react";
import { InventoryItem, InventoryMovement, Supplier } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Truck } from "lucide-react";
import { InventoryFilters } from "./inventory-filters";
import { InventoryTable } from "./inventory-table";
import { MovementsHistory } from "./movements-history";
import { SuppliersList } from "./suppliers-list";
import { InventoryAlerts } from "./inventory-alerts";

interface InventoryProps {
  initialItems: InventoryItem[];
  initialMovements: InventoryMovement[];
  initialSuppliers: Supplier[];
}

export function Inventory({
  initialItems,
  initialMovements,
  initialSuppliers,
}: InventoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [inventoryItems, setInventoryItems] =
    useState<InventoryItem[]>(initialItems);
  const [movements, setMovements] =
    useState<InventoryMovement[]>(initialMovements);
  const [suppliers] = useState<Supplier[]>(initialSuppliers);

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    minimumStock: "",
    maximumStock: "",
    unit: "",
    unitCost: "",
    supplier: "",
    location: "",
  });

  const [newMovement, setNewMovement] = useState({
    type: "",
    item: "",
    quantity: "",
    reason: "",
  });

  const filteredItems = inventoryItems.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    if (newItem.name && newItem.category) {
      const item = {
        id: `INV${String(inventoryItems.length + 1).padStart(3, "0")}`,
        name: newItem.name,
        category: newItem.category,
        currentStock: 0,
        minimumStock: Number.parseInt(newItem.minimumStock) || 0,
        maximumStock: Number.parseInt(newItem.maximumStock) || 0,
        unit: newItem.unit,
        unitCost: Number.parseInt(newItem.unitCost) || 0,
        totalValue: 0,
        supplier: newItem.supplier,
        location: newItem.location,
        lastPurchaseDate: new Date().toISOString().split("T")[0],
        status: "agotado" as const,
      };
      setInventoryItems([...inventoryItems, item]);
      setNewItem({
        name: "",
        category: "",
        minimumStock: "",
        maximumStock: "",
        unit: "",
        unitCost: "",
        supplier: "",
        location: "",
      });
    }
  };

  const handleAddMovement = () => {
    if (newMovement.type && newMovement.item && newMovement.quantity) {
      const movement = {
        id: `MOV${String(movements.length + 1).padStart(3, "0")}`,
        type: newMovement.type as "entrada" | "salida",
        item: newMovement.item,
        quantity: Number.parseInt(newMovement.quantity),
        date: new Date().toISOString().split("T")[0],
        user: "Usuario Actual",
        reason: newMovement.reason,
      };
      setMovements([movement, ...movements]);

      setInventoryItems(
        inventoryItems.map((item) => {
          if (item.name === newMovement.item) {
            const newStock =
              newMovement.type === "entrada"
                ? item.currentStock + Number.parseInt(newMovement.quantity)
                : item.currentStock - Number.parseInt(newMovement.quantity);

            let newStatus: "disponible" | "bajo_stock" | "critico" | "agotado" =
              "disponible";
            if (newStock <= 0) newStatus = "agotado";
            else if (newStock <= item.minimumStock) newStatus = "bajo_stock";
            else if (newStock <= item.minimumStock * 1.5) newStatus = "critico";

            return {
              ...item,
              currentStock: Math.max(0, newStock),
              status: newStatus,
            };
          }
          return item;
        }),
      );

      setNewMovement({
        type: "",
        item: "",
        quantity: "",
        reason: "",
      });
    }
  };

  const handleReorder = (itemId: string) => {
    const item = inventoryItems.find((i) => i.id === itemId);
    if (item) {
      const reorderQuantity = item.maximumStock - item.currentStock;
      const movement = {
        id: `MOV${String(movements.length + 1).padStart(3, "0")}`,
        type: "entrada" as const,
        item: item.name,
        quantity: reorderQuantity,
        date: new Date().toISOString().split("T")[0],
        user: "Sistema Automático",
        reason: "Reposición automática",
      };
      setMovements([movement, ...movements]);

      setInventoryItems(
        inventoryItems.map((i) =>
          i.id === itemId
            ? {
                ...i,
                currentStock: i.maximumStock,
                status: "disponible" as const,
              }
            : i,
        ),
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Inventario</h1>
          <p className="text-muted-foreground">
            Control de insumos, productos y proveedores
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Truck className="mr-2 h-4 w-4" />
                Nuevo Movimiento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Movimiento</DialogTitle>
                <DialogDescription>
                  Registrar entrada o salida de inventario
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Movimiento</Label>
                    <Select
                      value={newMovement.type}
                      onValueChange={(value) =>
                        setNewMovement({ ...newMovement, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entrada">Entrada</SelectItem>
                        <SelectItem value="salida">Salida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item">Item</Label>
                    <Select
                      value={newMovement.item}
                      onValueChange={(value) =>
                        setNewMovement({ ...newMovement, item: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar item" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryItems.map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cantidad">Cantidad</Label>
                    <Input
                      id="cantidad"
                      type="number"
                      value={newMovement.quantity}
                      onChange={(e) =>
                        setNewMovement({
                          ...newMovement,
                          quantity: e.target.value,
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo</Label>
                  <Textarea
                    id="motivo"
                    value={newMovement.reason}
                    onChange={(e) =>
                      setNewMovement({ ...newMovement, reason: e.target.value })
                    }
                    placeholder="Motivo del movimiento..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button onClick={handleAddMovement}>
                    Registrar Movimiento
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nuevo Item de Inventario</DialogTitle>
                <DialogDescription>
                  Agregar un nuevo producto al inventario
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del Producto</Label>
                    <Input
                      id="nombre"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      placeholder="Nombre del producto"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                      value={newItem.category}
                      onValueChange={(value) =>
                        setNewItem({ ...newItem, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Lencería">Lencería</SelectItem>
                        <SelectItem value="Amenities">Amenities</SelectItem>
                        <SelectItem value="Limpieza">Limpieza</SelectItem>
                        <SelectItem value="Mantenimiento">
                          Mantenimiento
                        </SelectItem>
                        <SelectItem value="Oficina">Oficina</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stockMinimo">Stock Mínimo</Label>
                    <Input
                      id="stockMinimo"
                      type="number"
                      value={newItem.minimumStock}
                      onChange={(e) =>
                        setNewItem({ ...newItem, minimumStock: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stockMaximo">Stock Máximo</Label>
                    <Input
                      id="stockMaximo"
                      type="number"
                      value={newItem.maximumStock}
                      onChange={(e) =>
                        setNewItem({ ...newItem, maximumStock: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unidad">Unidad</Label>
                    <Input
                      id="unidad"
                      value={newItem.unit}
                      onChange={(e) =>
                        setNewItem({ ...newItem, unit: e.target.value })
                      }
                      placeholder="unidades, litros, kg..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="costoUnitario">Costo Unitario</Label>
                    <Input
                      id="costoUnitario"
                      type="number"
                      value={newItem.unitCost}
                      onChange={(e) =>
                        setNewItem({ ...newItem, unitCost: e.target.value })
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Proveedor</Label>
                    <Select
                      value={newItem.supplier}
                      onValueChange={(value) =>
                        setNewItem({ ...newItem, supplier: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.name}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación en Almacén</Label>
                  <Input
                    id="location"
                    value={newItem.location}
                    onChange={(e) =>
                      setNewItem({ ...newItem, location: e.target.value })
                    }
                    placeholder="Ej: Almacén A-1"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button onClick={handleAddItem}>Crear Item</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="inventario" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventario">Inventario</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="inventario" className="space-y-4">
          <InventoryFilters
            searchTerm={searchTerm}
            categoryFilter={categoryFilter}
            onSearchChange={setSearchTerm}
            onCategoryChange={setCategoryFilter}
          />
          <InventoryTable items={filteredItems} onReorder={handleReorder} />
        </TabsContent>

        <TabsContent value="movimientos" className="space-y-4">
          <MovementsHistory movements={movements} />
        </TabsContent>

        <TabsContent value="proveedores" className="space-y-4">
          <SuppliersList suppliers={suppliers} />
        </TabsContent>

        <TabsContent value="alertas" className="space-y-4">
          <InventoryAlerts items={inventoryItems} onReorder={handleReorder} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
