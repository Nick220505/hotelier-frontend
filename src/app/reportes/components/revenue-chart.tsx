"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparación de Ingresos y Gastos Mensuales</CardTitle>
        <CardDescription>
          Comparativa de ingresos, gastos y ganancias por mes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#888" }}
              tickLine={{ stroke: "#888" }}
            />
            <YAxis tick={{ fill: "#888" }} tickLine={{ stroke: "#888" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Legend />
            <Bar
              dataKey="revenue"
              name="Ingresos"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="expenses"
              name="Gastos"
              fill="#ef4444"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="profit"
              name="Ganancia"
              fill="#10b981"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
