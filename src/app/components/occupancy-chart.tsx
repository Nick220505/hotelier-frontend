"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";

interface OccupancyData {
  name: string;
  value: number;
  fill: string;
}

interface OccupancyChartProps {
  data: OccupancyData[];
  mounted: boolean;
  occupiedRooms: number;
  availableRooms: number;
}

const chartConfig = {
  occupied: {
    label: "Ocupadas",
  },
  available: {
    label: "Disponibles",
  },
};

export function OccupancyChart({
  data,
  mounted,
  occupiedRooms,
  availableRooms,
}: OccupancyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ocupación de Habitaciones</CardTitle>
        <CardDescription>Distribución actual de habitaciones</CardDescription>
      </CardHeader>
      <CardContent>
        {mounted ? (
          <>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-chart-1 rounded-full"></div>
                <span className="text-sm">Ocupadas ({occupiedRooms})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                <span className="text-sm">Disponibles ({availableRooms})</span>
              </div>
            </div>
          </>
        ) : (
          <div className="mx-auto aspect-square max-h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground">Cargando gráfica...</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
