"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, ShoppingCart, Clock, CheckCircle } from "lucide-react";
import { useAuthenticatedUser } from "@/hooks/use-authenticated-user";

interface RestaurantStatsProps {
  stats: {
    activeOrders: number;
    todayOrders: number;
    revenue: number;
    averageTime: number;
    lowStockItems?: number;
  };
}

export function RestaurantStats({ stats }: RestaurantStatsProps) {
  const { hasRole } = useAuthenticatedUser();

  return (
    <div
      className={`grid gap-4 md:grid-cols-2 ${!hasRole("cliente") ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pedidos Activos</CardTitle>
          <Utensils className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeOrders}</div>
          <p className="text-xs text-muted-foreground">
            Room service en proceso
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pedidos Hoy</CardTitle>
          <ShoppingCart className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.todayOrders}</div>
          <p className="text-xs text-muted-foreground">Total de orders</p>
        </CardContent>
      </Card>

      {!hasRole("cliente") && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ventas del Día
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.revenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Ingresos totales</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
          <Clock className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageTime} min</div>
          <p className="text-xs text-muted-foreground">Entrega room service</p>
        </CardContent>
      </Card>
    </div>
  );
}
