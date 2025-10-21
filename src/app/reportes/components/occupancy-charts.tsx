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
import {
  Line,
  LineChart,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface OccupancyChartsProps {
  occupancyData: Array<{
    date: string;
    occupancy: number;
    revenue: number;
  }>;
  guestTypeData: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
  chartConfig: {
    occupancy: { label: string };
    revenue: { label: string };
    satisfaction: { label: string };
    negocios: { label: string };
    turismo: { label: string };
    eventos: { label: string };
    otros: { label: string };
  };
}

export function OccupancyCharts({
  occupancyData,
  guestTypeData,
  chartConfig,
}: OccupancyChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Tendencia de Ocupación</CardTitle>
          <CardDescription>
            Evolución mensual de ocupación y ingresos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={occupancyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="occupancy"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribución por Tipo de Huésped</CardTitle>
          <CardDescription>
            Segmentación de huéspedes por propósito de viaje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <PieChart>
              <Pie
                data={guestTypeData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {guestTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
