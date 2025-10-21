"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, DollarSign, Activity, Users } from "lucide-react";

interface ReportsKPIsProps {
  kpis: {
    averageOccupancy: number;
    revenuePerRoomDisponible: number;
    satisfaccionGeneral: number;
    averageStayTime: number;
  };
}

export function ReportsKPIs({ kpis }: ReportsKPIsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ocupación Promedio
          </CardTitle>
          <BarChart3 className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.averageOccupancy}%</div>
          <p className="text-xs text-muted-foreground">+2.5% del mes pasado</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">RevPAR</CardTitle>
          <DollarSign className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${kpis.revenuePerRoomDisponible.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">+4.1% del mes pasado</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Satisfacción General
          </CardTitle>
          <Activity className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {kpis.satisfaccionGeneral}/5.0
          </div>
          <p className="text-xs text-muted-foreground">+0.2 del mes pasado</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Estancia Promedio
          </CardTitle>
          <Users className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{kpis.averageStayTime} días</div>
          <p className="text-xs text-muted-foreground">
            +0.3 días del mes pasado
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
