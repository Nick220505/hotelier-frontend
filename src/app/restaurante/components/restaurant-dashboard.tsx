"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { RoomServiceOrder, MenuItem, BeverageInventoryItem, restaurantApi } from "@/lib/api/restaurant";
import { useAuthenticatedUser } from "@/hooks/use-authenticated-user";

interface RestaurantSale {
  date: string;
  roomService: number;
  restaurante: number;
  bar: number;
  total: number;
  orders: number;
}
import { RestaurantStats } from "./restaurant-stats";
import { RoomServiceOrders } from "./room-service-orders";
import { MenuTable } from "./menu-table";
import { InventoryTable } from "./inventory-table";
import { RoomServiceDialog } from "./room-service-dialog";
import { SalesTable } from "./sales-table";

interface RestaurantDashboardProps {
  initialData: {
    roomServiceOrders: RoomServiceOrder[];
    menuItems: MenuItem[];
    beverageInventory: BeverageInventoryItem[];
    restaurantSales: RestaurantSale[];
  };
}

export default function RestaurantDashboard({
  initialData,
}: RestaurantDashboardProps) {
  const { hasRole } = useAuthenticatedUser();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState<Set<string>>(new Set());

  // Initialize state with server data
  const [roomServiceOrders, setRoomServiceOrders] = useState<
    RoomServiceOrder[]
  >(initialData.roomServiceOrders);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialData.menuItems);
  const [beverageInventory, setBeverageInventory] = useState<
    BeverageInventoryItem[]
  >(initialData.beverageInventory);
  const restaurantSales = initialData.restaurantSales;

  const refreshOrders = async () => {
    try {
      const orders = await restaurantApi.getRoomServiceOrders();
      setRoomServiceOrders(orders);
    } catch (error) {
      console.error("Error refreshing orders:", error);
    }
  };

  const refreshMenuItems = async () => {
    try {
      const items = await restaurantApi.getMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error("Error refreshing menu items:", error);
    }
  };

  const handleDeleteMenuItem = async (item: MenuItem) => {
    try {
      await restaurantApi.deleteMenuItem(item);
      toast("Item eliminado", {
        description: "El item del menú ha sido eliminado exitosamente",
      });
      refreshMenuItems();
    } catch (error) {
      console.error("Error deleting menu item:", error);
      let errorMessage = "No se pudo eliminar el item del menú";
      
      if (error instanceof Error) {
        if (error.message.includes("Access denied") || error.message.includes("403")) {
          errorMessage = "No tienes permisos para eliminar items del menú. Contacta al administrador.";
        } else if (error.message.includes("Authentication required") || error.message.includes("401")) {
          errorMessage = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
        } else if (error.message) {
          errorMessage = error.message;
        }
      }
      
      toast("Error", {
        description: errorMessage,
      });
    }
  };

  const handleProcessOrder = async (orderId: string) => {
    setLoadingOrders(prev => new Set(prev).add(orderId));
    try {
      // Update backend first
      await restaurantApi.updateRoomServiceOrder(orderId, {
        status: "PREPARING",
      });
      
      // Update local state on success
      setRoomServiceOrders(
        roomServiceOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: "preparing" as const }
            : order,
        ),
      );
      
      toast("Estado actualizado", {
        description: "El pedido está siendo preparado",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast("Error", {
        description: "No se pudo actualizar el estado del pedido",
      });
    } finally {
      setLoadingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const handleCompleteOrder = async (orderId: string) => {
    setLoadingOrders(prev => new Set(prev).add(orderId));
    try {
      // Update backend first
      await restaurantApi.updateRoomServiceOrder(orderId, {
        status: "READY",
      });
      
      // Update local state on success
      setRoomServiceOrders(
        roomServiceOrders.map((order) =>
          order.id === orderId ? { ...order, status: "ready" as const } : order,
        ),
      );
      
      toast("Estado actualizado", {
        description: "El pedido está listo para entregar",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast("Error", {
        description: "No se pudo actualizar el estado del pedido",
      });
    } finally {
      setLoadingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const handleDeliverOrder = async (orderId: string) => {
    setLoadingOrders(prev => new Set(prev).add(orderId));
    try {
      // Update backend first
      await restaurantApi.updateRoomServiceOrder(orderId, {
        status: "DELIVERED",
      });
      
      // Update local state on success
      setRoomServiceOrders(
        roomServiceOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: "delivered" as const,
                estimatedTime: "Entregado",
              }
            : order,
        ),
      );
      
      toast("Estado actualizado", {
        description: "El pedido ha sido entregado exitosamente",
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast("Error", {
        description: "No se pudo actualizar el estado del pedido",
      });
    } finally {
      setLoadingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const handleRestock = async (itemId: string, newStock: number) => {
    setBeverageInventory(
      beverageInventory.map((item) =>
        item.id === itemId
          ? {
              ...item,
              stock: newStock,
              status: newStock > item.minimumStock 
                ? ("available" as const)
                : newStock === 0 
                ? ("agotado" as const)
                : ("low_stock" as const),
            }
          : item,
      ),
    );
  };

  const refreshBeverageInventory = async () => {
    try {
      const items = await restaurantApi.getBeverageInventory();
      setBeverageInventory(items);
    } catch (error) {
      console.error("Error refreshing inventory:", error);
    }
  };

  // Calculate stats
  const stats = {
    activeOrders: roomServiceOrders.filter((o) => o.status !== "delivered")
      .length,
    todayOrders: roomServiceOrders.length,
    revenue: roomServiceOrders.reduce((sum, order) => sum + order.total, 0),
    averageTime: 18,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Restaurante y Bar</h1>
          <p className="text-muted-foreground">
            Gestión de orders, menú e inventario
          </p>
        </div>
        {hasRole('cliente') && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Pedido Room Service
          </Button>
        )}
      </div>

      {/* Room Service Dialog */}
      <RoomServiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreateOrder={(order: RoomServiceOrder) => {
          toast("Pedido creado", {
            description: `Pedido para habitación ${order.room} creado exitosamente`,
          });
          setDialogOpen(false);
          refreshOrders(); // Refresh the orders list
        }}
      />

      {/* Quick Stats */}
      <RestaurantStats
        stats={{
          activeOrders: stats.activeOrders,
          todayOrders: stats.todayOrders,
          revenue: stats.revenue,
          averageTime: stats.averageTime,
          lowStockItems: beverageInventory.filter(
            (item) => item.status === "low_stock",
          ).length,
        }}
      />

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Room Service</TabsTrigger>
          <TabsTrigger value="menu">Menú</TabsTrigger>
          {!hasRole('cliente') && <TabsTrigger value="inventario">Inventario</TabsTrigger>}
          {!hasRole('cliente') && <TabsTrigger value="ventas">Ventas</TabsTrigger>}
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <RoomServiceOrders
            orders={roomServiceOrders}
            onProcessOrder={handleProcessOrder}
            onCompleteOrder={handleCompleteOrder}
            onDeliverOrder={handleDeliverOrder}
            loadingOrders={loadingOrders}
          />
        </TabsContent>

        <TabsContent value="menu" className="space-y-4">
          <MenuTable
            menuItems={menuItems}
            onDeleteItem={handleDeleteMenuItem}
            onRefresh={refreshMenuItems}
          />
        </TabsContent>

        {!hasRole('cliente') && (
          <TabsContent value="inventario" className="space-y-4">
            <InventoryTable
              items={beverageInventory}
              onRestock={handleRestock}
              onRefresh={refreshBeverageInventory}
            />
          </TabsContent>
        )}

        {!hasRole('cliente') && (
          <TabsContent value="ventas" className="space-y-4">
            <SalesTable sales={restaurantSales} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
